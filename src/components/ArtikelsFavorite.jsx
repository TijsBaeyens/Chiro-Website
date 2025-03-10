import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/Artikels.css"; // Zorg ervoor dat je een CSS-bestand hebt voor styling

const FavoriteArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3307/artikels/favorite") // Pas endpoint aan indien nodig
      .then((response) => response.json())
      .then((data) => {
        const formattedArticles = data.map((item) => ({
          id: item.idArtikels,
          title: item.titel,
          text: item.tekst,
          date: new Date(item.datum).toLocaleDateString(), // Formatteer datum
          photoUrl: `/images/${item.locatieFoto.split("\\").pop()}`, // Foto-URL genereren
        }));

        setArticles(formattedArticles);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="article-container">
      {articles.map((article) => (
        <NavLink key={article.id} to={`/Artikel/${article.id}`} className="article-card">
          <h1 className="article-title">{article.title}</h1>
          <p className="article-date">{article.date}</p>
          <img src={article.photoUrl} alt="Article Preview" className="article-preview" />
          <p className="article-text">{article.text}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default FavoriteArticles;
