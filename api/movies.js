const { getConnection } = require('./db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getConnection();

  try {
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
    
    await new Promise((resolve, reject) => {
      db.query(createTable, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (req.method === 'GET') {
      const query = 'SELECT * FROM movies ORDER BY id DESC';
      const results = await new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
      return res.json(results);
    }

    if (req.method === 'POST') {
      const { title, director, genre, release_year, rating } = req.body;
      
      if (!title || !director || !genre || !release_year || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const query = 'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)';
      const result = await new Promise((resolve, reject) => {
        db.query(query, [title, director, genre, release_year, rating], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      return res.status(201).json({ id: result.insertId, message: 'Movie added successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
};
