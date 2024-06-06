import { React, useState, useEffect} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useParams } from 'react-router-dom';

export default function Fotoboek() {
    const { id } = useParams();
    const [photos, setPhotos] = useState([]);
    const [albumName, setAlbumName] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3307/fotos/${id}`)
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
              const albumName = photosWithUrls[0].album_name || '';
              setPhotos(photosWithUrls.map((photo) => ({ ...photo, id: photo._id })));
              setAlbumName(albumName);
            }
          })
          .catch(error => console.error('Fetch error:', error));
      }, []);

      const [showModal, setShowModal] = useState(false);
      const [url, setUrl] = useState('');

      const handleClick = (url) => {
          setUrl(url);
          setShowModal(true);
      };
  
      const handleCloseModal = () => {
          setUrl('');
          setShowModal(false);
      };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>{albumName}</h1>
            <ImageList sx={{ width: 2000, height: 800 }} cols={5} rowHeight={400}>
                {photos.map((photo) => (
                    <ImageListItem key={photo.id} style={{ margin: '10px' }}>
                        <img
                            src={photo.url}
                            alt={photo.title}
                            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                            onClick={() => handleClick(photo.url)}
                        />
                        <ImageListItemBar title={photo.title} />
                    </ImageListItem>
                ))}
            </ImageList>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <img src={url} alt="Modal" />
                    </div>
                </div>
            )}
        </div>
    );
}