-- Database setup for Chiro Website
-- Run this script in your MySQL database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS chirosite;
USE chirosite;

-- Create artikels table if it doesn't exist
CREATE TABLE IF NOT EXISTS artikels (
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

-- Add missing columns to existing artikels table
-- Add locatieFoto column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chirosite' 
     AND TABLE_NAME = 'artikels' 
     AND COLUMN_NAME = 'locatieFoto') = 0,
    'ALTER TABLE artikels ADD COLUMN locatieFoto VARCHAR(500) AFTER tekst',
    'SELECT "locatieFoto column already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add bijschrift column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chirosite' 
     AND TABLE_NAME = 'artikels' 
     AND COLUMN_NAME = 'bijschrift') = 0,
    'ALTER TABLE artikels ADD COLUMN bijschrift VARCHAR(255) AFTER locatieFoto',
    'SELECT "bijschrift column already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add favoriet column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'chirosite' 
     AND TABLE_NAME = 'artikels' 
     AND COLUMN_NAME = 'favoriet') = 0,
    'ALTER TABLE artikels ADD COLUMN favoriet BOOLEAN DEFAULT FALSE AFTER bijschrift',
    'SELECT "favoriet column already exists" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create fotos table (if not exists)
CREATE TABLE IF NOT EXISTS fotos (
    idfotos INT AUTO_INCREMENT PRIMARY KEY,
    albumID INT,
    locatie VARCHAR(500) NOT NULL,
    bijschrift VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create album table (if not exists)
CREATE TABLE IF NOT EXISTS album (
    albumID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create evenementen table (if not exists)
CREATE TABLE IF NOT EXISTS evenementen (
    idevenementen INT AUTO_INCREMENT PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    datum DATE NOT NULL,
    groep VARCHAR(100),
    beschrijving TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activiteiten table (if not exists)
CREATE TABLE IF NOT EXISTS activiteiten (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    datum DATE NOT NULL,
    groep VARCHAR(100),
    beschrijving TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create personen table (if not exists)
CREATE TABLE IF NOT EXISTS personen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    roles VARCHAR(255),
    imageUrl VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data only if artikels table is empty
INSERT INTO artikels (titel, datum, tekst, locatieFoto, bijschrift, favoriet) 
SELECT 'Welkom bij Chiro Serskamp', '2024-01-15', 'Welkom bij onze Chiro groep! We zijn een actieve jeugdbeweging die elke zaterdag samenkomt voor spel en plezier.', 'https://via.placeholder.com/400x300?text=Chiro+Serskamp', 'Groepsfoto Chiro Serskamp', true
WHERE NOT EXISTS (SELECT 1 FROM artikels LIMIT 1);

INSERT INTO artikels (titel, datum, tekst, locatieFoto, bijschrift, favoriet) 
SELECT 'Eerste activiteit van het jaar', '2024-01-20', 'Onze eerste activiteit van het nieuwe jaar was een groot succes! Alle groepen hebben genoten van de spellen en activiteiten.', 'https://via.placeholder.com/400x300?text=Activiteit', 'Spelende kinderen', false
WHERE NOT EXISTS (SELECT 1 FROM artikels LIMIT 1);

-- Show the created tables
SHOW TABLES; 