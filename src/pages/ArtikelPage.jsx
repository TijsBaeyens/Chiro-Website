import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ArtikelPage.css';

const ArtikelPage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3307/Artikels/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0]) {
                    // Format the date to be more readable
                    const formattedDate = new Date(data[0].datum).toLocaleDateString('nl-BE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    setArticle({
                        ...data[0],
                        datum: formattedDate
                    });
                }
            })
            .catch(error => console.log(error));
    }, [id]);

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="article-container">
            <h1 className="article-title">{article.titel}</h1>
            {article.fotoID && (
                <>
                    <img 
                        className="article-image" 
                        src={`/images/${article.locatieFoto.split("\\").pop()}`} 
                        alt={article.titel} 
                    />
                    <div className="article-caption">
                        {article.bijschrift}
                    </div>
                </>
            )}
            <p className="article-date">{article.datum}</p>
            <p className="article-text">{article.tekst}</p>
        </div>
    );
};

export default ArtikelPage;