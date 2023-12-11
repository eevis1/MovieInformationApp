/*// Function to fetch theaters from Finnkino API and populate the dropdown
function fetchTheaters() {
  const theaterSelect = document.getElementById('theaterSelect');

  fetch('http://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const theaters = xml.querySelectorAll('TheatreArea');

      theaters.forEach(theater => {
        const option = document.createElement('option');
        option.value = theater.querySelector('ID').textContent;
        option.textContent = theater.querySelector('Name').textContent;
        theaterSelect.appendChild(option);
      });

      // Trigger fetching movies for the initially selected theater
      const initialTheaterId = theaterSelect.value;
      fetchMovies(initialTheaterId);
    })
    .catch(error => console.error('Error fetching theaters:', error));
}

// Function to fetch movies for a given theater from Finnkino API
function fetchMovies(theaterId) {
  const moviesList = document.getElementById('moviesList');
  moviesList.innerHTML = ''; // Clear previous movies

  fetch(`http://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
    .then(response => response.text())
    .then(movieData => {
      const movieParser = new DOMParser();
      const moviesXml = movieParser.parseFromString(movieData, 'text/xml');
      const movies = moviesXml.querySelectorAll('Show');

      movies.forEach(movie => {
        const title = movie.querySelector('Title').textContent;
        const originaltitle = movie.querySelector('OriginalTitle').textContent;
        const year = movie.querySelector('ProductionYear').textContent;
        const start = movie.querySelector('dttmShowStart').textContent;
        const imageUrl = movie.querySelector('EventSmallImagePortrait').textContent;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const img = document.createElement('img');
        img.src = imageUrl;
        movieDiv.appendChild(img);

        const titleHeading = document.createElement('h2');
        titleHeading.textContent = title;
        movieDiv.appendChild(titleHeading);

        const startTime = document.createElement('p');
        startTime.textContent = `Starts at: ${start}`;
        movieDiv.appendChild(startTime);

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.classList.add('info-button');
        movieDiv.appendChild(infoButton);

        infoButton.addEventListener('click', () => {
          displayOMDBInfo(title);
        });

        moviesList.appendChild(movieDiv);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}


function displayOMDBInfo(title) {
  // Fetching the IMDB ID first
  fetch(`http://www.omdbapi.com/?apikey=5eedae7&s=${title}&type=movie`) // Search for movies by title
    .then(response => response.json())
    .then(data => {
      const movies = data.Search;
      if (movies && movies.length > 0) {
        const imdbID = movies[0].imdbID; // Get the IMDB ID of the first movie in the search results
        fetch(`http://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`) // Fetch movie details by IMDB ID
          .then(response => response.json())
          .then(movieInfo => {
            const moviesList = document.getElementById('moviesList');
            moviesList.innerHTML = `<div class="movie-details">
                                      <h2>${movieInfo.Title}</h2>
                                      <img src="${movieInfo.Poster}" alt="${movieInfo.Title}">
                                      <p>${movieInfo.Plot}</p>
                                      <p>Director: ${movieInfo.Director}</p>
                                      <p>Actors: ${movieInfo.Actors}</p>
                                      <p>Released: ${movieInfo.Released}</p>
                                    </div>`;
          })
          .catch(error => console.error('Error fetching movie details:', error));
      } else {
        console.log('Movie not found!');
      }
    })
    .catch(error => console.error('Error fetching movie ID:', error));
}

// Event listener for theater selection
document.getElementById('theaterSelect').addEventListener('change', event => {
  fetchMovies(event.target.value);
});

// Event listener for custom movie search
document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm !== '') {
    displayOMDBInfo(searchTerm);
  } else {
    console.log('Please enter a movie title.');
  }
});

// Fetch theaters when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchTheaters);

*/


