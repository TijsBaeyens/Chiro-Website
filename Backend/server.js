const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chirosite'
});

app.get('/fotos/favorite', (req, res) => {
    db.query(`SELECT albums.name AS album_name, fotos.*
    FROM albums
    JOIN fotos ON albums.albumID = fotos.albumID
    WHERE albums.favorite = true`, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/fotos', (req, res) => {
    db.query(`SELECT albums.name AS album_name, fotos.*
    FROM albums
    JOIN fotos ON albums.albumID = fotos.albumID`, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/fotos/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT albums.name AS album_name, fotos.*
    FROM albums
    JOIN fotos ON albums.albumID = fotos.albumID
    WHERE albums.albumID = ${id}`, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/artikels/favorite', (req, res) => {
    db.query(`SELECT * FROM artikels WHERE favorite = true`, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/artikels/:id', (req, res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM artikels WHERE ID = ${id}`, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/evenementen/all', (req, res) => {
    db.query(`SELECT * FROM evenementen`, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})



app.listen(3307, () => {
    console.log("Server is running on port 3307");
})