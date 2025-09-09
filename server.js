const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MariaDB database');
  
  const createTable = `
    CREATE TABLE IF NOT EXISTS movies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      director VARCHAR(255) NOT NULL,
      genre VARCHAR(100) NOT NULL,
      release_year INT NOT NULL,
      rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10)
    )
  `;
  
  db.query(createTable, (err) => {
    if (err) {
      console.error('Error creating movies table:', err);
    } else {
      console.log('Movies table ready');
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/movies', (req, res) => {
  const query = 'SELECT * FROM movies ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve movies' });
    }
    res.json(results);
  });
});

app.post('/movies', (req, res) => {
  const { title, director, genre, release_year, rating } = req.body;
  
  console.log('Received POST request with data:', req.body);
  
  if (!title || !director || !genre || !release_year || !rating) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const query = 'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)';
  console.log('Executing query:', query);
  console.log('With values:', [title, director, genre, release_year, rating]);
  
  db.query(query, [title, director, genre, release_year, rating], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add movie', details: err.message });
    }
    console.log('Movie added successfully, ID:', result.insertId);
    res.status(201).json({ id: result.insertId, message: 'Movie added successfully' });
  });
});

app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, director, genre, release_year, rating } = req.body;
  
  console.log('Received PUT request for ID:', id, 'with data:', req.body);
  
  if (!title || !director || !genre || !release_year || !rating) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const query = 'UPDATE movies SET title = ?, director = ?, genre = ?, release_year = ?, rating = ? WHERE id = ?';
  console.log('Executing update query for ID:', id);
  
  db.query(query, [title, director, genre, release_year, rating, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update movie', details: err.message });
    }
    if (result.affectedRows === 0) {
      console.log('No movie found with ID:', id);
      return res.status(404).json({ error: 'Movie not found' });
    }
    console.log('Movie updated successfully, ID:', id);
    res.json({ message: 'Movie updated successfully' });
  });
});

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  
  console.log('Received DELETE request for ID:', id);
  
  const query = 'DELETE FROM movies WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete movie', details: err.message });
    }
    if (result.affectedRows === 0) {
      console.log('No movie found with ID:', id);
      return res.status(404).json({ error: 'Movie not found' });
    }
    console.log('Movie deleted successfully, ID:', id);
    res.json({ message: 'Movie deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
