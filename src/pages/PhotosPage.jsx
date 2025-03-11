import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/PhotoBook.css"; // Using the same CSS as for PhotoBookFavorite

const PhotoBookAll = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3307/fotos")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Group photos by albumId
        const albumMap = new Map();

        data.forEach((item) => {
          // Replace backslashes with forward slashes for the image URL
          const photoUrl = item.locatieFoto.replace(/\\/g, "/");
          console.log(photoUrl);
          console.log(item);
          if (!albumMap.has(item.albumId)) {
            albumMap.set(item.albumId, {
              albumId: item.albumId,
              album_name: item.album_name,
              photos: [photoUrl],
            });
          } else {
            albumMap.get(item.albumId).photos.push(photoUrl);
          }
        });

        // Convert the Map to an array and update state
        setAlbums(Array.from(albumMap.values()));
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="album-container">
      {albums.map((album) => (
        <NavLink key={album.albumId} to={`/Fotoboek/${album.albumId}`} className="card">
          <h1 className="card-title">{album.album_name}</h1>
          {/* Display the first photo as the preview */}
          {album.photos.length > 0 && (
            <img src={album.photos[0]} alt="Album Preview" className="card-preview" />
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default PhotoBookAll;
