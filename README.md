# discovermovie
Discover Movies which are rated by taking  into account scores from IMDB, Rotten Tomatoes and Metacritic.
The webapp is built using NodeJS, the node script runs periodically and collects movie information from source such as TMDB
and OMDB.
The data is then persisted in the Persistence Layer(MongoDB).
The internal algorithm rates movie taking into account the scores of IMDB, RT and Metacritic and places more emphasis on 
user ratings rather than Critic Ratings.
It deliberately ignores as Super Pouplar movies (>1000000 votes in IMDB) as the assumption is to look hard and find good 
underrated movies.
The app is in progress and text analysis algorithms to Rate Movie reviews are in development...
Feel free to clone and improve upon the existing feature.
