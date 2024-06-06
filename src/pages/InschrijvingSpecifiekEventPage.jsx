import React, { useEffect, useState } from 'react';

const InschrijvingSpecifiekEventPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.example.com/event');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    const { id, title, text, questions, inputTypes, photo } = data;

    return (
        <div>
            <h1>{title}</h1>
            <img src={photo} alt="Event Photo" />
            <p>{text}</p>
            <form>
                {questions.map((question, index) => (
                    <div key={index}>
                        <label htmlFor={`question-${index}`}>{question}</label>
                        <input type={inputTypes[index]} id={`question-${index}`} />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default InschrijvingSpecifiekEventPage;