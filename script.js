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
  // Retrieve the DOM element representing the movies list container
  const moviesList = document.getElementById('moviesList');
  moviesList.innerHTML = ''; // Clear previous movies

  // Fetch movie schedule data from Finnkino API based on the selected theater ID
  fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
    .then(response => response.text()) // Retrieve the response data as text
    .then(movieData => {
      // Parse the XML response to extract movie details
      const movieParser = new DOMParser();
      const moviesXml = movieParser.parseFromString(movieData, 'text/xml'); // Parsing XML string to an XML document
      const movies = moviesXml.querySelectorAll('Show'); // Extract all 'Show' elements containing movie details

      // Loop through the movies and display their details
      movies.forEach(movie => {
        // Extract movie details from the selected 'Show' element
        const title = movie.querySelector('Title').textContent; // Retrieve the movie title
        const originalTitle = movie.querySelector('OriginalTitle').textContent; // Retrieve the original movie title
        const year = movie.querySelector('ProductionYear').textContent; // Retrieve the production year of the movie
        const start = movie.querySelector('dttmShowStart').textContent; // Retrieve the start time of the movie
        const startDate = formatDate(start); // Format start date
        const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format start time without seconds
        const imageUrl = movie.querySelector('EventSmallImagePortrait').textContent; // Retrieve the URL of the movie's small image

        const movieDiv = document.createElement('div'); // Create a 'div' element to contain movie details
        movieDiv.classList.add('movie'); // Add 'movie' class to the created 'div' element

        // Create elements to display movie details
        // Create an 'img' element for the movie poster
        const img = document.createElement('img'); // Image element creation
        img.src = imageUrl; // Set the image source URL
        movieDiv.appendChild(img); // Append the image element to the movieDiv

        // Create an 'h2' element for the movie title
        const titleHeading = document.createElement('h2'); // Title heading creation
        titleHeading.textContent = title; // Set the text content to the movie title
        movieDiv.appendChild(titleHeading); // Append the title heading to the movieDiv

        // Create a 'p' element for displaying the movie showtime
        const showTime = document.createElement('p'); // Showtime paragraph creation
        showTime.textContent = `${startDate}\nStarts at: ${startTime}`; // Combine formatted date and time
        movieDiv.appendChild(showTime); // Append the showtime paragraph to the movieDiv

        // Create 'info' button for each movie
        const infoButton = document.createElement('button'); // Create a 'button' element for movie info
        infoButton.textContent = 'Info'; // Set the text content of the button to 'Info'
        infoButton.classList.add('info-button'); // Add the 'info-button' class to the button element
        movieDiv.appendChild(infoButton); // Append the info button to the movieDiv

         // Event listener for 'info' button click to display movie details from OMDB API
        infoButton.addEventListener('click', () => {
          displayOMDBInfo(title, originalTitle); // Add an event listener for the 'Info' button click to display movie details
        });

        moviesList.appendChild(movieDiv); // Append the movieDiv containing movie details to the moviesList
      });
    })
    .catch(error => console.error('Error fetching movies:', error)); // Catch an error fetching movies
}

// Function to display movie details obtained from OMDB API
function displayOMDBInfo(title, originalTitle) {
  function displayMovieDetails(movieInfo) { // Function to display detailed movie information on the webpage
    // Display movie details fetched from OMDB API
    const moviesList = document.getElementById('moviesList');
    // Generate HTML content for movie details using fetched movie information
    moviesList.innerHTML = `<div class="movie-details">
                              <h2>${movieInfo.Title}</h2>
                              <img src="${movieInfo.Poster}" alt="${movieInfo.Title}">
                              <p>${movieInfo.Plot}</p>
                              <p>Director: ${movieInfo.Director}</p>
                              <p>Actors: ${movieInfo.Actors}</p>
                              <p>Released: ${movieInfo.Released}</p>
                            </div>`;
  }

  // Create a back button to return to the movie list
  const backButton = document.createElement('button');
  backButton.textContent = 'Back'; // Set the text content of the back button to 'Back'
  backButton.classList.add('back-button'); // Add a CSS class 'back-button' to the back button element
  moviesList.appendChild(backButton); // Append the back button to the moviesList container to display it on the webpage
 
  // Event listener for the back button to go back to the movie list
  backButton.addEventListener('click', () => {
  fetchMovies(); // Fetch movies again to display the movie list
  });

  // Fetch movie details from OMDB API using the movie title
  fetch(`https://www.omdbapi.com/?apikey=5eedae7&t=${title}&type=movie`)
    .then(response => response.json()) // Retrieve the response as JSON format
    .then(data => { // Handle the received data
      // Check if movie details were found
      if (data.Response === 'True') {
        const imdbID = data.imdbID; // Retrieve the IMDb ID from the received data
        // Fetch detailed movie information using IMDB ID
        fetch(`https://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`)
          .then(response => response.json()) // Retrieve the response as JSON format
          .then(movieInfo => { // Handle the movie information received in the response
            displayMovieDetails(movieInfo); // Display detailed movie information
          })
          .catch(error => console.error('Error fetching movie details:', error)); // Catch an error fetching movie details
      } else {
        // If movie details not found using the primary title, try using the original title
        fetch(`https://www.omdbapi.com/?apikey=5eedae7&t=${originalTitle}&type=movie`)
          .then(response => response.json()) // Convert the response to JSON format
          .then(data => { // Handle the received data
            if (data.Response === 'True') { // Check if the response from the API is successful
              const imdbID = data.imdbID; // Extract the IMDb ID from the received data
              // Fetch detailed movie information using IMDB ID
              fetch(`https://www.omdbapi.com/?apikey=5eedae7&i=${imdbID}&plot=full`)
                .then(response => response.json()) // Retrieve the response as JSON format
                .then(movieInfo => { // Handle the movie information received in the response
                  displayMovieDetails(movieInfo); // Display detailed movie information
                })
                .catch(error => console.error('Error fetching movie details:', error)); // Catch an error fetching movie details
            } else {
              console.log('Movie not found!'); // Error message
            }
          })
          .catch(error => console.error('Error fetching movie details:', error)); // Catch an error fetching movie details
      }
    })
    .catch(error => console.error('Error fetching movie ID:', error)); // Catch an error fetching movie ID
}

// Event listener for theater selection
document.getElementById('theaterSelect').addEventListener('change', event => {
  fetchMovies(event.target.value); // Fetch movies for the selected theater
});

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.trim(); // Retrieve the search term entered by the user
  if (searchTerm !== '') { // Check if the search term is not empty
    displayOMDBInfo(searchTerm); // Display movie details based on search term
  } else {
    console.log('Please enter a movie title.'); // Log a message if no search term is entered
  }
});

// Fetch theaters when the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchTheaters);

