"use strict";

/*
  api/tmdb.js  -  the secure "middle man" between your website and TMDB / OMDb.
  Your secret keys live ONLY here (as environment variables on the server).
  They are never sent to the visitor's browser.

  Environment variables:
    TMDB_API_KEY   (required)  your TMDB key (v3 key or v4 "Read Access Token")
    OMDB_API_KEY   (optional)  your OMDb key; lets the site show real IMDb ratings
*/

const TMDB = "https://api.themoviedb.org/3";
const OMDB = "https://www.omdbapi.com/";

// ---------- small in-memory cache (helps while the server instance stays warm) ----------
const memory = new Map();
async function remember(key, ttlMs, make) {
  const hit = memory.get(key);
  if (hit && hit.exp > Date.now()) return hit.value;
  const value = await make();
  memory.set(key, { exp: Date.now() + ttlMs, value });
  if (memory.size > 500) memory.delete(memory.keys().next().value);
  return value;
}

function fail(status, code, message) {
  const e = new Error(message);
  e.status = status;
  e.code = code;
  return e;
}

// ---------- talking to TMDB ----------
async function tmdb(path, params) {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw fail(500, "missing_env", "The movie database is not set up yet: the TMDB_API_KEY environment variable is missing.");
  }
  const url = new URL(TMDB + path);
  Object.keys(params || {}).forEach((k) => {
    if (params[k] !== undefined && params[k] !== "") url.searchParams.set(k, params[k]);
  });
  const headers = { accept: "application/json" };
  if (key.length > 40) headers.Authorization = "Bearer " + key; // v4 token
  else url.searchParams.set("api_key", key);                    // v3 key

  const r = await fetch(url, { headers });
  if (r.status === 429) throw fail(429, "rate_limited", "The movie database is busy right now. Please try again in a moment.");
  if (r.status === 401) throw fail(502, "bad_key", "The TMDB key was rejected. Check the TMDB_API_KEY value.");
  if (!r.ok) throw fail(502, "upstream", "The movie database had a problem (" + r.status + ").");
  return r.json();
}

// ---------- IMDb rating (through OMDb, only if you added OMDB_API_KEY) ----------
async function imdbRating(imdbId) {
  const key = process.env.OMDB_API_KEY;
  if (!key || !/^tt\d{6,10}$/.test(imdbId || "")) return null;
  return remember("omdb:" + imdbId, 24 * 3600e3, async () => {
    try {
      const url = new URL(OMDB);
      url.searchParams.set("i", imdbId);
      url.searchParams.set("apikey", key);
      const r = await fetch(url);
      if (!r.ok) return null;
      const d = await r.json();
      const n = parseFloat(d && d.imdbRating);
      return Number.isFinite(n) ? n : null;
    } catch (e) {
      return null;
    }
  });
}

async function movieDetails(id) {
  return remember("movie:" + id, 6 * 3600e3, async () => {
    const d = await tmdb("/movie/" + id, {});
    const imdbId = /^tt\d{6,10}$/.test(d.imdb_id || "") ? d.imdb_id : null;
    return {
      id: d.id,
      title: d.title,
      tagline: d.tagline || "",
      overview: d.overview || "",
      release_date: d.release_date || "",
      runtime: d.runtime || null,
      genres: (d.genres || []).map((g) => g.name),
      poster_path: d.poster_path || null,
      imdb_id: imdbId,
      rating: await imdbRating(imdbId),
    };
  });
}

// ---------- shaping and checking ----------
function slim(m) {
  return {
    id: m.id,
    title: m.title,
    release_date: m.release_date || "",
    poster_path: m.poster_path || null,
    genre_ids: m.genre_ids || [],
    overview: m.overview || "",
    vote_average: m.vote_average || 0,
  };
}

function listReply(d) {
  return {
    page: d.page || 1,
    total_pages: Math.min(d.total_pages || 1, 20),
    results: (d.results || []).filter((m) => m.title).map(slim),
  };
}

function int(v, min, max, fallback) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrow() {
  return new Date(Date.now() + 864e5).toISOString().slice(0, 10);
}

