//Router
const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: '5e3f8589a68474c2a5a60d3b241d2bfb',
    apiURL: 'https://api.themoviedb.org/3/',
  },
};

//Display Popular Movies
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
  console.log('Movies:', results);
}

//Display Popular Shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((tv) => {
    const tvElementDiv = document.createElement('div');
    tvElementDiv.classList.add('card');
    tvElementDiv.innerHTML = `<div class="card">
          <a href="tv-details.html?id=${tv.id}">
            <img
              src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
              class="card-img-top"
              alt="${tv.name}" />
          </a>
          <div class="card-body">
            <h5 class="card-title">${tv.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${tv.first_air_date}</small>
            </p>
          </div>
        </div>`;
    document.querySelector('#popular-shows').appendChild(tvElementDiv);
  });
}

//Display Movie Details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);
  console.log('Movie Details', movie);

  displayBackgroundImage('movie', movie.backdrop_path);

  const divElement = document.createElement('div');

  divElement.innerHTML = `
        <div class="details-top">
          <div>
          ${
            movie.poster_path === null
              ? `<img
            src="./images/no-image.jpg"
            class="card-img-top"
            alt="${movie.name}"/>`
              : `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.name}" />`
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span>
              $${addCommastoNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span>
              $${addCommastoNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span>
            ${movie.runtime}</li>
            <li><span class="text-secondary">Status:</span>
            ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${movie.production_companies
            .map((company) => `<li>${company.name}</li>`)
            .join('')}
          </div>
        </div>`;

  document.querySelector('#movie-details').appendChild(divElement);
}

//Display TV Show Details
async function displayTvShowDetails() {
  const showId = window.location.search.split('=')[1];
  const show = await fetchAPIData(`tv/${showId}`);
  console.log('Show Details', show);

  displayBackgroundImage('show', show.backdrop_path);

  const divElement = document.createElement('div');

  divElement.innerHTML = `
        <div class="details-top">
          <div>
          ${
            show.poster_path === null
              ? `<img
            src="./images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"/>`
              : `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}" />`
          }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Status:</span>
            ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies
            .map((company) => `<li>${company.name}</li>`)
            .join('')}
          </div>
        </div>`;

  document.querySelector('#show-details').appendChild(divElement);
}

//Search for Movie
async function search() {
  const queryStringFromUrl = window.location.search;
  // console.log(queryStringFromUrl);
  const urlParams = new URLSearchParams(queryStringFromUrl);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    console.log(results, total_pages, page, total_results);

    global.search.page = page;
    global.search.totalResults = total_results;
    global.search.totalPages = total_pages;

    if (results.length > 0) {
      displaySearchResults(results);
      document.querySelector('#search-term').value = '';
    } else {
      alertMessage('No results', 'alert-success');
      return;
    }
  } else {
    alertMessage('Please enter a search term', 'alert-error');
  }
}

//Display Search Results
function displaySearchResults(results) {
  //clear previous result
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((search) => {
    const movieElementDiv = document.createElement('div');
    movieElementDiv.classList.add('card');
    movieElementDiv.innerHTML = `<div class="card">
          <a href="${global.search.type}-details.html?id=${search.id}">
          ${
            search.poster_path === null
              ? `<img
            src="./images/no-image.jpg"
            class="card-img-top"
            alt="${search.name}"/>`
              : `  <img
              src="https://image.tmdb.org/t/p/w500${search.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? search.title : search.name
              } Title" />/>`
          }
           
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? search.title : search.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === 'movie'
                  ? search.release_date
                  : search.first_air_date
              }</small>
            </p>
          </div>
        </div>`;
    document.querySelector('#search-results').appendChild(movieElementDiv);
  });

  const totalResultsElement = document.createElement('div');
  totalResultsElement.innerHTML = `<h3> Displaying 20 of ${global.search.totalResults} Results </h3>`;
  totalResultsElement.style.marginBottom = '20px';
  document
    .querySelector('#search-results-heading')
    .appendChild(totalResultsElement);

  displayPagination();
}

//Miscelaneous ----------------------------------------------
//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1`
  );

  const data = await response.json();
  hideSpinner();
  return data;
}

//Search Movie
async function searchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;
  const typeOfSearch = global.search.type;
  const termOfSearch = global.search.term;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${typeOfSearch}?api_key=${API_KEY}&language=en-US&query=${termOfSearch}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();
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

//Spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

//Format number
function addCommastoNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//Backgound Image
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '125vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.15';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

//Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  console.log('Now Playing: ', results);

  results.forEach((movie) => {
    const divElement = document.createElement('div');
    divElement.classList.add('swiper-slide');

    divElement.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${
                movie.poster_path
              }" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
          `;
    document.querySelector('.swiper-wrapper').appendChild(divElement);
  });
  initSwiper();
}

//Swiper
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1400: {
        slidesPerView: 4,
      },
    },
  });
}

//Alert Element
function alertMessage(message, className) {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, 2000);
}

//Display Pagination
function displayPagination() {
  const divElement = document.createElement('div');
  divElement.classList.add('pagination');
  divElement.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
        `;
  document.querySelector('#pagination').appendChild(divElement);

  //disable button if we are on the first or last page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  //go to next and previous page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();

    displaySearchResults(results);
  });

  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();

    displaySearchResults(results);
  });
}

//Display (ROUTER)
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      displayPopularMovies();
      displaySlider();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayTvShowDetails();
      break;
    case '/search.html':
      console.log('Search');
      search();
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
