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
        fetch('http://localhost:3307/activiteiten/all')
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
        <div className="list-container">
  {filteredEvents.length === 0 && (
    <div>Geen activiteiten gepland deze week.</div>
  )}
  {filteredEvents.map((event) => (
    <div className="list-item" key={event.id}>
      {/* Top row */}
      <div className="top-row">
        <div className="title">{event.Titel}</div>
        <div className="group">{event.Groep}</div>
        <div className="datum">
          {dayjs(event.Datum).format('D MMMM')}
        </div>
        <div className="uur">{event.Uur}u</div>
      </div>
      {/* Below the row */}
      <div className="description">{event.Beschrijving}</div>
    </div>
  ))}
</div>
    );
};

export default CalendarData;