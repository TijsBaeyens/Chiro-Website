import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/PhotoBook.css';

const PhotoBookFavorite = () => {
    const [photos, setPhotos] = useState([]);
    const [albumName, setAlbumName] = useState('');
    const [albumID, setAlbumID] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3307/fotos/favorite`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => data.map((photo) => {
            const uint8Array = new Uint8Array(photo.photo.data);
            const blob = new Blob([uint8Array]);
            const url = URL.createObjectURL(blob);
            return { ...photo, url };
          }))
          .then(photosWithUrls => {
            if (Array.isArray(photosWithUrls) && photosWithUrls.length > 0) {
              const albumID = photosWithUrls[0].albumID || '';
              setAlbumID(albumID);
              const albumName = photosWithUrls[0].album_name || '';
              setPhotos(photosWithUrls.map((photo) => ({ ...photo, id: photo._id })));
              setAlbumName(albumName);
            }
          })
          .catch(error => console.error('Fetch error:', error));
      }, []);
  
    return (
      <NavLink to={`/Fotoboek/${albumID}`} className="card">
        <h1 className='card-title'>{albumName}</h1>
        <p className='card-date'>Date: {new Date().toLocaleDateString()}</p>
        {photos.map((photo, index) => (
          <img key={index} src={photo.url} alt={photo.text} className="card-preview" />
        ))}
      </NavLink>
    );
  };

export default PhotoBookFavorite;