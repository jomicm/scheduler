import React, { useState, useEffect } from "react";
import DayList from './DayList';
import "components/Application.scss";
import Appointment from './Appointment';
import axios from 'axios';

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: '2pm',
    interview: {
      student: "Joe Doe",
      interviewer: {
        id: 3,
        name: "Norman Robinson",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  },
  {
    id: 4,
    time: '3pm',
  },
  {
    id: 5,
    time: '5pm',
    interview: {
      student: "Jane Deffao",
      interviewer: {
        id: 2,
        name: "Lin Remstein",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  }
];

export default function Application(props) {
  const [day, setDay] = useState('Tuesday');
  const [days, setDays] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/days');
      console.log('result', result.data);
      setDays(result.data);
    };
    fetchData();
  }, []);

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Replace this with the sidebar elements during the "Environment Setup" activity. */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          {/* <DayList days={days} day={day} setDay={day => setDay(day)}/> */}
          <DayList days={days} day={day} setDay={setDay}/>
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
        {appointments.map((a, ix) => <Appointment key={'appointement_' + ix}  {...a} />)}
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
