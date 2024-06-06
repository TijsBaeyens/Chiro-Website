import React, { useState, useEffect } from 'react';
import '../css/Artikels.css';
import { NavLink } from 'react-router-dom';

const ArtikelsFavorite = () => {
    const [articles, setArticles] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3307/artikels/favorite')
            .then(response => response.json())
            .then(data => data.map((article) => {
                const uint8Array = new Uint8Array(article.Foto.data);
                const blob = new Blob([uint8Array]);
                const url = URL.createObjectURL(blob);
                return { ...article, Foto: url };
            }))
            .then(articlesWithUrls => setArticles(articlesWithUrls));
    }, []);

    if (articles === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className='artikels'>
    {articles.map((item, index) => (
        <NavLink to={`/Artikel/${item.ID}`}className="article-card" key={index}>
            <h2>{item.Titel}</h2>
            <p>{item.Datum}</p>
            <img src={item.Foto} alt={item.Titel} />
            <p>{item.Tekst.length > 200 ? item.Tekst.substring(0, 197) + '...' : item.Tekst}</p>
        </NavLink>
    ))}
</div>
    );
};

export default ArtikelsFavorite;