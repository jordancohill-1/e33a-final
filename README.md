Movie Bash

This final project is an extension of Project 4.

It utilizes the omdb api to fetch movie data.

getMovie()--`http://www.omdbapi.com/?i=`+movieId+`&apikey=7527df32`
When you first arrive at Movie Bash, you will be presented with a list of movies that users have commented on(most recent at the top). 
Each record is supplied with data from the api by interating thru a Django list and calling getMovie() for each, sudo fk, ImdbId. 

seachMovies()--`http://www.omdbapi.com/?s=`+query+`&apikey=7527df32`
Entering a movie in the search bar, at the top of the page, calls a javascript fetch from the api and presents a list of movies relevant to what was entered in the search.  

getMovie()--`http://www.omdbapi.com/?i=`+movieId+`&apikey=7527df32`
Clicking a result calls another fetch to get the data of the selected movie. This function loads the route "moviedata" which populates a list of comments from the server.

After register/login, a user can comment on any movie, like/unlike comments, follow/unfollow other users. View comments from users that are followed.

ToDo
Allow users to rate a movie
Allow Reply to comments
Enhance Search 
Add CSS




