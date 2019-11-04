import React from "react";
import DayList from './DayList';
import "components/Application.scss";
import Appointment from './Appointment';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";
import { useApplicationData } from '../hooks/useApplicationData';

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    deleteInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);

  const appointments = getAppointmentsForDay(state, state.day).map(a => {
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
      />)});

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
          {/* <DayList days={state.days} day={state.day} setDay={(newDay) => setState(prev => ({ ...prev, day: newDay})) }/> */}
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        { appointments }
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
