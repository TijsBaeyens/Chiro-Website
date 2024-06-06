import React from 'react';
import { NavLink } from 'react-router-dom';

const Card = ({ image, title, text, link }) => {
    return (
        <NavLink to={"/inschrijvingen/1"} className="card">
            <img src={image} alt={title} />
            <h2>{title}</h2>
            <p>{text}</p>
        </NavLink>
    );
};

export default Card;