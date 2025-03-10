import React from 'react';
import Calendar from '../components/Calendar';
import '../css/Home.css';
import WeekContext from "../api/WeekContext"
import dayjs from 'dayjs';
import CalendarData from '../components/CalendarData';
import PhotoBookFavorite from '../components/PhotoBookFavorite';
import ArtikelsFavorite from '../components/ArtikelsFavorite';

function Home() {
    const [weekValue, setWeekValue] = React.useState(dayjs('2025-03-01'));

  return (
    <div className="home">
        <div className='row'>
        <div className="calendar-and-list">
        <WeekContext.Provider value={{ weekValue, setWeekValue }}>
        <div className="calendar-container">
        <CalendarData key={weekValue}/>
        </div>
          <div className="list-container">
            <Calendar/>
          </div>
        </WeekContext.Provider>
        </div>
        </div>
        <div className='row'>
            <PhotoBookFavorite/>
        </div>
        <div className="row">
          <ArtikelsFavorite />
        </div>

    </div>
  );
}

export default Home;