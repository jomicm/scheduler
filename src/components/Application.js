import React, { useState, useEffect } from "react";
import axios from 'axios';
import DayList from './DayList';
import "components/Application.scss";
import Appointment from './Appointment';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: '2pm',
//     interview: {
//       student: "Joe Doe",
//       interviewer: {
//         id: 3,
//         name: "Norman Robinson",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: '3pm',
//   },
//   {
//     id: 5,
//     time: '5pm',
//     interview: {
//       student: "Jane Deffao",
//       interviewer: {
//         id: 2,
//         name: "Lin Remstein",
//         avatar: "https://i.imgur.com/twYrpay.jpg",
//       }
//     }
//   }
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointmentsPromise = axios.get('/api/appointments');
    const interviewersPromise = axios.get('/api/interviewers');
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise])
      .then(all => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
      });
  }, []);
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const interviewPut = {student: interview.student, interviewer: interview.interviewer.id}
    return axios.put(`/api/appointments/${id}`, {interview: interviewPut})
      .then(res => setState({ ...state, appointments }))
  };
  const deleteInterview = (id) => {
    console.log('Deleting interview:', id);
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        setState({ ...state, appointments });
        return true;
      })
  };
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={(newDay) => setState(prev => ({ ...prev, day: newDay})) }/>
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map((a) => {
          const interview = getInterview(state, a.interview);
          return (
            <Appointment
              bookInterview={bookInterview}
              deleteInterview={deleteInterview}
              key={a.id}
              id={a.id} 
              time={a.time} 
              interview={interview}
              interviewers={interviewers}
            />)}
          )
        } 
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
