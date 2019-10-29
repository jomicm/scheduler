import { useEffect, useReducer } from 'react';
import axios from 'axios';

const actions = {
  set_day: 'set_day',
  set_application_data: 'set_application_data',
  set_interview: 'set_interview'
}

const useApplicationData = (initial) => {
  const reducers = {
    set_day(_state, _action) {
      return { ..._state, day: _action.value }
    },
    set_application_data(_state, _action) {
      return { ..._state, days: _action.value[0].data, appointments: _action.value[1].data, interviewers: _action.value[2].data}
    },
    set_interview(_state, _action) {
      return { ..._state, appointments: _action.value }
    }
  };
  const reducer = (state, action) => {
    return reducers[action.type](state, action) || state;
  };
  const [state, dispatch] = useReducer(reducer, {
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
        dispatch({type: actions.set_application_data, value: all})
      });
  }, []);
  return {
    state,
    setDay: (newDay) => dispatch({type: actions.set_day, value: newDay}),
    bookInterview: (id, interview) => {
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
        .then(res => dispatch({ type: actions.set_interview, value: appointments }));
    },
    deleteInterview: (id) => {
      const appointment = {
        ...state.appointments[id],
        interview: null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      return axios.delete(`/api/appointments/${id}`)
        .then(res => dispatch({ type: actions.set_interview, value: appointments }));
    }
  }
}
export { useApplicationData };