import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/PhotoBook.css';

export default function PhotoBook() {
    const { id } = useParams();
    const [photos, setPhotos] = useState([]);
    const [albumName, setAlbumName] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3307/fotos/${id}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setAlbumName(data[0].album_name);
                    setPhotos(data);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    }, [id]);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const handleCloseModal = () => {
        setSelectedPhoto(null);
    };

    const handlePreviousPhoto = (e) => {
        e.stopPropagation();
        const currentIndex = photos.findIndex(photo => photo.idfotos === selectedPhoto.idfotos);
        const previousIndex = (currentIndex - 1 + photos.length) % photos.length;
        setSelectedPhoto(photos[previousIndex]);
    };

    const handleNextPhoto = (e) => {
        e.stopPropagation();
        const currentIndex = photos.findIndex(photo => photo.idfotos === selectedPhoto.idfotos);
        const nextIndex = (currentIndex + 1) % photos.length;
        setSelectedPhoto(photos[nextIndex]);
    };

    return (
        <div className="photo-book-container">
            <h1 className="album-title">{albumName}</h1>
            <div className="photo-grid">
                {photos.map((photo) => (
                    <div 
                        key={photo.idfotos} 
                        className="photo-item"
                        onClick={() => handlePhotoClick(photo)}
                    >
                        <img
                            src={`/images/${photo.locatieFoto.split("\\").pop()}`}
                            alt={`Photo ${photo.idfotos}`}
                            className="photo-image"
                        />
                    </div>
                ))}
            </div>
            {selectedPhoto && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <button className="nav-button prev-button" onClick={handlePreviousPhoto}>
                            &#10094;
                        </button>
                        <img
                            src={`/images/${selectedPhoto.locatieFoto.split("\\").pop()}`}
                            alt={`Photo ${selectedPhoto.idfotos}`}
                            className="modal-image"
                        />
                        <button className="nav-button next-button" onClick={handleNextPhoto}>
                            &#10095;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}