// ---------- the actions the website can ask for ----------
const actions = {
  // find one movie by title (and year) so we can show its poster
  async search(q) {
    const query = String(q.query || "").slice(0, 100).trim();
    if (!query) throw fail(400, "bad_request", "Missing movie title.");
    const year = /^\d{4}$/.test(q.year || "") ? q.year : "";
    let d = await tmdb("/search/movie", { query, primary_release_year: year, include_adult: "false" });
    if (!(d.results || []).length && year) {
      d = await tmdb("/search/movie", { query, include_adult: "false" }); // year can differ by country
    }
    const lower = query.toLowerCase();
    const results = (d.results || [])
      .filter((m) => m.title)
      .sort((a, b) => {
        const ea = String(a.title).toLowerCase() === lower ? 1 : 0;
        const eb = String(b.title).toLowerCase() === lower ? 1 : 0;
        return eb - ea || (b.poster_path ? 1 : 0) - (a.poster_path ? 1 : 0) || b.popularity - a.popularity;
      })
      .slice(0, 5)
      .map(slim);
    return { body: { results }, maxAge: 86400 };
  },

  async trending(q) {
    const win = q.window === "day" ? "day" : "week";
    const d = await tmdb("/trending/movie/" + win, { page: int(q.page, 1, 20, 1) });
    return { body: listReply(d), maxAge: 1800 };
  },

  // newest releases first ("released"), or what is coming soon ("upcoming")
  async latest(q) {
    const upcoming = q.status === "upcoming";
    const page = int(q.page, 1, 20, 1);
    const genre = /^\d{1,5}$/.test(q.genre || "") ? q.genre : "";
    const base = { page, include_adult: "false", with_genres: genre };

    // first choice: movies with a theatrical release in the US
    const params = Object.assign({}, base, { region: "US", with_release_type: "3|2" });
    if (upcoming) {
      params["release_date.gte"] = tomorrow();
      params.sort_by = "primary_release_date.asc";
    } else {
      params["release_date.lte"] = today();
      params.sort_by = "primary_release_date.desc";
    }
    let d = await tmdb("/discover/movie", params);

    // fallback: if that returns nothing, use the plain release date
    if (!(d.results || []).length && page === 1) {
      const plain = Object.assign({}, base);
      if (upcoming) {
        plain["primary_release_date.gte"] = tomorrow();
        plain.sort_by = "primary_release_date.asc";
      } else {
        plain["primary_release_date.lte"] = today();
        plain.sort_by = "primary_release_date.desc";
        plain["vote_count.gte"] = "10";
      }
      d = await tmdb("/discover/movie", plain);
    }
    return { body: listReply(d), maxAge: 1800 };
  },

  // well-rated movies of a genre (used to fill gaps in the "For You" suggestions)
  async discover(q) {
    if (!/^\d{1,5}([,|]\d{1,5})*$/.test(q.with_genres || "")) throw fail(400, "bad_request", "Bad genre.");
    const params = {
      page: int(q.page, 1, 5, 1),
      with_genres: q.with_genres,
      sort_by: "vote_average.desc",
      "vote_count.gte": "1500",
      include_adult: "false",
    };
    if (/^\d{4}-\d{2}-\d{2}$/.test(q.date_lte || "")) {
      params["primary_release_date.lte"] = q.date_lte;
      params["vote_count.gte"] = "800";
    }
    const d = await tmdb("/discover/movie", params);
    return { body: listReply(d), maxAge: 21600 };
  },

  async details(q) {
    const id = int(q.id, 1, 99999999, 0);
    if (!id) throw fail(400, "bad_request", "Bad movie id.");
    return { body: await movieDetails(id), maxAge: 21600 };
  },

  async rating(q) {
    const id = int(q.id, 1, 99999999, 0);
    if (!id) throw fail(400, "bad_request", "Bad movie id.");
    const d = await movieDetails(id);
    return { body: { id, imdb_id: d.imdb_id, rating: d.rating }, maxAge: 21600 };
  },
};

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") throw fail(405, "method", "Only GET is allowed.");
    const q = req.query || Object.fromEntries(new URL(req.url, "http://localhost").searchParams);
    const run = Object.prototype.hasOwnProperty.call(actions, q.action) ? actions[q.action] : null;
    if (!run) throw fail(400, "bad_request", "Unknown action.");
    const out = await run(q);
    res.setHeader("Cache-Control", "public, s-maxage=" + out.maxAge + ", stale-while-revalidate=" + out.maxAge * 2);
    res.status(200).json(out.body);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(e.status || 500).json({ error: e.code || "server_error", message: e.status ? e.message : "Something went wrong on the server." });
  }
};
