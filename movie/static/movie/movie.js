document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#search-results-header').innerHTML = "";

	document.querySelectorAll("#like-button").forEach(button => {
  	button.addEventListener('click', () => toggleLike(button));
    });

    document.querySelectorAll('.liked').forEach(button => {
    button.addEventListener('click', () => {
    	toggleLike(button, false)});
	});

	document.querySelector("#search").addEventListener("click", (event) => {
      seachMovies(document.querySelector('#q').value);
    });
    document.querySelectorAll("#movie-data").forEach(movieDiv => {
   		getMovie(movieDiv);
   	 });

    if(document.querySelector("#new-movie")){
    	const ele = document.querySelector("#new-movie")
    	let id = sessionStorage.getItem("imdbID");
   		showMoviInfo(id, ele);
    };
    if(document.querySelector("#saved-movie")){
    	const ele = document.querySelector("#saved-movie");
    	let id = ele.dataset.id;
    	console.log(id);
   		showMoviInfo(id, ele);
    };
});

function seachMovies(query) {
  fetch(`http://www.omdbapi.com/?s=`+query+`&apikey=7527df32`)
    .then(response => response.json())
      .then( movies => {
       searchResults(movies.Search);//nested data           
      }).catch((error) => {
          console.log(error);
    });

}

function getMovie(movie) {
  const movieId = movie.dataset.movie;
  const commentId = movie.dataset.comment;

  fetch(`http://www.omdbapi.com/?i=`+movieId+`&apikey=7527df32`)
    .then(response => response.json())
      .then( movie => {

      	let item = document.querySelector(`#inner-movie-data[data-id="${commentId}"]`);
      	item.innerHTML = 
      	`<div style="text-align:center; padding:1%">
      	<img height="200px"" src=${movie.Poster}>
      	<h6>${movie.Year}</h6>
      	<h4>${movie.Title}</h4>
      	<label>IMDB Rating: ${movie.imdbRating}</label
      	</div>`;


      }).catch((error) => {
          console.log(error);
    });
}

function searchResults(movies){
	document.querySelector('#search-results').innerHTML = "";
	const results = document.querySelector('#search-results');
	movies.forEach((movie) => {
		let item = document.createElement('div');
        item.innerHTML = `
        <div class="container border" style="text-align:center">
        <h2>${movie.Title}</h2>
        <img src=${movie.Poster}>  
          <div> ${movie.Year}</div>
          </div
       `;
       item.addEventListener('click', event => {
	       document.location.href = '/moviedata/'+`${movie.imdbID}`
	       sessionStorage.setItem("imdbID", movie.imdbID);
	      });

       results.append(item);
	});
		document.querySelector('#search-results-header').innerHTML = "Click on a movie to see what people are talking about or join in on the Comments!";


}

function showMoviInfo(id, ele){
	console.log(id);
  fetch(`http://www.omdbapi.com/?i=`+id+`&apikey=7527df32`)
    .then(response => response.json())
      .then( movie => {
      	let item = document.createElement('div');
        item.innerHTML = `
        <div class="container" style="padding:1%;">
        <div class="row">
        <div class="col-4" style="text-align:center">
        <img height="80%" src=${movie.Poster}>
        <label>IMDB Rating:${movie.imdbRating} </label>
        </div>
        <div class="col-8">
        <div style="text-align:center;">
        <h2>${movie.Title}</h2>
        <br /> 
        <h6>${movie.Genre}</h6>
        <h5>${movie.Plot}</h5> 
        <br /> 
        </div>
        <ul>
        <li>Stars: ${movie.Actors}</li>
        <li>Release Date: ${movie.Released}</li>
        <li>Runtime: ${movie.Runtime}</li>
          </ul>
          </div>
          </div>
          </div>
       `;
        ele.append(item);

      	}).catch((error) => {
          console.log(error);
   		 });

     document.querySelector('#comment-movieId').value = `${id}`;

}



function toggleLike(button) {
	const token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
	const commentId = button.dataset.comment;
	const like = button.dataset.like == "1" ? false : true;
	fetch(`/like/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({
      like: like
    }),
    headers: {
      "X-CSRFToken": token
    }
  })
  .then(response => response.json())
  .then(data => {
  	if (like) {
      button.dataset.like = "1";
    } else {
      button.dataset.like = "0";
    }
  	const buttonText = like ? "Liked" : "Like";
	const buttonClass = like ? "btn btn-small btn-danger" : "btn btn-outline-danger"
	button.value = buttonText;
  	button.className = buttonClass;
  	document.querySelector(`.like-count[data-comment="${commentId}"]`).innerHTML = data.likes;

  })

  .catch((error) => {
          console.log(error);
    });

  
}
