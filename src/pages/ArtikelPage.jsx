import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ArtikelPage.css';

const ArtikelPage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3307/artikels/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0] && data[0].Foto) {
                    const uint8Array = new Uint8Array(data[0].Foto.data);
                    const blob = new Blob([uint8Array]);
                    const url = URL.createObjectURL(blob);
                    setArticle({ ...data[0], Foto: url });
                } else {
                    setArticle(data[0]);
                }
            })
            .catch(error => console.log(error));
    }, []);

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="article-container">
            <h1 className="article-title">{article.Titel}</h1><img className="article-image" src={article.Foto} alt="Article" />
            <p className="article-date">{article.Datum}</p>
            <p className="article-text">{article.Tekst}</p>
            
        </div>
    );
};

export default ArtikelPage;