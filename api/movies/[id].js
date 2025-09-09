const { getConnection } = require('../db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const db = getConnection();

  try {
    if (req.method === 'PUT') {
      const { title, director, genre, release_year, rating } = req.body;
      
      if (!title || !director || !genre || !release_year || !rating) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const query = 'UPDATE movies SET title = ?, director = ?, genre = ?, release_year = ?, rating = ? WHERE id = ?';
      const result = await new Promise((resolve, reject) => {
        db.query(query, [title, director, genre, release_year, rating, id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      
      return res.json({ message: 'Movie updated successfully' });
    }

    if (req.method === 'DELETE') {
      const query = 'DELETE FROM movies WHERE id = ?';
      const result = await new Promise((resolve, reject) => {
        db.query(query, [id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      
      return res.json({ message: 'Movie deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
};
