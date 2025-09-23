import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/InschrijvingSpecifiekEventPage.css';

const InschrijvingSpecifiekEventPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3307/evenementen/${id}`);
                const jsonData = await response.json();
                setData(Array.isArray(jsonData) ? jsonData[0] : jsonData);
                // Initialize answers array with empty strings
                let questions = [];
                if (jsonData.Vragen) {
                    try {
                        questions = JSON.parse(jsonData.Vragen);
                    } catch {
                        questions = [];
                    }
                }
                setAnswers(Array(questions.length).fill(''));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    if (!data) {
        return <div>Loading...</div>;
    }

    // Parse questions from API
    let questions = [];
    if (data.Vragen) {
        try {
            questions = JSON.parse(data.Vragen);
        } catch {
            questions = [];
        }
    }

    const handleChange = (index, value) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const payload = {
            idevenementen: data.idevenementen,
            antwoorden: answers
        };
        try {
            const response = await fetch('http://localhost:3307/inschrijvingen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                setSubmitted(true);
            } else {
                setError('Er is iets misgegaan bij het verzenden.');
            }
        } catch (err) {
            setError('Er is iets misgegaan bij het verzenden.');
        }
    };

    return (
        <div className="event-container">
            <h1 className="event-title">{data.Titel || 'Evenement'}</h1>
            <p className="event-date">{data.Datums}</p>
            <p className="event-description">{data.Text}</p>
            <form className="event-form" onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={index}>
                        <label htmlFor={`question-${index}`}>{question}</label>
                        <input
                            type="text"
                            id={`question-${index}`}
                            value={answers[index] || ''}
                            onChange={e => handleChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit">Verzenden</button>
                {submitted && <div className="success-message">Bedankt voor je inschrijving!</div>}
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default InschrijvingSpecifiekEventPage;