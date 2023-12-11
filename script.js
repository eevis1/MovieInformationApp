// Function to format date as day/month/year
function formatDate(dateString) {
  const date = new Date(dateString); // Create a new Date object using the input dateString
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' }; // Define formatting options
  return date.toLocaleDateString(undefined, options); // Convert the date to a localized date string in the specified format
}

// Function to fetch theaters from Finnkino API and populate the dropdown
function fetchTheaters() {
  // Get the theater selection dropdown element
  const theaterSelect = document.getElementById('theaterSelect');

  // Fetch theaters data from the Finnkino API
  fetch('https://www.finnkino.fi/xml/TheatreAreas/')
    .then(response => response.text())
    .then(data => {
      // Parse the XML response to extract theater information
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const theaters = xml.querySelectorAll('TheatreArea');

      // Add theaters to the dropdown
      theaters.forEach(theater => {
        // Create an option element for each theater and set its value and text content
        const option = document.createElement('option');
        option.value = theater.querySelector('ID').textContent; // Set the option's value to theater ID
        option.textContent = theater.querySelector('Name').textContent; // Set the option's text to theater name
        theaterSelect.appendChild(option); // Add the option to the theater selection dropdown
      });

      // Trigger fetching movies for the initially selected theater
      const initialTheaterId = theaterSelect.value;
      fetchMovies(initialTheaterId); // Call the fetchMovies function to load movies for the initially selected theater
    })
    .catch(error => console.error('Error fetching theaters:', error)); //Catch an error
}

// Function to fetch movies for a given theater from Finnkino API
function fetchMovies(theaterId) {
  const moviesList = document.getElementById('moviesList');
  moviesList.innerHTML = ''; // Clear previous movies

  fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
    .then(response => response.text())
    .then(movieData => {
      // Parse the XML response to extract movie details
      const movieParser = new DOMParser();
      const moviesXml = movieParser.parseFromString(movieData, 'text/xml');
      const movies = moviesXml.querySelectorAll('Show');

      // Loop through the movies and display their details
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

        // Create elements to display movie details
        const img = document.createElement('img'); // Image
        img.src = imageUrl;
        movieDiv.appendChild(img);

        const titleHeading = document.createElement('h2'); //Title
        titleHeading.textContent = title;
        movieDiv.appendChild(titleHeading);

        // Display movie showtime
        const showTime = document.createElement('p');
        showTime.textContent = `${startDate}\nStarts at: ${startTime}`; // Combine formatted date and time
        movieDiv.appendChild(showTime);

        // Create 'info' button for each movie
        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.classList.add('info-button');
        movieDiv.appendChild(infoButton);

         // Event listener for 'info' button click to display movie details from OMDB API
        infoButton.addEventListener('click', () => {
          displayOMDBInfo(title, originalTitle);
        });

        moviesList.appendChild(movieDiv);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}

// Function to display movie details obtained from OMDB API
function displayOMDBInfo(title, originalTitle) {
  function displayMovieDetails(movieInfo) {
    // Display movie details fetched from OMDB API
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

  // Fetch movie details from OMDB API using the movie title
  fetch(`https://www.omdbapi.com/?apikey=5eedae7&t=${title}&type=movie`)
    .then(response => response.json())
    .then(data => {
      // Check if movie details were found
      if (data.Response === 'True') {
        const imdbID = data.imdbID;
        // Fetch detailed movie information using IMDB ID
        fetch(`https://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`)
          .then(response => response.json())
          .then(movieInfo => {
            displayMovieDetails(movieInfo); // Display detailed movie information
          })
          .catch(error => console.error('Error fetching movie details:', error));
      } else {
        // If movie details not found using the primary title, try using the original title
        fetch(`https://www.omdbapi.com/?apikey=5eedae7&t=${originalTitle}&type=movie`)
          .then(response => response.json())
          .then(data => {
            if (data.Response === 'True') {
              const imdbID = data.imdbID;
              // Fetch detailed movie information using IMDB ID
              fetch(`https://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`)
                .then(response => response.json())
                .then(movieInfo => {
                  displayMovieDetails(movieInfo); // Display detailed movie information
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
  fetchMovies(event.target.value); // Fetch movies for the selected theater
});

// Event listener for custom movie search
document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm !== '') {
    displayOMDBInfo(searchTerm); // Display movie details based on search term
  } else {
    console.log('Please enter a movie title.');
  }
});

// Fetch theaters when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchTheaters);

