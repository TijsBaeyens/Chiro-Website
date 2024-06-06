import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/PhotoBookPage.css';

const Fotos = () => {
    const [albums, setAlbums] = useState([]); 

    useEffect(() => {
        fetch(`http://localhost:3307/fotos`)
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
                const albumsMap = new Map();
                photosWithUrls.forEach((photo) => {
                    const albumID = photo.albumID || '';
                    const albumName = photo.album_name || '';
                    if (!albumsMap.has(albumID)) {
                        albumsMap.set(albumID, { albumID, album_name: albumName, photos: [] });
                    }
                    albumsMap.get(albumID).photos.push({ ...photo, id: photo._id });
                });
                const albumsArray = Array.from(albumsMap.values());
                setAlbums(albumsArray);
            }
            }
          )
          .catch(error => console.error('Fetch error:', error));
      }, []);
  
    return (
        <div className="photo-book">
            {albums.map((album) => (
            
      <NavLink to={`/Fotoboek/${album.albumID}`} className="card">
        <div className="card-header">
        <h1 className='card-title'>{album.album_name}</h1>
        <p className='card-date'>{new Date().toLocaleDateString()}</p>
        </div>
        {album.photos.map((photo, index) => (
          <img key={index} src={photo.url} alt={photo.text} className="card-preview" />
        ))}
      </NavLink>
      ))}
        </div>
    );
  };

export default Fotos;