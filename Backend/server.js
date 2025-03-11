const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Enables parsing JSON bodies in requests, if needed

// Create the MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',    // Change if you use a password
  database: 'chirosite'
});

// Connect to the database (optional, but good for error-checking on startup)
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Example Routes

// 1) Fetch favorite photos

app.get('/fotos/favorite', (req, res) => {
  const sqlQuery = `
    SELECT * FROM album
    JOIN fotos ON album.albumid = fotos.albumID
    WHERE album.favorite = true
  `;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching favorite photos:', err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// 2) Fetch all photos
app.get('/fotos', (req, res) => {
  const sqlQuery = `
    SELECT album.name AS album_name, fotos.*
    FROM album
    JOIN fotos ON album.albumID = fotos.albumID
  `;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching photos:', err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// 3) Fetch photos by album ID
app.get('/fotos/:id', (req, res) => {
  const { id } = req.params;
  const sqlQuery = `
    SELECT album.name AS album_name, fotos.*
    FROM album
    JOIN fotos ON album.albumID = fotos.albumID
    WHERE album.albumID = ?
  `;
  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      console.error(`Error fetching photos by album ID ${id}:`, err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// 4) Fetch favorite artikels
app.get('/artikels/favorite', (req, res) => {
  const sqlQuery = `SELECT * FROM artikels 
  JOIN fotos ON artikels.fotoID = fotos.idfotos 
  WHERE artikels.favorite = true`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching favorite artikels:', err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// 5) Fetch artikel by ID
app.get('/artikels/:id', (req, res) => {
  const { id } = req.params;
  const sqlQuery = `SELECT * FROM artikels WHERE ID = ?`;
  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      console.error(`Error fetching artikel with ID ${id}:`, err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

app.get('/activiteiten/all', (req, res) => {
  const sqlQuery = `SELECT * FROM activiteiten`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching activiteiten:', err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

app.get('/personen', (req, res) => {
  const sqlQuery = `
    SELECT name, roles, imageUrl, description
    FROM personen
  `;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching persons:', err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});


const PORT = 3307;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
