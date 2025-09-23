const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Enables parsing JSON bodies in requests, if needed

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

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
  const sqlQuery = `SELECT * FROM artikels JOIN fotos ON artikels.fotoID = fotos.idfotos WHERE artikels.favorite = true AND artikelID = 1`;
  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      console.error(`Error fetching artikel with ID ${id}:`, err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// 6) Fetch all artikels
app.get('/artikels', (req, res) => {
  const sqlQuery = `SELECT * FROM artikels JOIN fotos ON artikels.fotoID = fotos.idfotos`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Error fetching artikels:', err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// 7) Create new artikel
app.post('/artikels', (req, res) => {
  const { titel, datum, tekst, locatieFoto, bijschrift, favoriet } = req.body;
  const sqlQuery = `
    INSERT INTO artikels (titel, datum, tekst, locatieFoto, bijschrift, favoriet) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sqlQuery, [titel, datum, tekst, locatieFoto, bijschrift, favoriet || false], (err, result) => {
    if (err) {
      console.error('Error creating artikel:', err);
      return res.status(500).json({ error: 'Failed to create artikel' });
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// 8) Update artikel
app.put('/artikels/:id', (req, res) => {
  const { id } = req.params;
  const { titel, datum, tekst, locatieFoto, bijschrift, favoriet } = req.body;
  const sqlQuery = `
    UPDATE artikels 
    SET titel = ?, datum = ?, tekst = ?, locatieFoto = ?, bijschrift = ?, favoriet = ?
    WHERE artikelID = ?
  `;
  db.query(sqlQuery, [titel, datum, tekst, locatieFoto, bijschrift, favoriet, id], (err, result) => {
    if (err) {
      console.error('Error updating artikel:', err);
      return res.status(500).json({ error: 'Failed to update artikel' });
    }
    res.json({ id, ...req.body });
  });
});

// 9) Delete artikel
app.delete('/artikels/:id', (req, res) => {
  const { id } = req.params;
  const sqlQuery = `DELETE FROM artikels WHERE artikelID = ?`;
  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting artikel:', err);
      return res.status(500).json({ error: 'Failed to delete artikel' });
    }
    res.json({ message: 'Artikel deleted successfully' });
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

app.get('/evenementen', (req, res) => {
  const sqlQuery = `SELECT * FROM evenementen`;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error(`Error fetching evenementen: `, err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

app.get('/evenementen/:id', (req, res) => {
  const { id } = req.params;
  const sqlQuery = `SELECT * FROM evenementen WHERE idevenementen = ?`;
  db.query(sqlQuery, [id], (err, result) => {
    if (err) {
      console.error(`Error fetching evenement with ID ${id}:`, err);
      return res.sendStatus(500);
    }
    res.json(result);
  });
});

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the file path that can be used to access the image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: 'Only image files are allowed!' });
  }
  next(error);
});

const PORT = 3307;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
