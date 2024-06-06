import React from 'react';
import Calendar from '../components/Calendar';
import '../css/Home.css';
import WeekContext from "../api/WeekContext"
import dayjs from 'dayjs';
import CalendarData from '../components/CalendarData';
import PhotoBookFavorite from '../components/PhotoBookFavorite';
import ArtikelsFavorite from '../components/ArtikelsFavorite';

function Home() {
    const [weekValue, setWeekValue] = React.useState(dayjs('2024-04-01'));

  return (
    <div className="home">
        <div className='row'>
        <WeekContext.Provider value={{ weekValue, setWeekValue }}>
        <CalendarData key={weekValue}/>
        <Calendar/>
        </WeekContext.Provider>
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