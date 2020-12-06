
document.addEventListener('DOMContentLoaded', function() {
results_view();

 document.querySelector("#search-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = document.querySelector('#q').value;
      getMovies(query);
    });

  document.querySelectorAll("#like-button").forEach(button => {
  	button.addEventListener('click', () => toggleLike(button));
    });
  document.querySelectorAll('.liked').forEach(button => {
    button.addEventListener('click', () => {
    	toggleLike(button, false)});
  });


//if(sessionStorage.getItem("movieId")) getMovieById(sessionStorage.getItem("movieId"));


});
/* PAGE CONTROLS */

function results_view(){
  document.querySelector('#results').style.display = 'block';
  document.querySelector('#results-byId').style.display = 'none';
}

function results_byID_view(){
  document.querySelector('#results-byId').style.display = 'block';
  document.querySelector('#results').style.display = 'none';
}

/* END PAGE CONTROLS */

/* FETCHES */

function getMovies(query) {
  fetch(`http://www.omdbapi.com/?s=`+query+`&apikey=e2ce2b93`)
    .then(response => response.json())
      .then( movies => {
      	results_view();
       html_results(movies.Search);//nested data           
      }).catch((error) => {
          console.log(error);
    });

}

function getMovieById(id) {
  sessionStorage.setItem("movieId", id);
  fetch(`http://www.omdbapi.com/?i=`+id+`&apikey=e2ce2b93`)
    .then(response => response.json())
      .then( movie => {
      	results_byID_view();
       	html_results_byId(movie); 
       	getAllComments(movie);
      }).catch((error) => {
          console.log(error);
    });
}

/* LOCAL */

function getAllComments(movie) {
  fetch(`comments/${movie.imdbID}`)
  .then(response => response.json())
	.then( comments => {
		html_all_comments(comments);
	}).catch((error) => {
          console.log(error);
    });

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



/* END LOCAL */

/*END FETCHES */



function html_results(movies){
	document.querySelector('#comments-section').style.display = 'none';
	const results = document.querySelector('#results');
	results.innerHTML = "";
	movies.forEach((movie) => {
		let item = document.createElement('div');
        item.innerHTML = `
        <div class="container">
          <div id="row" class="border row">
            <div class="col-sm">
            <img src=${movie.Poster}>
              <label>${movie.Title}</label>
              <div> ${movie.Year}</div>
            </div>
          </div>
        </div>
       `;
       item.addEventListener('click', event => {
	       getMovieById(movie.imdbID);
	      });

       results.append(item);
	});

}

function html_results_byId(movie){
	document.querySelector('#movieId').value = movie.imdbID;
	const results = document.querySelector('#movie-content');
	results.innerHTML = "";
	let item = document.createElement('div');
    item.innerHTML = `
    <div class="container">
      <div id="row" class="border row">
        <div class="col-sm">
        <img src=${movie.Poster}>
          <label>${movie.Title}</label>
          <div> ${movie.Year}</div>
        </div>
      </div>
    </div>
   `;

   results.append(item);
}

function html_all_comments(comments){
	console.log(comments)
	const results = document.querySelector('#all-comments');
	results.innerHTML = "";
	comments.forEach((comment) => {
		let item = document.createElement('div');
	    item.innerHTML = `
	    <div class="container border">
	    <label style="font-weight:lighter">${comment.user}</label>
	    <h3>${comment.content}</h3>
	    </div>
	   `;

	   results.append(item);
	});

}











