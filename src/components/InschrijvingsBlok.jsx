import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const InschrijvingsBlok = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3307/evenementen')
            .then(res => res.json())
            .then(data => setEvents(data));
    }, []);

    return (
        <div className="article-container">
            {events.map(event => (
                <NavLink
                    key={event.idevenementen}
                    to={`/inschrijvingen/${event.idevenementen}`}
                    className="article-card"
                >
                    <h1 className="article-title">{event.Titel || 'Evenement'}</h1>
                    <p className="article-date">{event.Datums}</p>
                    <p className="article-text">{event.Groep}</p>
                </NavLink>
            ))}
        </div>
    );
};

export default InschrijvingsBlok;