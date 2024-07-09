//API KEY: 5e3f8589a68474c2a5a60d3b241d2bfb

//Router
const global = {
  currentPage: window.location.pathname,
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const movieElementDiv = document.createElement('div');
    movieElementDiv.classList.add('card');
    movieElementDiv.innerHTML = `<div class="card">
          <a href="movie-details.html?id=${movie.id}">
            <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="Movie Title" />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        </div>`;
    document.querySelector('#popular-movies').appendChild(movieElementDiv);
  });
}

//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = '5e3f8589a68474c2a5a60d3b241d2bfb';
  const API_URL = 'https://api.themoviedb.org/3/';

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1`
  );

  const data = await response.json();

  return data;
}

//Highlight Active Link
function highlightActiveLink() {
  const navElements = document.querySelectorAll('.nav-link');

  navElements.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('Shows');
      break;
    case '/movie-details.html':
      console.log('Movie details');
      break;
    case '/tv-details.html':
      console.log('tv details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
