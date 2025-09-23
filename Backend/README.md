# Chiro Website Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Make sure MySQL is running on your system
2. Run the database setup script:
```bash
mysql -u root -p < database_setup.sql
```

### 3. Configure Database Connection
Edit `server.js` and update the database connection settings:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'chirosite'
});
```

### 4. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3307`

## API Endpoints

### Articles (Artikels)
- `GET /artikels` - Get all articles
- `GET /artikels/:id` - Get article by ID
- `GET /artikels/favorite` - Get favorite articles
- `POST /artikels` - Create new article
- `PUT /artikels/:id` - Update article
- `DELETE /artikels/:id` - Delete article

### Image Upload
- `POST /api/upload-image` - Upload an image file

### Photos (Fotos)
- `GET /fotos` - Get all photos
- `GET /fotos/:id` - Get photos by album ID
- `GET /fotos/favorite` - Get favorite photos

### Events (Evenementen)
- `GET /evenementen` - Get all events
- `GET /evenementen/:id` - Get event by ID

### Activities (Activiteiten)
- `GET /activiteiten/all` - Get all activities

### People (Personen)
- `GET /personen` - Get all people

## File Upload
- Images are stored in the `uploads/` directory
- Maximum file size: 5MB
- Supported formats: All image types (jpg, png, gif, etc.)
- Files are served from `/uploads/` endpoint

## Database Schema

### Artikels Table
```sql
CREATE TABLE artikels (
    artikelID INT AUTO_INCREMENT PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    datum DATE NOT NULL,
    tekst TEXT NOT NULL,
    locatieFoto VARCHAR(500),
    bijschrift VARCHAR(255),
    favoriet BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if MySQL is running
   - Verify database credentials in server.js
   - Make sure the 'chirosite' database exists

2. **Image Upload Not Working**
   - Check if the 'uploads' directory exists
   - Verify file permissions
   - Check file size (max 5MB)

3. **CORS Errors**
   - The server is configured with CORS enabled
   - Make sure your frontend is running on the correct port

4. **Port Already in Use**
   - Change the PORT variable in server.js
   - Or kill the process using port 3307 