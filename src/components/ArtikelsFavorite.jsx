import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/Artikels.css";

const FavoriteArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3307/artikels/favorite")
      .then((response) => response.json())
      .then((data) => {
        const formattedArticles = data.map((item) => ({
          id: item.artikelID,
          title: item.titel,
          text: item.bijschrift,
          date: new Date(item.datum).toLocaleDateString(),
          photoUrl: `/images/${item.locatieFoto.split("\\").pop()}`,
        }));

        setArticles(formattedArticles);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <div className="article-container">
      {articles.map((article) => (
        <NavLink key={article.artikelID} to={`/Artikel/${article.artikelID}`} className="article-card">
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