/*
// Function to fetch theaters from Finnkino API and populate the dropdown
function fetchTheaters() {
  const theaterSelect = document.getElementById('theaterSelect');

  fetch('http://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const theaters = xml.querySelectorAll('TheatreArea');

      theaters.forEach(theater => {
        const option = document.createElement('option');
        option.value = theater.querySelector('ID').textContent;
        option.textContent = theater.querySelector('Name').textContent;
        theaterSelect.appendChild(option);
      });

      // Trigger fetching movies for the initially selected theater
      const initialTheaterId = theaterSelect.value;
      fetchMovies(initialTheaterId);
    })
    .catch(error => console.error('Error fetching theaters:', error));
}

// Function to fetch movies for a given theater from Finnkino API
function fetchMovies(theaterId) {
  const moviesList = document.getElementById('moviesList');
  moviesList.innerHTML = ''; // Clear previous movies

  fetch(`http://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
    .then(response => response.text())
    .then(movieData => {
      const movieParser = new DOMParser();
      const moviesXml = movieParser.parseFromString(movieData, 'text/xml');
      const movies = moviesXml.querySelectorAll('Show');

      movies.forEach(movie => {
        const title = movie.querySelector('Title').textContent;
        const originalTitle = movie.querySelector('OriginalTitle').textContent;
        const year = movie.querySelector('ProductionYear').textContent;
        const start = movie.querySelector('dttmShowStart').textContent;
        const imageUrl = movie.querySelector('EventSmallImagePortrait').textContent;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const img = document.createElement('img');
        img.src = imageUrl;
        movieDiv.appendChild(img);

        const titleHeading = document.createElement('h2');
        titleHeading.textContent = title;
        movieDiv.appendChild(titleHeading);

        const startTime = document.createElement('p');
        startTime.textContent = `Starts at: ${start}`;
        movieDiv.appendChild(startTime);

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.classList.add('info-button');
        movieDiv.appendChild(infoButton);

        infoButton.addEventListener('click', () => {
          displayOMDBInfo(title, originalTitle);
        });

        moviesList.appendChild(movieDiv);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}

function displayOMDBInfo(title, originalTitle) {
  // Function to display movie details from OMDB API
  function displayMovieDetails(movieInfo) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = `<div class="movie-details">
                              <h2>${movieInfo.Title}</h2>
                              <img src="${movieInfo.Poster}" alt="${movieInfo.Title}">
                              <p>${movieInfo.Plot}</p>
                              <p>Director: ${movieInfo.Director}</p>
                              <p>Actors: ${movieInfo.Actors}</p>
                              <p>Released: ${movieInfo.Released}</p>
                            </div>`;
  }

  fetch(`http://www.omdbapi.com/?apikey=5eedae7&t=${title}&type=movie`) // Search for movies by title
    .then(response => response.json())
    .then(data => {
      const movies = data.Search;
      if (movies && movies.length > 0) {
        const imdbID = movies[0].imdbID; // Get the IMDB ID of the first movie in the search results
        fetch(`http://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`) // Fetch movie details by IMDB ID
          .then(response => response.json())
          .then(movieInfo => {
            displayMovieDetails(movieInfo);
          })
          .catch(error => console.error('Error fetching movie details:', error));
      } else {
        // If no data found with the title, search by original title
        fetch(`http://www.omdbapi.com/?apikey=5eedae7&t=${originalTitle}&type=movie`)
          .then(response => response.json())
          .then(data => {
            if (data.Response === 'True') {
              fetch(`http://www.omdbapi.com/?apikey=5eedae7&i=${data.imdbID}&plot=full`)
                .then(response => response.json())
                .then(movieInfo => {
                  displayMovieDetails(movieInfo);
                })
                .catch(error => console.error('Error fetching movie details:', error));
            } else {
              console.log('Movie not found!');
            }
          })
          .catch(error => console.error('Error fetching movie details:', error));
      }
    })
    .catch(error => console.error('Error fetching movie ID:', error));
}

// Event listener for theater selection
document.getElementById('theaterSelect').addEventListener('change', event => {
  fetchMovies(event.target.value);
});

// Event listener for custom movie search
document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm !== '') {
    displayOMDBInfo(searchTerm);
  } else {
    console.log('Please enter a movie title.');
  }
});

// Fetch theaters when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchTheaters);
*/

