let editingMovieId = null;
const API_BASE = window.location.origin;
const API_PATH = window.location.hostname === 'localhost' ? '' : '/api';

document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    
    document.getElementById('movieForm').addEventListener('submit', handleAddMovie);
    document.getElementById('editForm').addEventListener('submit', handleEditMovie);
});

async function loadMovies() {
    try {
        const response = await fetch(`${API_BASE}${API_PATH}/movies`);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

function displayMovies(movies) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';
    
    if (movies.length === 0) {
        moviesList.innerHTML = '<p class="text-gray-500 text-center col-span-full">No movies found. Add your first movie!</p>';
        return;
    }
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'bg-gray-50 rounded-lg p-4 border border-gray-200';
        movieCard.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800 mb-2">${movie.title}</h3>
            <p class="text-sm text-gray-600 mb-1"><strong>Director:</strong> ${movie.director}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Genre:</strong> ${movie.genre}</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Year:</strong> ${movie.release_year}</p>
            <p class="text-sm text-gray-600 mb-3"><strong>Rating:</strong> ${movie.rating}/10</p>
            <div class="flex space-x-2">
                <button onclick="openEditModal(${movie.id})" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                    Edit
                </button>
                <button onclick="deleteMovie(${movie.id})" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    Delete
                </button>
            </div>
        `;
        moviesList.appendChild(movieCard);
    });
}

async function handleAddMovie(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
        genre: document.getElementById('genre').value,
        release_year: parseInt(document.getElementById('release_year').value),
        rating: parseFloat(document.getElementById('rating').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}${API_PATH}/movies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            document.getElementById('movieForm').reset();
            loadMovies();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Failed to add movie');
    }
}

async function openEditModal(movieId) {
    try {
        const response = await fetch(`${API_BASE}${API_PATH}/movies`);
        const movies = await response.json();
        const movie = movies.find(m => m.id === movieId);
        
        if (movie) {
            editingMovieId = movieId;
            document.getElementById('editId').value = movie.id;
            document.getElementById('editTitle').value = movie.title;
            document.getElementById('editDirector').value = movie.director;
            document.getElementById('editGenre').value = movie.genre;
            document.getElementById('editReleaseYear').value = movie.release_year;
            document.getElementById('editRating').value = movie.rating;
            document.getElementById('editModal').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading movie for edit:', error);
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    editingMovieId = null;
}

async function handleEditMovie(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('editTitle').value,
        director: document.getElementById('editDirector').value,
        genre: document.getElementById('editGenre').value,
        release_year: parseInt(document.getElementById('editReleaseYear').value),
        rating: parseFloat(document.getElementById('editRating').value)
    };
    
    try {
        const response = await fetch(`${API_BASE}${API_PATH}/movies/${editingMovieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            closeEditModal();
            loadMovies();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error updating movie:', error);
        alert('Failed to update movie');
    }
}

async function deleteMovie(movieId) {
    if (confirm('Are you sure you want to delete this movie?')) {
        try {
            const response = await fetch(`${API_BASE}${API_PATH}/movies/${movieId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadMovies();
            } else {
                const error = await response.json();
                alert('Error: ' + error.error);
            }
        } catch (error) {
            console.error('Error deleting movie:', error);
            alert('Failed to delete movie');
        }
    }
}
