import React, { useEffect } from 'react';
import WeekContext from '../api/WeekContext';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import "../css/CalendarData.css";
import 'dayjs/locale/nl';

dayjs.extend(isBetween);
dayjs.locale('nl');

const CalendarData = () => {
    const { weekValue } = React.useContext(WeekContext);
    const [events, setEvents] = React.useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3307/evenementen/all')
            .then(response => response.json())
            .then(data => setEvents(data));
    }, []);
    
    const filteredEvents = events.filter((event) => {
        const eventDate = dayjs(event.Datum);
        const startOfWeek = weekValue.startOf('week');
        const endOfWeek = weekValue.endOf('week');
        return eventDate.isBetween(startOfWeek, endOfWeek, null, '[]');
    });

    return (
        <div className='list-container'>
            {filteredEvents.length === 0 && <div>Geen activiteiten gepland deze week.</div>}
            {filteredEvents.map((event) => (
                <div className='list-item'>
                <div className='title' key={event.id}>{event.Titel}</div>
                <div className='group' key={event.id}>{event.Groep}</div>
                <div className='datum' key={event.id}>{dayjs(event.Datum).format('D MMMM')}</div>
                <div className='uur' key={event.id}>{event.Uur}</div>
                <div className='description' key={event.id}>{event.Omschrijving}</div>
                </div>
            ))}
        </div>
    );
};

export default CalendarData;