// Function to format date as day/month/year
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// Function to fetch theaters from Finnkino API and populate the dropdown
function fetchTheaters() {
  const theaterSelect = document.getElementById('theaterSelect');

  fetch('http://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const theaters = xml.querySelectorAll('TheatreArea');

      theaters.forEach(theater => {
        const option = document.createElement('option');
        option.value = theater.querySelector('ID').textContent;
        option.textContent = theater.querySelector('Name').textContent;
        theaterSelect.appendChild(option);
      });

      // Trigger fetching movies for the initially selected theater
      const initialTheaterId = theaterSelect.value;
      fetchMovies(initialTheaterId);
    })
    .catch(error => console.error('Error fetching theaters:', error));
}


// Function to fetch movies for a given theater from Finnkino API
function fetchMovies(theaterId) {
  const moviesList = document.getElementById('moviesList');
  moviesList.innerHTML = ''; // Clear previous movies

  fetch(`http://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
    .then(response => response.text())
    .then(movieData => {
      const movieParser = new DOMParser();
      const moviesXml = movieParser.parseFromString(movieData, 'text/xml');
      const movies = moviesXml.querySelectorAll('Show');

      movies.forEach(movie => {
        const title = movie.querySelector('Title').textContent;
        const originalTitle = movie.querySelector('OriginalTitle').textContent;
        const year = movie.querySelector('ProductionYear').textContent;
        const start = movie.querySelector('dttmShowStart').textContent;
        const startDate = formatDate(start); // Format start date
        const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format start time without seconds
        const imageUrl = movie.querySelector('EventSmallImagePortrait').textContent;

        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const img = document.createElement('img');
        img.src = imageUrl;
        movieDiv.appendChild(img);

        const titleHeading = document.createElement('h2');
        titleHeading.textContent = title;
        movieDiv.appendChild(titleHeading);


        const showTime = document.createElement('p');
        showTime.textContent = `${startDate}\nStarts at: ${startTime}`; // Combine formatted date and time
        movieDiv.appendChild(showTime);

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.classList.add('info-button');
        movieDiv.appendChild(infoButton);

        infoButton.addEventListener('click', () => {
          displayOMDBInfo(title, originalTitle);
        });

        moviesList.appendChild(movieDiv);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}

function displayOMDBInfo(title, originalTitle) {
  function displayMovieDetails(movieInfo) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = `<div class="movie-details">
                              <h2>${movieInfo.Title}</h2>
                              <img src="${movieInfo.Poster}" alt="${movieInfo.Title}">
                              <p>${movieInfo.Plot}</p>
                              <p>Director: ${movieInfo.Director}</p>
                              <p>Actors: ${movieInfo.Actors}</p>
                              <p>Released: ${movieInfo.Released}</p>
                            </div>`;
  }

  fetch(`http://www.omdbapi.com/?apikey=5eedae7&t=${title}&type=movie`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const imdbID = data.imdbID;
        fetch(`http://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`)
          .then(response => response.json())
          .then(movieInfo => {
            displayMovieDetails(movieInfo);
          })
          .catch(error => console.error('Error fetching movie details:', error));
      } else {
        fetch(`http://www.omdbapi.com/?apikey=5eedae7&t=${originalTitle}&type=movie`)
          .then(response => response.json())
          .then(data => {
            if (data.Response === 'True') {
              const imdbID = data.imdbID;
              fetch(`http://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`)
                .then(response => response.json())
                .then(movieInfo => {
                  displayMovieDetails(movieInfo);
                })
                .catch(error => console.error('Error fetching movie details:', error));
            } else {
              console.log('Movie not found!');
            }
          })
          .catch(error => console.error('Error fetching movie details:', error));
      }
    })
    .catch(error => console.error('Error fetching movie ID:', error));
}

// Event listener for theater selection
document.getElementById('theaterSelect').addEventListener('change', event => {
  fetchMovies(event.target.value);
});

// Event listener for custom movie search
document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm !== '') {
    displayOMDBInfo(searchTerm);
  } else {
    console.log('Please enter a movie title.');
  }
});

// Fetch theaters when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchTheaters);

