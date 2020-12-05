
document.addEventListener('DOMContentLoaded', function() {
console.log("asdfasdfasdijhasdf")

 document.querySelector("#search-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = document.querySelector('#q').value;
      getMovies(query);
    });

});


function getMovies(query) {
  fetch(`http://www.omdbapi.com/?s=`+query+`&apikey=e2ce2b93`)
    .then(response => response.json())
      .then( movies => {
       html_results(movies.Search);//nested data           
      }).catch((error) => {
          console.log(error);
    });
}

function html_results(movies){
	const results = document.querySelector('#results');
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
       results.append(item);
	});

}



