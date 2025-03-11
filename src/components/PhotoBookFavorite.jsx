import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/PhotoBook.css"; // Ensure CSS file is imported

const PhotoBookFavorite = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3307/fotos/favorite")
      .then((response) => response.json())
      .then((data) => {
        // Group photos by albumID
        const albumMap = new Map();

        data.forEach((item) => {
          const photoUrl = `/images/${item.locatieFoto.split("\\").pop()}`;
          if (!albumMap.has(item.albumID)) {
            albumMap.set(item.albumID, {
              albumID: item.albumID,
              name: item.name,
              photos: [photoUrl],
              currentPhotoIndex: 0,
            });
          } else {
            albumMap.get(item.albumID).photos.push(photoUrl);
          }
        });

        // Convert map to an array and set state
        setAlbums(Array.from(albumMap.values()));
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="album-container">
      {albums.map((album) => (
        <NavLink key={album.albumID} to={`/Fotoboek/${album.albumID}`} className="card">
          <h1 className="card-title">{album.name}</h1>
          <img
            src={album.photos[album.currentPhotoIndex]}
            alt="Album Preview"
            className="card-preview"
          />
        </NavLink>
      ))}
    </div>
  );
};

export default PhotoBookFavorite;
