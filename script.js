/* ==========================================
   Movie Finder - script.js
   Handles: For You (mood + genre + experience), Trending Now,
   Latest Releases, posters, ratings and the details window.
   Movie data from TMDB arrives through /api/tmdb (your secure server function).
   ========================================== */
(function () {
  "use strict";

  /* ---------- Hand-picked movies (ratings are approximate IMDb ratings) ----------
     t=title y=year l=minutes g=genres m=moods x=experiences r=rating d=director o=description */
  var CURATED = [
    {"t":"The Shawshank Redemption","y":1994,"l":142,"g":["drama"],"m":["thoughtful","sad"],"x":["think","emotional","inspiring","nostalgic"],"r":9.3,"d":"Frank Darabont","o":"A banker wrongly sent to prison builds a quiet friendship and holds onto hope for decades."},
    {"t":"The Godfather","y":1972,"l":175,"g":["drama","thriller"],"m":["thoughtful","excited"],"x":["intense","nostalgic","think"],"r":9.2,"d":"Francis Ford Coppola","o":"The aging head of a crime family hands his empire to his reluctant youngest son."},
    {"t":"The Dark Knight","y":2008,"l":152,"g":["action","thriller"],"m":["excited","thoughtful"],"x":["intense","think"],"r":9.0,"d":"Christopher Nolan","o":"Batman faces the Joker, a chaotic mastermind who pushes Gotham to its breaking point."},
    {"t":"Schindler's List","y":1993,"l":195,"g":["drama"],"m":["sad","thoughtful"],"x":["emotional","think","nostalgic"],"r":9.0,"d":"Steven Spielberg","o":"A businessman saves over a thousand Jewish people from the Holocaust."},
    {"t":"12 Angry Men","y":1957,"l":96,"g":["drama","mystery"],"m":["thoughtful"],"x":["think","nostalgic"],"r":9.0,"d":"Sidney Lumet","o":"A lone juror makes eleven others reconsider the case of a young man accused of murder."},
    {"t":"The Lord of the Rings: The Return of the King","y":2003,"l":201,"g":["adventure","action","drama"],"m":["excited","thoughtful"],"x":["inspiring","intense","nostalgic"],"r":9.0,"d":"Peter Jackson","o":"The final battle for Middle-earth begins as Frodo nears Mount Doom."},
    {"t":"The Fellowship of the Ring","y":2001,"l":178,"g":["adventure","action"],"m":["excited","thoughtful"],"x":["inspiring","intense","nostalgic"],"r":8.9,"d":"Peter Jackson","o":"A hobbit and his companions set out to destroy a powerful ring."},
    {"t":"Pulp Fiction","y":1994,"l":154,"g":["thriller","drama"],"m":["excited","thoughtful"],"x":["intense","nostalgic"],"r":8.9,"d":"Quentin Tarantino","o":"Intertwined stories of hitmen, a boxer and a crime boss in Los Angeles."},
    {"t":"Forrest Gump","y":1994,"l":142,"g":["drama","romance","comedy"],"m":["happy","sad","thoughtful"],"x":["emotional","inspiring","nostalgic","easy"],"r":8.8,"d":"Robert Zemeckis","o":"A kind-hearted man unwittingly takes part in decades of history while chasing his lifelong love."},
    {"t":"Inception","y":2010,"l":148,"g":["scifi","thriller","action"],"m":["excited","thoughtful"],"x":["think","intense"],"r":8.8,"d":"Christopher Nolan","o":"A thief who steals secrets from dreams is offered a chance to plant an idea instead."},
    {"t":"Fight Club","y":1999,"l":139,"g":["drama","thriller"],"m":["excited","thoughtful"],"x":["intense","think"],"r":8.8,"d":"David Fincher","o":"An office worker and a soap salesman start an underground fight club that spirals out of control."},
    {"t":"Interstellar","y":2014,"l":169,"g":["scifi","drama","adventure"],"m":["thoughtful","sad"],"x":["think","emotional","inspiring"],"r":8.7,"d":"Christopher Nolan","o":"Astronauts travel through a wormhole in search of a new home for humanity."},
    {"t":"The Matrix","y":1999,"l":136,"g":["scifi","action"],"m":["excited","thoughtful"],"x":["intense","think","nostalgic"],"r":8.7,"d":"The Wachowskis","o":"A hacker learns that his reality is a simulation and joins a rebellion against its machine rulers."},
    {"t":"Life Is Beautiful","y":1997,"l":116,"g":["drama","comedy","romance"],"m":["sad","thoughtful"],"x":["emotional","inspiring","nostalgic"],"r":8.6,"d":"Roberto Benigni","o":"A father uses humor and imagination to shield his young son from the horrors of a wartime camp."},
    {"t":"Se7en","y":1995,"l":127,"g":["thriller","mystery"],"m":["excited","thoughtful"],"x":["intense","think","nostalgic"],"r":8.6,"d":"David Fincher","o":"Two detectives hunt a serial killer whose crimes are inspired by the seven deadly sins."},
    {"t":"Spirited Away","y":2001,"l":125,"g":["animation","adventure"],"m":["chill","thoughtful","happy"],"x":["easy","emotional","nostalgic","think"],"r":8.6,"d":"Hayao Miyazaki","o":"A girl enters a world of spirits and must work in a bathhouse to save her parents."},
    {"t":"The Green Mile","y":1999,"l":189,"g":["drama"],"m":["sad","thoughtful"],"x":["emotional","inspiring","nostalgic"],"r":8.6,"d":"Frank Darabont","o":"A death-row guard discovers one of his prisoners has a miraculous gift."},
    {"t":"Terminator 2: Judgment Day","y":1991,"l":137,"g":["action","scifi"],"m":["excited"],"x":["intense","nostalgic"],"r":8.6,"d":"James Cameron","o":"A reprogrammed machine protects a boy from a more advanced killer robot."},
    {"t":"Star Wars: A New Hope","y":1977,"l":121,"g":["scifi","adventure","action"],"m":["excited","happy"],"x":["easy","nostalgic","inspiring"],"r":8.6,"d":"George Lucas","o":"A farm boy joins a rebellion to rescue a princess and stop a planet-destroying weapon."},
    {"t":"The Silence of the Lambs","y":1991,"l":118,"g":["thriller","horror","mystery"],"m":["excited"],"x":["intense","nostalgic"],"r":8.6,"d":"Jonathan Demme","o":"A young FBI trainee seeks help from an imprisoned killer to catch another murderer."},
    {"t":"Whiplash","y":2014,"l":106,"g":["drama"],"m":["excited","thoughtful"],"x":["intense","inspiring"],"r":8.5,"d":"Damien Chazelle","o":"A young drummer is pushed to the edge by a ruthless conservatory instructor."},
    {"t":"Parasite","y":2019,"l":132,"g":["thriller","drama","comedy"],"m":["thoughtful","excited"],"x":["think","intense"],"r":8.5,"d":"Bong Joon-ho","o":"A poor family schemes its way into the lives of a wealthy household, with unexpected consequences."},
    {"t":"Rear Window","y":1954,"l":112,"g":["thriller","mystery"],"m":["chill","excited"],"x":["intense","nostalgic","think"],"r":8.5,"d":"Alfred Hitchcock","o":"A photographer stuck at home with a broken leg suspects his neighbor of murder."},
    {"t":"Back to the Future","y":1985,"l":116,"g":["scifi","comedy","adventure"],"m":["happy","excited"],"x":["easy","nostalgic","inspiring"],"r":8.5,"d":"Robert Zemeckis","o":"A teenager is sent back to 1955 and must make sure his parents fall in love."},
    {"t":"Gladiator","y":2000,"l":155,"g":["action","drama","adventure"],"m":["excited"],"x":["intense","inspiring","nostalgic"],"r":8.5,"d":"Ridley Scott","o":"A betrayed Roman general returns as a gladiator to take revenge on the emperor."},
    {"t":"The Lion King","y":1994,"l":88,"g":["animation","drama","adventure"],"m":["happy","sad"],"x":["emotional","easy","nostalgic"],"r":8.5,"d":"Roger Allers & Rob Minkoff","o":"A young lion prince flees his kingdom, then must return to take his place."},
    {"t":"Grave of the Fireflies","y":1988,"l":89,"g":["animation","drama"],"m":["sad"],"x":["emotional"],"r":8.5,"d":"Isao Takahata","o":"A brother and sister struggle to survive in Japan during the last months of World War II."},
    {"t":"The Pianist","y":2002,"l":150,"g":["drama"],"m":["sad","thoughtful"],"x":["emotional","inspiring"],"r":8.5,"d":"Roman Polanski","o":"A Jewish pianist tries to survive the destruction of the Warsaw ghetto."},
    {"t":"Casablanca","y":1942,"l":102,"g":["romance","drama"],"m":["romantic","sad"],"x":["emotional","nostalgic"],"r":8.5,"d":"Michael Curtiz","o":"A cafe owner in wartime Morocco must choose between love and doing the right thing."},
    {"t":"The Intouchables","y":2011,"l":112,"g":["comedy","drama"],"m":["happy","sad","thoughtful"],"x":["emotional","inspiring","easy"],"r":8.5,"d":"Olivier Nakache & Eric Toledano","o":"A wealthy man with paralysis hires an unlikely caregiver and they become close friends."},
    {"t":"The Prestige","y":2006,"l":130,"g":["mystery","thriller","drama"],"m":["thoughtful","excited"],"x":["think","intense"],"r":8.5,"d":"Christopher Nolan","o":"Two rival magicians in Victorian London go to dangerous lengths to outdo each other."},
    {"t":"The Usual Suspects","y":1995,"l":106,"g":["mystery","thriller"],"m":["thoughtful","excited"],"x":["think","nostalgic"],"r":8.5,"d":"Bryan Singer","o":"A survivor tells police the story of a criminal gang and their mysterious boss."},
    {"t":"Psycho","y":1960,"l":109,"g":["horror","thriller","mystery"],"m":["excited"],"x":["intense","nostalgic"],"r":8.5,"d":"Alfred Hitchcock","o":"A secretary on the run stops at a roadside motel run by a strange young man."},
    {"t":"Alien","y":1979,"l":117,"g":["horror","scifi","thriller"],"m":["excited"],"x":["intense","nostalgic"],"r":8.5,"d":"Ridley Scott","o":"The crew of a spaceship finds that something deadly has come aboard."},
    {"t":"Three Idiots","y":2009,"l":170,"g":["comedy","drama"],"m":["happy","thoughtful"],"x":["easy","inspiring","emotional"],"r":8.4,"d":"Rajkumar Hirani","o":"Three engineering students navigate friendship, pressure and the courage to chase what they truly love."},
    {"t":"Spider-Man: Into the Spider-Verse","y":2018,"l":117,"g":["animation","action","adventure"],"m":["excited","happy"],"x":["easy","inspiring","intense"],"r":8.4,"d":"Bob Persichetti, Peter Ramsey & Rodney Rothman","o":"Miles Morales becomes Spider-Man and meets heroes from other dimensions."},
    {"t":"WALL-E","y":2008,"l":98,"g":["animation","scifi","romance","adventure"],"m":["happy","chill","romantic"],"x":["easy","emotional","think"],"r":8.4,"d":"Andrew Stanton","o":"A lonely robot left to clean up Earth finds love and sets off on an adventure through space."},
    {"t":"Coco","y":2017,"l":105,"g":["animation","adventure"],"m":["sad","happy","thoughtful"],"x":["emotional","easy","inspiring"],"r":8.4,"d":"Lee Unkrich","o":"A boy who dreams of music journeys into the Land of the Dead to uncover his family's story."},
    {"t":"Your Name","y":2016,"l":106,"g":["animation","romance","drama"],"m":["romantic","sad"],"x":["emotional"],"r":8.4,"d":"Makoto Shinkai","o":"Two teenagers mysteriously swap bodies and form a bond across distance and time."},
    {"t":"Raiders of the Lost Ark","y":1981,"l":115,"g":["adventure","action"],"m":["excited","happy"],"x":["easy","intense","nostalgic"],"r":8.4,"d":"Steven Spielberg","o":"Archaeologist Indiana Jones races the Nazis to find the legendary Ark of the Covenant."},
    {"t":"Joker","y":2019,"l":122,"g":["drama","thriller"],"m":["thoughtful","sad"],"x":["intense","think"],"r":8.4,"d":"Todd Phillips","o":"A lonely comedian is pushed over the edge by a society that ignores him."},
    {"t":"Avengers: Endgame","y":2019,"l":181,"g":["action","adventure","scifi"],"m":["excited","sad"],"x":["intense","emotional"],"r":8.4,"d":"Anthony Russo & Joe Russo","o":"The surviving heroes make one last attempt to undo a devastating loss."},
    {"t":"Memento","y":2000,"l":113,"g":["mystery","thriller"],"m":["thoughtful","excited"],"x":["think","intense"],"r":8.4,"d":"Christopher Nolan","o":"A man with short-term memory loss hunts for his wife's killer using notes and tattoos."},
    {"t":"The Shining","y":1980,"l":146,"g":["horror","drama"],"m":["excited","thoughtful"],"x":["intense","nostalgic"],"r":8.4,"d":"Stanley Kubrick","o":"A family caretaking an isolated hotel in winter slowly falls under its dark influence."},
    {"t":"Good Will Hunting","y":1997,"l":126,"g":["drama"],"m":["thoughtful","sad"],"x":["emotional","inspiring","think","nostalgic"],"r":8.3,"d":"Gus Van Sant","o":"A troubled genius working as a janitor is helped by a therapist to face his past."},
    {"t":"Taare Zameen Par","y":2007,"l":165,"g":["drama"],"m":["sad","thoughtful"],"x":["emotional","inspiring"],"r":8.3,"d":"Aamir Khan","o":"A teacher discovers why a creative young boy is struggling at school and helps him find his confidence."},
    {"t":"Up","y":2009,"l":96,"g":["animation","adventure","comedy"],"m":["sad","happy"],"x":["emotional","easy"],"r":8.3,"d":"Pete Docter","o":"An elderly widower ties thousands of balloons to his house and sets off for South America."},
    {"t":"Toy Story","y":1995,"l":81,"g":["animation","comedy","adventure"],"m":["happy","chill"],"x":["easy","nostalgic"],"r":8.3,"d":"John Lasseter","o":"A cowboy doll feels threatened when a shiny new space ranger toy arrives."},
    {"t":"Princess Mononoke","y":1997,"l":134,"g":["animation","adventure","action"],"m":["excited","thoughtful"],"x":["think","intense"],"r":8.3,"d":"Hayao Miyazaki","o":"A young prince is drawn into a war between forest gods and an iron-making town."},
    {"t":"Eternal Sunshine of the Spotless Mind","y":2004,"l":108,"g":["romance","drama","scifi"],"m":["romantic","sad","thoughtful"],"x":["emotional","think"],"r":8.3,"d":"Michel Gondry","o":"After a painful breakup, a couple each have their memories of the other erased."},
    {"t":"Oppenheimer","y":2023,"l":180,"g":["drama"],"m":["thoughtful"],"x":["think","intense"],"r":8.3,"d":"Christopher Nolan","o":"The story of the scientist who led the creation of the first atomic bomb."},
    {"t":"Dangal","y":2016,"l":161,"g":["drama"],"m":["sad","excited"],"x":["inspiring","emotional"],"r":8.3,"d":"Nitesh Tiwari","o":"A former wrestler trains his daughters to become champions against all odds."},
    {"t":"Vertigo","y":1958,"l":128,"g":["mystery","thriller","romance"],"m":["thoughtful","romantic"],"x":["think","nostalgic"],"r":8.3,"d":"Alfred Hitchcock","o":"A retired detective with a fear of heights becomes obsessed with a woman he is hired to follow."},
    {"t":"Amelie","y":2001,"l":122,"g":["romance","comedy"],"m":["happy","romantic","chill"],"x":["easy","nostalgic"],"r":8.3,"d":"Jean-Pierre Jeunet","o":"A shy Parisian waitress secretly brightens other people's lives and finds love."},
    {"t":"Top Gun: Maverick","y":2022,"l":130,"g":["action","drama"],"m":["excited","happy"],"x":["intense","inspiring","nostalgic"],"r":8.2,"d":"Joseph Kosinski","o":"A veteran pilot trains a new generation of elite flyers for a near-impossible mission."},
    {"t":"Shutter Island","y":2010,"l":138,"g":["thriller","mystery"],"m":["excited","thoughtful"],"x":["intense","think"],"r":8.2,"d":"Martin Scorsese","o":"A U.S. marshal investigates a patient's disappearance from a remote island psychiatric hospital."},
    {"t":"Howl's Moving Castle","y":2004,"l":119,"g":["animation","romance","adventure"],"m":["chill","romantic","happy"],"x":["easy","emotional","nostalgic"],"r":8.2,"d":"Hayao Miyazaki","o":"A young woman cursed to look old finds refuge in a wizard's walking castle."},
    {"t":"Finding Nemo","y":2003,"l":100,"g":["animation","adventure","comedy"],"m":["happy","chill"],"x":["easy","emotional","nostalgic"],"r":8.2,"d":"Andrew Stanton","o":"A worried clownfish crosses the ocean to find his missing son."},
    {"t":"The Truman Show","y":1998,"l":103,"g":["comedy","drama","scifi"],"m":["thoughtful","happy"],"x":["think","nostalgic"],"r":8.2,"d":"Peter Weir","o":"A man slowly discovers that his whole life is a television show."},
    {"t":"Jurassic Park","y":1993,"l":127,"g":["adventure","scifi","action"],"m":["excited","happy"],"x":["intense","nostalgic","easy"],"r":8.2,"d":"Steven Spielberg","o":"A theme park of cloned dinosaurs turns deadly when its security fails."},
    {"t":"Zindagi Na Milegi Dobara","y":2011,"l":155,"g":["comedy","drama","adventure"],"m":["happy","chill"],"x":["easy","inspiring"],"r":8.2,"d":"Zoya Akhtar","o":"Three friends on a bachelor trip across Spain face their fears and rediscover each other."},
    {"t":"Pan's Labyrinth","y":2006,"l":118,"g":["drama","horror","adventure"],"m":["thoughtful","sad"],"x":["think","emotional","intense"],"r":8.2,"d":"Guillermo del Toro","o":"In 1940s Spain, a girl escapes a cruel stepfather into a dark fairy-tale world."},
    {"t":"Die Hard","y":1988,"l":132,"g":["action","thriller"],"m":["excited","happy"],"x":["intense","nostalgic","easy"],"r":8.2,"d":"John McTiernan","o":"An off-duty cop battles terrorists who have taken over a Los Angeles skyscraper."},
    {"t":"Kill Bill: Vol. 1","y":2003,"l":111,"g":["action","thriller"],"m":["excited"],"x":["intense"],"r":8.2,"d":"Quentin Tarantino","o":"A former assassin wakes from a coma and sets out for revenge."},
    {"t":"Klaus","y":2019,"l":96,"g":["animation","comedy","adventure"],"m":["happy","chill"],"x":["easy","emotional"],"r":8.2,"d":"Sergio Pablos","o":"A postman and a reclusive toymaker create a new Christmas tradition."},
    {"t":"The Grand Budapest Hotel","y":2014,"l":99,"g":["comedy","adventure"],"m":["happy","chill"],"x":["easy","think"],"r":8.1,"d":"Wes Anderson","o":"A legendary hotel concierge and his loyal lobby boy get tangled in a stolen painting and a family fortune."},
    {"t":"Mad Max: Fury Road","y":2015,"l":120,"g":["action","adventure","scifi"],"m":["excited"],"x":["intense"],"r":8.1,"d":"George Miller","o":"A relentless desert chase as a warrior and a drifter flee a brutal tyrant."},
    {"t":"Before Sunrise","y":1995,"l":101,"g":["romance","drama"],"m":["romantic","chill","thoughtful"],"x":["emotional","think","nostalgic"],"r":8.1,"d":"Richard Linklater","o":"Two strangers meet on a train and spend one night talking their way around Vienna."},
    {"t":"Gone Girl","y":2014,"l":149,"g":["thriller","mystery"],"m":["excited"],"x":["intense","think"],"r":8.1,"d":"David Fincher","o":"A man becomes the prime suspect when his wife disappears on their anniversary."},
    {"t":"Inside Out","y":2015,"l":95,"g":["animation","comedy","adventure"],"m":["happy","sad","thoughtful"],"x":["emotional","easy","think"],"r":8.1,"d":"Pete Docter","o":"A girl's emotions guide her through a big move and a difficult change."},
    {"t":"Monsters, Inc.","y":2001,"l":92,"g":["animation","comedy","adventure"],"m":["happy","chill"],"x":["easy","nostalgic"],"r":8.1,"d":"Pete Docter","o":"Two monsters who scare children for a living meet a little girl who changes everything."},
    {"t":"Ratatouille","y":2007,"l":111,"g":["animation","comedy"],"m":["happy","chill","romantic"],"x":["easy","inspiring"],"r":8.1,"d":"Brad Bird","o":"A rat with a gift for cooking teams up with a young kitchen worker in a Paris restaurant."},
    {"t":"My Neighbor Totoro","y":1988,"l":86,"g":["animation","adventure"],"m":["chill","happy"],"x":["easy","nostalgic"],"r":8.1,"d":"Hayao Miyazaki","o":"Two sisters move to the countryside and befriend gentle forest spirits."},
    {"t":"Dil Chahta Hai","y":2001,"l":183,"g":["comedy","drama","romance"],"m":["happy","chill"],"x":["easy","nostalgic"],"r":8.1,"d":"Farhan Akhtar","o":"Three close friends face love, growing up and drifting apart."},
    {"t":"PK","y":2014,"l":153,"g":["comedy","drama","scifi"],"m":["happy","thoughtful"],"x":["easy","think"],"r":8.1,"d":"Rajkumar Hirani","o":"An innocent alien stranded on Earth asks awkward questions about religion and belief."},
    {"t":"Lagaan","y":2001,"l":224,"g":["drama","adventure"],"m":["excited","thoughtful"],"x":["inspiring","nostalgic"],"r":8.1,"d":"Ashutosh Gowariker","o":"Villagers in colonial India take on their rulers in a high-stakes cricket match to escape a crushing tax."},
    {"t":"Prisoners","y":2013,"l":153,"g":["thriller","mystery","drama"],"m":["sad","excited"],"x":["intense","emotional"],"r":8.1,"d":"Denis Villeneuve","o":"A father takes matters into his own hands when his daughter and her friend go missing."},
    {"t":"Jaws","y":1975,"l":124,"g":["thriller","adventure","horror"],"m":["excited"],"x":["intense","nostalgic"],"r":8.1,"d":"Steven Spielberg","o":"A police chief, a scientist and a fisherman hunt a great white shark terrorizing a beach town."},
    {"t":"The Exorcist","y":1973,"l":122,"g":["horror"],"m":["excited"],"x":["intense","nostalgic"],"r":8.1,"d":"William Friedkin","o":"Two priests try to save a young girl from a terrifying possession."},
    {"t":"Pirates of the Caribbean: The Curse of the Black Pearl","y":2003,"l":143,"g":["adventure","action","comedy"],"m":["happy","excited"],"x":["easy","nostalgic"],"r":8.1,"d":"Gore Verbinski","o":"A blacksmith teams up with a quirky pirate to rescue the governor's daughter from cursed buccaneers."},
    {"t":"Hachi: A Dog's Tale","y":2009,"l":93,"g":["drama"],"m":["sad"],"x":["emotional"],"r":8.1,"d":"Lasse Hallstrom","o":"A loyal dog keeps waiting at the train station for his owner who never returns."},
    {"t":"Dead Poets Society","y":1989,"l":128,"g":["drama","comedy"],"m":["thoughtful","sad"],"x":["inspiring","emotional","nostalgic"],"r":8.1,"d":"Peter Weir","o":"An English teacher inspires his students to think for themselves."},
    {"t":"How to Train Your Dragon","y":2010,"l":98,"g":["animation","adventure","comedy"],"m":["happy","excited"],"x":["easy","inspiring"],"r":8.1,"d":"Chris Sanders & Dean DeBlois","o":"A young Viking befriends the dragon his people have always feared."},
    {"t":"La La Land","y":2016,"l":128,"g":["romance","drama"],"m":["romantic","sad","happy"],"x":["emotional","inspiring"],"r":8.0,"d":"Damien Chazelle","o":"An aspiring actress and a jazz pianist chase their dreams in Los Angeles, and each other."},
    {"t":"The Martian","y":2015,"l":144,"g":["scifi","adventure","drama"],"m":["happy","excited","thoughtful"],"x":["easy","inspiring","think"],"r":8.0,"d":"Ridley Scott","o":"An astronaut stranded on Mars uses science and humor to survive until rescue."},
    {"t":"The Princess Bride","y":1987,"l":98,"g":["adventure","comedy","romance"],"m":["happy","romantic","chill"],"x":["easy","nostalgic"],"r":8.0,"d":"Rob Reiner","o":"A farmhand sets out to rescue his true love in a witty fairy tale."},
    {"t":"Dune","y":2021,"l":155,"g":["scifi","adventure","action"],"m":["excited"],"x":["intense"],"r":8.0,"d":"Denis Villeneuve","o":"A young heir travels to a desert planet whose sand holds the most valuable resource in the universe."},
    {"t":"Blade Runner 2049","y":2017,"l":164,"g":["scifi","drama","thriller"],"m":["thoughtful","chill"],"x":["think"],"r":8.0,"d":"Denis Villeneuve","o":"A new blade runner uncovers a secret that could change what it means to be human."},
    {"t":"Roman Holiday","y":1953,"l":118,"g":["romance","comedy"],"m":["romantic","happy","chill"],"x":["easy","nostalgic"],"r":8.0,"d":"William Wyler","o":"A runaway princess spends one carefree day in Rome with an American reporter."},
    {"t":"Dilwale Dulhania Le Jayenge","y":1995,"l":189,"g":["romance","drama","comedy"],"m":["romantic","happy"],"x":["emotional","nostalgic"],"r":8.0,"d":"Aditya Chopra","o":"Two young travelers fall in love in Europe, then must win over a strict father in India."},
    {"t":"Groundhog Day","y":1993,"l":101,"g":["comedy","romance","drama"],"m":["happy","thoughtful","chill"],"x":["easy","think","nostalgic"],"r":8.0,"d":"Harold Ramis","o":"A weatherman is stuck reliving the same day until he learns to be a better person."},
    {"t":"Casino Royale","y":2006,"l":144,"g":["action","thriller","adventure"],"m":["excited"],"x":["intense"],"r":8.0,"d":"Martin Campbell","o":"A young James Bond must beat a banker to terrorists at a high-stakes poker game."},
    {"t":"Big Fish","y":2003,"l":125,"g":["adventure","drama","comedy"],"m":["chill","thoughtful","sad"],"x":["emotional","inspiring"],"r":8.0,"d":"Tim Burton","o":"A son tries to separate fact from fiction in his dying father's tall tales."},
    {"t":"Her","y":2013,"l":126,"g":["romance","drama","scifi"],"m":["sad","romantic","thoughtful"],"x":["emotional","think"],"r":8.0,"d":"Spike Jonze","o":"A lonely writer develops a relationship with an artificial intelligence assistant."},
    {"t":"The Pursuit of Happyness","y":2006,"l":117,"g":["drama"],"m":["sad","thoughtful"],"x":["inspiring","emotional"],"r":8.0,"d":"Gabriele Muccino","o":"A struggling father fights to build a better life for himself and his young son."},
    {"t":"Slumdog Millionaire","y":2008,"l":120,"g":["drama","romance"],"m":["excited","romantic"],"x":["inspiring","emotional"],"r":8.0,"d":"Danny Boyle","o":"A young man from the slums of Mumbai gets close to winning a game show jackpot."},
    {"t":"Guardians of the Galaxy","y":2014,"l":121,"g":["scifi","action","adventure","comedy"],"m":["happy","excited"],"x":["easy"],"r":8.0,"d":"James Gunn","o":"A group of misfits teams up to protect a powerful orb from a ruthless villain."},
    {"t":"Zootopia","y":2016,"l":108,"g":["animation","comedy","adventure","mystery"],"m":["happy","excited","chill"],"x":["easy","inspiring"],"r":8.0,"d":"Byron Howard & Rich Moore","o":"A rookie bunny cop and a clever fox team up to solve a mystery in an animal city."},
    {"t":"Soul","y":2020,"l":100,"g":["animation","comedy","drama"],"m":["thoughtful","sad","chill"],"x":["think","emotional","inspiring"],"r":8.0,"d":"Pete Docter","o":"A music teacher whose soul is separated from his body fights to get back and appreciate life."},
    {"t":"Knives Out","y":2019,"l":130,"g":["mystery","comedy","thriller"],"m":["excited","happy"],"x":["easy","think"],"r":7.9,"d":"Rian Johnson","o":"A detective investigates the death of a wealthy novelist surrounded by his scheming family."},
    {"t":"Jab We Met","y":2007,"l":138,"g":["romance","comedy"],"m":["happy","romantic"],"x":["easy","emotional"],"r":7.9,"d":"Imtiaz Ali","o":"A heartbroken businessman meets a chatty, free-spirited girl on a train and his life starts to shift."},
    {"t":"Arrival","y":2016,"l":116,"g":["scifi","drama"],"m":["thoughtful","sad","chill"],"x":["think","emotional"],"r":7.9,"d":"Denis Villeneuve","o":"A linguist is brought in to communicate with mysterious alien visitors."},
    {"t":"Shaun of the Dead","y":2004,"l":99,"g":["horror","comedy"],"m":["happy","excited"],"x":["easy","nostalgic"],"r":7.9,"d":"Edgar Wright","o":"A slacker and his best friend try to survive a zombie outbreak in London."},
    {"t":"Titanic","y":1997,"l":194,"g":["romance","drama"],"m":["romantic","sad"],"x":["emotional","nostalgic"],"r":7.9,"d":"James Cameron","o":"A young artist and a first-class passenger fall in love aboard the doomed ocean liner."},
    {"t":"Jojo Rabbit","y":2019,"l":108,"g":["comedy","drama"],"m":["thoughtful","sad"],"x":["emotional","think"],"r":7.9,"d":"Taika Waititi","o":"A lonely boy in wartime Germany discovers that his mother is hiding a girl in their home."},
    {"t":"The Perks of Being a Wallflower","y":2012,"l":102,"g":["drama","romance"],"m":["sad","thoughtful"],"x":["emotional","nostalgic"],"r":7.9,"d":"Stephen Chbosky","o":"A shy freshman is welcomed into a group of older friends and learns to live life."},
    {"t":"Edge of Tomorrow","y":2014,"l":113,"g":["scifi","action"],"m":["excited"],"x":["intense"],"r":7.9,"d":"Doug Liman","o":"A soldier is forced to relive the same battle again and again against an alien invasion."},
    {"t":"District 9","y":2009,"l":112,"g":["scifi","action","thriller"],"m":["excited","thoughtful"],"x":["intense","think"],"r":7.9,"d":"Neill Blomkamp","o":"Aliens stranded on Earth are held in a camp in South Africa until one man's life changes."},
    {"t":"E.T. the Extra-Terrestrial","y":1982,"l":115,"g":["scifi","adventure"],"m":["happy","sad"],"x":["emotional","nostalgic","easy"],"r":7.9,"d":"Steven Spielberg","o":"A lonely boy befriends a gentle alien stranded on Earth and helps him get home."},
    {"t":"Paddington 2","y":2017,"l":103,"g":["comedy","adventure"],"m":["happy","chill"],"x":["easy","emotional","inspiring"],"r":7.8,"d":"Paul King","o":"The kindly bear is framed for a theft and sets out to clear his name."},
    {"t":"About Time","y":2013,"l":123,"g":["romance","comedy","scifi"],"m":["happy","romantic","thoughtful"],"x":["easy","emotional","think"],"r":7.8,"d":"Richard Curtis","o":"A young man who can travel in time uses it to find love, then learns what really matters in life."},
    {"t":"The Notebook","y":2004,"l":123,"g":["romance","drama"],"m":["romantic","sad"],"x":["emotional","nostalgic"],"r":7.8,"d":"Nick Cassavetes","o":"A passionate summer romance is tested by class divides and the passing of time."},
    {"t":"Pride & Prejudice","y":2005,"l":129,"g":["romance","drama"],"m":["romantic","chill"],"x":["emotional","nostalgic"],"r":7.8,"d":"Joe Wright","o":"Elizabeth Bennet and the proud Mr. Darcy clash, then slowly fall for each other in Regency England."},
    {"t":"Get Out","y":2017,"l":104,"g":["horror","thriller","mystery"],"m":["excited","thoughtful"],"x":["intense","think"],"r":7.8,"d":"Jordan Peele","o":"A young man visiting his girlfriend's family slowly realizes something is deeply wrong."},
    {"t":"Ferris Bueller's Day Off","y":1986,"l":103,"g":["comedy"],"m":["happy","chill"],"x":["easy","nostalgic"],"r":7.8,"d":"John Hughes","o":"A charming teenager skips school for a day of adventure in Chicago."},
    {"t":"Little Miss Sunshine","y":2006,"l":101,"g":["comedy","drama","adventure"],"m":["happy","thoughtful"],"x":["easy","emotional","inspiring"],"r":7.8,"d":"Jonathan Dayton & Valerie Faris","o":"A dysfunctional family road-trips across America to get a little girl to a beauty pageant."},
    {"t":"Everything Everywhere All at Once","y":2022,"l":139,"g":["scifi","comedy","action","adventure"],"m":["excited","thoughtful"],"x":["think","emotional","intense"],"r":7.8,"d":"Daniel Kwan & Daniel Scheinert","o":"A tired laundromat owner is pulled into a multiverse adventure to save her family."},
    {"t":"Skyfall","y":2012,"l":143,"g":["action","thriller","adventure"],"m":["excited"],"x":["intense"],"r":7.8,"d":"Sam Mendes","o":"Bond must track down an attacker who is targeting MI6 itself."},
    {"t":"Kiki's Delivery Service","y":1989,"l":103,"g":["animation","adventure"],"m":["chill","happy"],"x":["easy","nostalgic"],"r":7.8,"d":"Hayao Miyazaki","o":"A young witch moves to a seaside town and starts a flying delivery service."},
    {"t":"Little Women","y":2019,"l":135,"g":["drama","romance"],"m":["chill","romantic","sad"],"x":["emotional","nostalgic"],"r":7.8,"d":"Greta Gerwig","o":"Four sisters grow up and chase their dreams in 19th-century New England."},
    {"t":"Manchester by the Sea","y":2016,"l":137,"g":["drama"],"m":["sad"],"x":["emotional"],"r":7.8,"d":"Kenneth Lonergan","o":"A grieving handyman must return home to care for his teenage nephew."},
    {"t":"Home Alone","y":1990,"l":103,"g":["comedy"],"m":["happy","chill"],"x":["easy","nostalgic"],"r":7.7,"d":"Chris Columbus","o":"A boy left behind at Christmas defends his house from two clumsy burglars."},
    {"t":"Mission: Impossible - Fallout","y":2018,"l":147,"g":["action","thriller","adventure"],"m":["excited"],"x":["intense"],"r":7.7,"d":"Christopher McQuarrie","o":"Ethan Hunt races to stop a nuclear threat after a mission goes badly wrong."},
    {"t":"Coraline","y":2009,"l":100,"g":["animation","horror","adventure"],"m":["excited","thoughtful"],"x":["intense","think"],"r":7.7,"d":"Henry Selick","o":"A curious girl finds a secret door to a world that seems perfect, but isn't."},
    {"t":"Ex Machina","y":2014,"l":108,"g":["scifi","thriller","drama"],"m":["thoughtful","excited"],"x":["think","intense"],"r":7.7,"d":"Alex Garland","o":"A programmer is asked to test whether a humanlike robot has real consciousness."},
    {"t":"When Harry Met Sally","y":1989,"l":96,"g":["romance","comedy"],"m":["romantic","happy"],"x":["easy","nostalgic"],"r":7.7,"d":"Rob Reiner","o":"Two friends spend years wondering whether men and women can ever be just friends."},
    {"t":"(500) Days of Summer","y":2009,"l":95,"g":["romance","comedy","drama"],"m":["romantic","sad"],"x":["emotional","think"],"r":7.7,"d":"Marc Webb","o":"A greeting-card writer looks back on the year he spent falling for a woman who didn't share his view of love."},
    {"t":"The Hangover","y":2009,"l":100,"g":["comedy"],"m":["happy","excited"],"x":["easy"],"r":7.7,"d":"Todd Phillips","o":"Three friends wake up after a wild bachelor party in Las Vegas with no memory and a missing groom."},
    {"t":"Zodiac","y":2007,"l":157,"g":["mystery","thriller","drama"],"m":["thoughtful"],"x":["think"],"r":7.7,"d":"David Fincher","o":"A cartoonist and a reporter become obsessed with finding a serial killer."},
    {"t":"Lost in Translation","y":2003,"l":102,"g":["drama","romance","comedy"],"m":["chill","thoughtful","romantic"],"x":["think","emotional"],"r":7.7,"d":"Sofia Coppola","o":"Two lonely strangers form a bond during a stay in Tokyo."},
    {"t":"The Theory of Everything","y":2014,"l":123,"g":["romance","drama"],"m":["romantic","sad"],"x":["inspiring","emotional"],"r":7.7,"d":"James Marsh","o":"The story of Stephen Hawking and his marriage as he fights a debilitating illness."},
    {"t":"Gravity","y":2013,"l":91,"g":["scifi","thriller","drama"],"m":["excited"],"x":["intense"],"r":7.7,"d":"Alfonso Cuaron","o":"Two astronauts fight to survive after debris destroys their space shuttle."},
    {"t":"The Fault in Our Stars","y":2014,"l":126,"g":["romance","drama"],"m":["sad","romantic"],"x":["emotional"],"r":7.7,"d":"Josh Boone","o":"Two teenagers with serious illnesses fall in love and set out to meet a favorite author."},
    {"t":"Superbad","y":2007,"l":113,"g":["comedy"],"m":["happy"],"x":["easy","nostalgic"],"r":7.6,"d":"Greg Mottola","o":"Two high-school friends try to make the most of their last days before graduation."},
    {"t":"Sherlock Holmes","y":2009,"l":128,"g":["mystery","action","adventure"],"m":["excited","happy"],"x":["intense","easy"],"r":7.6,"d":"Guy Ritchie","o":"The famous detective and Dr. Watson race to stop a mysterious secret society."},
    {"t":"Train to Busan","y":2016,"l":118,"g":["horror","action","thriller"],"m":["excited","sad"],"x":["intense","emotional"],"r":7.6,"d":"Yeon Sang-ho","o":"Passengers fight to survive a zombie outbreak on a high-speed train."},
    {"t":"The Others","y":2001,"l":104,"g":["horror","mystery","thriller"],"m":["thoughtful","excited"],"x":["intense","think"],"r":7.6,"d":"Alejandro Amenabar","o":"A mother in a dark, isolated house becomes convinced that it is haunted."},
    {"t":"Baby Driver","y":2017,"l":113,"g":["action","thriller"],"m":["excited"],"x":["intense"],"r":7.6,"d":"Edgar Wright","o":"A young getaway driver uses music to drown out his past and plans one last job."},
    {"t":"Harry Potter and the Sorcerer's Stone","y":2001,"l":152,"g":["adventure"],"m":["happy","chill"],"x":["easy","nostalgic"],"r":7.6,"d":"Chris Columbus","o":"An orphan boy learns he is a wizard and starts a new life at a magical school."},
    {"t":"Midnight in Paris","y":2011,"l":94,"g":["comedy","romance"],"m":["chill","romantic","happy"],"x":["easy","think","nostalgic"],"r":7.6,"d":"Woody Allen","o":"A writer on vacation in Paris is mysteriously carried back to the 1920s each midnight."},
    {"t":"A Star Is Born","y":2018,"l":136,"g":["romance","drama"],"m":["sad","romantic"],"x":["emotional"],"r":7.6,"d":"Bradley Cooper","o":"A seasoned musician discovers a young singer and falls in love as her star rises."},
    {"t":"Love Actually","y":2003,"l":135,"g":["romance","comedy"],"m":["romantic","happy"],"x":["easy","nostalgic"],"r":7.6,"d":"Richard Curtis","o":"Several love stories in London intertwine in the weeks before Christmas."},
    {"t":"Kung Fu Panda","y":2008,"l":92,"g":["animation","action","comedy","adventure"],"m":["happy","excited"],"x":["easy","inspiring"],"r":7.6,"d":"Mark Osborne & John Stevenson","o":"A clumsy, lovable panda is chosen to become a kung fu hero."},
    {"t":"A Quiet Place","y":2018,"l":90,"g":["horror","thriller","scifi"],"m":["excited"],"x":["intense","emotional"],"r":7.5,"d":"John Krasinski","o":"A family must live in total silence to avoid creatures that hunt by sound."},
    {"t":"The Conjuring","y":2013,"l":112,"g":["horror","thriller"],"m":["excited"],"x":["intense"],"r":7.5,"d":"James Wan","o":"Paranormal investigators help a family terrorized by a dark presence in their farmhouse."},
    {"t":"John Wick","y":2014,"l":101,"g":["action","thriller"],"m":["excited"],"x":["intense"],"r":7.4,"d":"Chad Stahelski","o":"A retired hitman is pulled back in after something precious is taken from him."},
    {"t":"Scream","y":1996,"l":111,"g":["horror","mystery","thriller"],"m":["excited","happy"],"x":["intense","nostalgic"],"r":7.4,"d":"Wes Craven","o":"A masked killer terrorizes a small town and seems to know every horror movie rule."},
    {"t":"Moonlight","y":2016,"l":111,"g":["drama"],"m":["sad","thoughtful"],"x":["emotional"],"r":7.4,"d":"Barry Jenkins","o":"A young man grows up and finds himself through three chapters of his life."},
    {"t":"Crazy, Stupid, Love.","y":2011,"l":118,"g":["comedy","romance"],"m":["happy","romantic"],"x":["easy"],"r":7.4,"d":"Glenn Ficarra & John Requa","o":"A man whose marriage has ended gets help from a smooth-talking bachelor."},
    {"t":"Beautiful Boy","y":2018,"l":120,"g":["drama"],"m":["sad","thoughtful"],"x":["emotional"],"r":7.3,"d":"Felix Van Groeningen","o":"A father fights to help his teenage son through addiction."},
    {"t":"Hereditary","y":2018,"l":127,"g":["horror","drama","mystery"],"m":["thoughtful","sad"],"x":["intense"],"r":7.3,"d":"Ari Aster","o":"A grieving family discovers terrifying secrets about their ancestry."},
    {"t":"Spider-Man 2","y":2004,"l":127,"g":["action","adventure","scifi"],"m":["excited","happy"],"x":["inspiring","easy","nostalgic"],"r":7.3,"d":"Sam Raimi","o":"Peter Parker struggles to balance his life with being Spider-Man as a new villain rises."},
    {"t":"The Secret Life of Walter Mitty","y":2013,"l":114,"g":["adventure","comedy","drama"],"m":["chill","happy"],"x":["inspiring","easy"],"r":7.3,"d":"Ben Stiller","o":"A daydreaming office worker finally sets out on a real adventure."},
    {"t":"Notting Hill","y":1999,"l":124,"g":["romance","comedy"],"m":["romantic","happy","chill"],"x":["easy","nostalgic"],"r":7.2,"d":"Roger Michell","o":"A London bookshop owner falls for the world's most famous movie star."},
    {"t":"Mrs. Doubtfire","y":1993,"l":125,"g":["comedy","drama"],"m":["happy","sad"],"x":["easy","emotional","nostalgic"],"r":7.1,"d":"Chris Columbus","o":"A divorced father disguises himself as a nanny to spend time with his children."},
    {"t":"Pretty Woman","y":1990,"l":119,"g":["romance","comedy"],"m":["romantic","happy"],"x":["easy","nostalgic"],"r":7.1,"d":"Garry Marshall","o":"A businessman hires a woman to accompany him for a week and they fall in love."},
    {"t":"Crazy Rich Asians","y":2018,"l":120,"g":["romance","comedy"],"m":["happy","romantic"],"x":["easy"],"r":6.9,"d":"Jon M. Chu","o":"A professor travels to Singapore to meet her boyfriend's family and learns just how wealthy they are."},
    {"t":"The Holiday","y":2006,"l":136,"g":["romance","comedy"],"m":["romantic","happy","chill"],"x":["easy"],"r":6.9,"d":"Nancy Meyers","o":"Two women swap homes at Christmas and each finds an unexpected romance."},
    {"t":"Us","y":2019,"l":116,"g":["horror","thriller","mystery"],"m":["excited","thoughtful"],"x":["intense","think"],"r":6.8,"d":"Jordan Peele","o":"A family on vacation is attacked by terrifying doubles of themselves."}
  ];

  var GENRE_ID = { comedy: 35, drama: 18, action: 28, romance: 10749, thriller: 53, scifi: 878, horror: 27, animation: 16, adventure: 12, mystery: 9648 };
  var GENRE_LABEL = { comedy: "Comedy", drama: "Drama", action: "Action", romance: "Romance", thriller: "Thriller", scifi: "Sci-Fi", horror: "Horror", animation: "Animation", adventure: "Adventure", mystery: "Mystery" };
  var GENRES = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western" };

  // Which TMDB genres "feel like" each mood / experience (used for movies that have no hand-made tags)
  var MOOD_GENRES = { happy: [35, 16, 10751, 12], sad: [18, 10749], chill: [16, 35, 10749, 10751], excited: [28, 12, 53, 878], romantic: [10749, 35, 18], thoughtful: [18, 878, 9648] };
  var EXP_GENRES = { easy: [35, 16, 10751], think: [878, 9648, 18], emotional: [18, 10749], intense: [53, 28, 27], inspiring: [18, 12], nostalgic: [] };

  var IMG = "https://image.tmdb.org/t/p/";
  var API = "/api/tmdb";
  var DAY = 864e5;

  /* ---------- small helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtDate(s) {
    if (!s) return "Date unknown";
    var d = new Date(s + "T00:00:00Z");
    return isNaN(d) ? s : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  }
  function overlap(a, b) { return a.some(function (x) { return b.indexOf(x) !== -1; }); }

  // browser storage can be blocked, so every use is wrapped in try/catch
  function cget(kind, key) {
    try {
      var o = JSON.parse(window[kind].getItem("mf:" + key));
      if (o && o.exp > Date.now()) return o.v;
    } catch (e) {}
    return null;
  }
  function cset(kind, key, v, ttl) {
    try { window[kind].setItem("mf:" + key, JSON.stringify({ exp: Date.now() + ttl, v: v })); } catch (e) {}
  }

  /* ---------- talking to our /api/tmdb server function (with caching) ---------- */
  function api(params, ttl) {
    var qs = Object.keys(params)
      .filter(function (k) { return params[k] !== "" && params[k] != null; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); })
      .join("&");
    var hit = ttl ? cget("sessionStorage", qs) : null;
    if (hit) return Promise.resolve(hit);
    return fetch(API + "?" + qs)
      .catch(function () {
        throw new Error("The movie service can't be reached. This part only works once the site is online.");
      })
      .then(function (r) {
        return r.text().then(function (t) {
          var data;
          try { data = JSON.parse(t); } catch (e) {
            throw new Error("The movie service can't be reached. Deploy the site with its api folder (or run it with 'vercel dev').");
          }
          if (!r.ok) throw new Error(data.message || "Request failed (" + r.status + ").");
          return data;
        });
      })
      .then(function (d) {
        if (ttl) cset("sessionStorage", qs, d, ttl);
        return d;
      });
  }

  // at most 4 background requests at a time (poster and rating lookups)
  var queue = [], running = 0;
  function enqueue(task) { queue.push(task); pump(); }
  function pump() {
    while (running < 4 && queue.length) {
      running++;
      queue.shift()().then(done, done);
    }
    function done() { running--; pump(); }
  }

  /* ---------- movie objects ---------- */
  function fromCurated(c) {
    return {
      key: "c:" + c.t, id: null, title: c.t, year: String(c.y), date: "", runtime: c.l,
      genres: c.g.map(function (k) { return GENRE_LABEL[k]; }),
      genreIds: c.g.map(function (k) { return GENRE_ID[k]; }),
      overview: c.o, director: c.d, rating: c.r, poster: null, vote: c.r,
      curated: true, moods: c.m, exps: c.x
    };
  }
  function fromTmdb(r) {
    var ids = r.genre_ids || [];
    return {
      key: "t:" + r.id, id: r.id, title: r.title, year: (r.release_date || "").slice(0, 4),
      date: r.release_date || "", runtime: null,
      genres: ids.map(function (i) { return GENRES[i]; }).filter(Boolean).slice(0, 3),
      genreIds: ids, overview: r.overview || "", rating: null, poster: r.poster_path || null,
      vote: r.vote_average || 0
    };
  }

  /* ---------- movie card (used in all three sections) ---------- */
  function ratingNode(m) {
    var p = el("p", "rating");
    if (m.rating != null) {
      p.appendChild(el("b", null, "★ " + Number(m.rating).toFixed(1)));
      p.appendChild(document.createTextNode(" IMDb"));
    } else {
      p.appendChild(el("span", "na", "Rating unavailable"));
    }
    return p;
  }

  function setPoster(card, m) {
    var box = $(".poster", card);
    box.textContent = "";
    if (!m.poster) return;
    var img = new Image();
    var p = m.poster;
    img.alt = m.title + " poster";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 342;
    img.height = 513;
    img.srcset = IMG + "w185" + p + " 185w, " + IMG + "w342" + p + " 342w, " + IMG + "w500" + p + " 500w";
    img.sizes = "(max-width: 600px) 96px, 120px";
    img.src = IMG + "w342" + p;
    img.onerror = function () { img.remove(); };   // placeholder shows instead
    box.appendChild(img);
  }

  function updateRating(card, m) {
    var old = $(".rating", card);
    old.parentNode.replaceChild(ratingNode(m), old);
  }

  function buildCard(m, opts) {
    opts = opts || {};
    var card = el("article", "movie" + (opts.best ? " best" : ""));
    card._movie = m;
    if (opts.best) card.appendChild(el("span", "best-badge", "⭐ My best pick for you"));
    card.appendChild(el("div", "poster"));

    var info = el("div", "info");
    info.appendChild(el("h3", null, m.title));
    info.appendChild(ratingNode(m));

    var meta = [];
    if (opts.fullDate && m.date) meta.push(fmtDate(m.date)); else if (m.year) meta.push(m.year);
    if (m.runtime) meta.push(Math.floor(m.runtime / 60) + "h " + (m.runtime % 60) + "m");
    if (m.genres.length) meta.push(m.genres.join(", "));
    info.appendChild(el("p", "meta", meta.join(" • ")));

    if (m.date && m.date > todayStr()) info.appendChild(el("span", "tag tag-soon", "Coming soon"));
    else if (opts.showReleased && m.date) info.appendChild(el("span", "tag tag-out", "Released"));

    if (m.director) info.appendChild(el("p", "director", "Directed by " + m.director));
    info.appendChild(el("p", "desc", m.overview || "No description available yet."));

    var btn = el("button", "btn btn-small", "View details");
    btn.type = "button";
    btn.addEventListener("click", function () { openDetails(m, card); });
    info.appendChild(btn);
    card.appendChild(info);

    setPoster(card, m);
    if (m.id) enrich(m, card); else lookup(m, card);
    return card;
  }

  // For hand-picked movies: find the poster (and TMDB id) by title + year
  function lookup(m, card) {
    var ck = "p:" + m.title + "|" + m.year;
    function apply(r) {
      if (!r) return;
      m.id = r.id;
      if (r.poster_path) { m.poster = r.poster_path; setPoster(card, m); }
      if (!m.date && r.release_date) m.date = r.release_date;
      enrich(m, card);
    }
    var hit = cget("localStorage", ck);
    if (hit) return apply(hit);
    enqueue(function () {
      return api({ action: "search", query: m.title, year: m.year }).then(function (d) {
        var r = (d.results || [])[0];
        if (r) cset("localStorage", ck, { id: r.id, poster_path: r.poster_path, release_date: r.release_date }, 7 * DAY);
        apply(r);
      }).catch(function () {});
    });
  }

  // Ask for the real IMDb rating (only shows if the server has an OMDb key)
  function enrich(m, card) {
    if (!m.id || m.checked) return;
    m.checked = true;
    enqueue(function () {
      return api({ action: "rating", id: m.id }, 3600e3).then(function (d) {
        m.imdbId = d.imdb_id || null;
        if (d.rating != null) { m.rating = d.rating; updateRating(card, m); }
      }).catch(function () {});
    });
  }

  /* ---------- loading and error states ---------- */
  function skeletons(grid, n) {
    var list = [];
    for (var i = 0; i < n; i++) {
      var s = el("article", "movie skeleton");
      s.setAttribute("aria-hidden", "true");
      s.appendChild(el("div", "poster"));
      var info = el("div", "info");
      info.appendChild(el("span", "sk sk-title"));
      info.appendChild(el("span", "sk sk-line"));
      info.appendChild(el("span", "sk sk-line short"));
      s.appendChild(info);
      grid.appendChild(s);
      list.push(s);
    }
    return function () { list.forEach(function (s) { s.remove(); }); };
  }

  function stateBox(message, retry) {
    var box = el("div", "state-box");
    box.setAttribute("role", "alert");
    box.appendChild(el("p", null, message));
    if (retry) {
      var b = el("button", "btn btn-small", "Try again");
      b.type = "button";
      b.addEventListener("click", function () { box.remove(); retry(); });
      box.appendChild(b);
    }
    return box;
  }

  /* ---------- details window ---------- */
  var dlg = $("#details");
  var dlgBody = $("#details-body");
  $("#details-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  function openDetails(m, card) {
    var d = {
      title: m.title, overview: m.overview, date: m.date, year: m.year, runtime: m.runtime,
      genres: m.genres, rating: m.rating, imdbId: m.imdbId || null, poster: m.poster, director: m.director
    };
    paint(d, true);
    if (!dlg.open) dlg.showModal();

    function load(id) {
      api({ action: "details", id: id }, 3600e3).then(function (r) {
        d.overview = r.overview || d.overview;
        d.date = r.release_date || d.date;
        d.runtime = r.runtime || d.runtime;
        d.genres = r.genres && r.genres.length ? r.genres : d.genres;
        d.poster = r.poster_path || d.poster;
        d.imdbId = r.imdb_id || null;
        d.tagline = r.tagline;
        if (r.rating != null) d.rating = r.rating;
        paint(d, false);
        m.rating = d.rating; m.imdbId = d.imdbId;
        if (card) updateRating(card, m);
      }).catch(function (e) { paint(d, false, e.message); });
    }
    if (m.id) load(m.id);
    else api({ action: "search", query: m.title, year: m.year }, 3600e3).then(function (s) {
      var r = (s.results || [])[0];
      if (r) { m.id = r.id; load(r.id); } else paint(d, false);
    }).catch(function (e) { paint(d, false, e.message); });
  }

  function paint(d, loading, error) {
    dlgBody.textContent = "";
    var poster = el("div", "poster big");
    if (d.poster) {
      var img = new Image();
      img.alt = d.title + " poster";
      img.src = IMG + "w500" + d.poster;
      img.onerror = function () { img.remove(); };
      poster.appendChild(img);
    }
    var text = el("div", "d-text");
    text.appendChild(el("h2", null, d.title));
    if (d.tagline) text.appendChild(el("p", "tagline", d.tagline));
    text.appendChild(ratingNode(d));
    var facts = [];
    facts.push("Release date: " + (d.date ? fmtDate(d.date) : d.year || "unknown"));
    if (d.runtime) facts.push("Runtime: " + Math.floor(d.runtime / 60) + "h " + (d.runtime % 60) + "m");
    if (d.genres && d.genres.length) facts.push("Genres: " + d.genres.join(", "));
    if (d.director) facts.push("Director: " + d.director);
    facts.forEach(function (f) { text.appendChild(el("p", "meta", f)); });
    text.appendChild(el("p", "desc", d.overview || "No description available yet."));
    if (loading) text.appendChild(el("p", "meta", "Loading more details…"));
    if (error) text.appendChild(el("p", "meta", error));
    if (/^tt\d{6,10}$/.test(d.imdbId || "")) {
      var a = el("a", "btn btn-small", "Open on IMDb");
      a.href = "https://www.imdb.com/title/" + d.imdbId + "/";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      text.appendChild(a);
    }
    dlgBody.appendChild(poster);
    dlgBody.appendChild(text);
  }

  /* ==========================================================
     FOR YOU: mood + genre + experience
     ========================================================== */
  var form = $("#finder-form");
  var hint = $("#hint");
  var resultsBox = $("#results");
  var recGrid = $("#rec-grid");
  var recNote = $("#rec-note");
  var recToken = 0;

  function scoreMovie(m, mood, genreKey, exp) {
    var moodHit = m.curated ? m.moods.indexOf(mood) !== -1 : overlap(m.genreIds, MOOD_GENRES[mood]);
    var genreHit = genreKey === "any" ? null : m.genreIds.indexOf(GENRE_ID[genreKey]) !== -1;
    var expHit = !exp ? null : m.curated ? m.exps.indexOf(exp) !== -1
      : exp === "nostalgic" ? Number(m.year) > 0 && Number(m.year) <= 2005 : overlap(m.genreIds, EXP_GENRES[exp]);
    m._moodHit = moodHit; m._genreHit = genreHit; m._expHit = expHit;
    m._exact = moodHit && genreHit !== false && expHit !== false;
    m._base = (moodHit ? 3 : 0) + (genreHit ? 4 : 0) + (expHit ? 3 : 0);
    // Tie-breakers (always worth less than 3, so a better match still wins):
    //  - movies made for fewer moods / experiences count as "more specific"
    //  - a little rating
    //  - a little luck, so each visit shows different movies
    var specific = 0;
    if (m.curated) {
      if (moodHit) specific += 0.5 / m.moods.length;
      if (expHit) specific += 0.5 / m.exps.length;
    }
    m._score = m._base + specific + (m.vote || 0) / 15 + Math.random() * 1.0;
  }

  function byScore(a, b) { return b._score - a._score; }

  function pick(mood, genreKey, exp, extras) {
    var seen = {};
    var pool = [];
    function add(m) {
      var k = (m.title + "|" + m.year).toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      scoreMovie(m, mood, genreKey, exp);
      pool.push(m);
    }
    CURATED.map(fromCurated).forEach(add);
    (extras || []).forEach(add);

    var wanted = pool.filter(function (m) {
      return genreKey === "any" ? m._base >= 3 : m._genreHit;
    }).sort(byScore);
    var out = wanted.slice(0, 12);

    // not enough movies in that genre? top up with the closest mood / experience matches
    if (out.length < 6) {
      pool.filter(function (m) { return out.indexOf(m) === -1 && m._base >= 3; })
        .sort(byScore).slice(0, 6 - out.length).forEach(function (m) { out.push(m); });
    }
    return out;
  }

  function discoverParams(mood, genreKey, exp) {
    var p = { action: "discover", with_genres: String(GENRE_ID[genreKey]) };
    if (exp === "nostalgic") p.date_lte = "2005-12-31";
    return p;
  }

  function showRecommendations(mood, genreKey, exp, extras, extrasError) {
    var list = pick(mood, genreKey, exp, extras);
    recGrid.textContent = "";
    list.forEach(function (m, i) { recGrid.appendChild(buildCard(m, { best: i === 0 })); });

    recNote.textContent = "";
    var exactCount = list.filter(function (m) { return m._exact; }).length;
    if (!exactCount) {
      recNote.appendChild(el("p", null, "No movie matches all of your answers exactly, so these are the closest matches I could find."));
    }
    if (extrasError) {
      recNote.appendChild(stateBox("I couldn't load extra " + GENRE_LABEL[genreKey] + " suggestions from the movie database (" + extrasError + ")", function () { runRecommend(); }));
    }
  }

  function runRecommend() {
    var f = new FormData(form);
    var mood = f.get("mood");
    var genreKey = f.get("genre") || "any";
    var exp = f.get("exp") || "";
    if (!mood) {
      hint.textContent = "Pick a mood first, then press the button.";
      hint.classList.add("warn");
      return;
    }
    hint.classList.remove("warn");
    hint.textContent = "Pick a mood, a genre and the kind of experience you want. Then press the button.";
    var token = ++recToken;
    resultsBox.hidden = false;

    // 1) show the hand-picked movies straight away
    showRecommendations(mood, genreKey, exp, [], null);
    resultsBox.scrollIntoView({ behavior: "smooth", block: "start" });

    // 2) if very few hand-picked movies fit, add more from the movie database
    var strong = CURATED.filter(function (c) {
      return c.g.indexOf(genreKey) !== -1 && (c.m.indexOf(mood) !== -1 || (exp && c.x.indexOf(exp) !== -1));
    }).length;
    if (genreKey !== "any" && strong < 6) {
      var stop = skeletons(recGrid, 3);
      api(discoverParams(mood, genreKey, exp), 6 * 3600e3).then(function (d) {
        if (token !== recToken) return;
        stop();
        showRecommendations(mood, genreKey, exp, (d.results || []).map(fromTmdb), null);
      }).catch(function (e) {
        if (token !== recToken) return;
        stop();
        showRecommendations(mood, genreKey, exp, [], e.message);
      });
    }
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); runRecommend(); });
  form.addEventListener("reset", function () {
    recToken++;
    resultsBox.hidden = true;
    hint.classList.remove("warn");
  });
  $("#change-choices").addEventListener("click", function () {
    $("#finder").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ==========================================================
     TRENDING NOW and LATEST RELEASES (shared list logic)
     ========================================================== */
  function makeList(cfg) {
    var st = { page: 0, total: 1, busy: false, gen: 0, seen: {} };

    function load(reset) {
      if (reset) {
        st.page = 0; st.total = 1; st.gen++; st.busy = false; st.seen = {};
        cfg.grid.textContent = "";
        cfg.more.hidden = true;
      }
      if (st.busy || st.page >= st.total) return;
      var gen = st.gen;
      st.busy = true;
      cfg.more.disabled = true;
      var stop = skeletons(cfg.grid, st.page ? 3 : 6);
      cfg.fetchPage(st.page + 1).then(function (d) {
        if (gen !== st.gen) return;
        stop();
        st.page = d.page;
        st.total = d.total_pages || 1;
        var items = (d.results || []).map(fromTmdb).filter(function (m) {
          if (st.seen[m.key]) return false;
          st.seen[m.key] = true;
          return cfg.accept ? cfg.accept(m) : true;
        });
        items.forEach(function (m) { cfg.grid.appendChild(buildCard(m, cfg.card)); });
        if (!cfg.grid.children.length) cfg.grid.appendChild(stateBox(cfg.empty));
        cfg.more.hidden = st.page >= st.total;
      }).catch(function (e) {
        if (gen !== st.gen) return;
        stop();
        cfg.grid.appendChild(stateBox(e.message, function () { st.busy = false; load(false); }));
      }).then(function () {
        if (gen === st.gen) { st.busy = false; cfg.more.disabled = false; }
      });
    }
    cfg.more.addEventListener("click", function () { load(false); });
    return { reset: function () { load(true); }, started: false };
  }

  // choice buttons ("chips"): only one is active at a time
  function chips(root, onPick) {
    root.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-v]");
      if (!b || !root.contains(b)) return;
      $$("button", root).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      onPick(b.getAttribute("data-v"));
    });
  }

  var trendWindow = "week";
  var trending = makeList({
    grid: $("#trend-grid"), more: $("#trend-more"), card: { showReleased: false },
    empty: "No trending movies came back just now. Please try again later.",
    fetchPage: function (page) { return api({ action: "trending", window: trendWindow, page: page }, 1800e3); }
  });
  chips($("#trend-window"), function (v) { trendWindow = v; trending.reset(); });

  var latestStatus = "released", latestGenre = "";
  var latest = makeList({
    grid: $("#latest-grid"), more: $("#latest-more"), card: { fullDate: true, showReleased: true },
    empty: "No movies found for that filter. Try another genre.",
    accept: function (m) {
      // never show a future film as "released", and never a released one as "coming soon"
      return latestStatus === "upcoming" ? m.date > todayStr() : !m.date || m.date <= todayStr();
    },
    fetchPage: function (page) { return api({ action: "latest", status: latestStatus, genre: latestGenre, page: page }, 1800e3); }
  });
  chips($("#latest-status"), function (v) { latestStatus = v; latest.reset(); });
  chips($("#latest-genre"), function (v) { latestGenre = v; latest.reset(); });

  /* ---------- hero pictures: hide any that can't load ---------- */
  $$(".pic img").forEach(function (img) {
    function hide() { img.style.display = "none"; }
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ---------- tabs ---------- */
  var TABS = ["foryou", "trending", "latest"];
  function showTab(name, focus) {
    if (TABS.indexOf(name) === -1) name = "foryou";
    TABS.forEach(function (t) {
      var on = t === name;
      var tab = $("#tab-" + t);
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
      $("#panel-" + t).hidden = !on;
      if (on && focus) tab.focus();
    });
    if (name === "trending" && !trending.started) { trending.started = true; trending.reset(); }
    if (name === "latest" && !latest.started) { latest.started = true; latest.reset(); }
    try { history.replaceState(null, "", "#" + name); } catch (e) {}
  }
  $$("#tabs [role=tab]").forEach(function (tab, i) {
    tab.addEventListener("click", function () { showTab(TABS[i]); });
    tab.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) { e.preventDefault(); showTab(TABS[(i + dir + TABS.length) % TABS.length], true); }
    });
  });
  var start = (location.hash || "").replace("#", "");
  showTab(TABS.indexOf(start) !== -1 ? start : "foryou");
})();