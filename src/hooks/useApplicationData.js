import { useEffect, useReducer, useCallback } from 'react';
import axios from 'axios';
import useWebSocket from '../hooks/useWebSocket';
const URL = process.env.REACT_APP_WEBSOCKET_URL;

const actions = {
  set_day: 'set_day',
  set_application_data: 'set_application_data',
  set_interview: 'set_interview',
  set_days: 'set_days'
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
    },
    set_days(_state, _action) {
      return { ..._state, days: _action.value }
    }
  };
  const reducer = (state, action) => {
    return reducers[action.type](state, action) || state;
  };
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
    socketMsg: ''
  });


  //const [messages, setMessages] = useState([]);
  // const onMessageHandler = useCallback( e => {
  //   const res = JSON.parse(e.data);
  //   console.log(res);
  //   console.log('Call mod app from websocket')
  //   modifyAppointments(res.id, res.interview, true);
  //   setMessages(m => [...m, res]);
  // }, [messages]);
  const onMessageHandler = e => {
    const res = JSON.parse(e.data);
    console.log(res);
    console.log('Call mod app from websocket')
    if (!myself) {
      modifyAppointments(res.id, res.interview, true);
      myself = false;
    }
    //setMessages(m => [...m, res]);
  };
  useWebSocket(URL, onMessageHandler);
  
  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const appointmentsPromise = axios.get('/api/appointments');
    const interviewersPromise = axios.get('/api/interviewers');
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise])
      .then(all => {
        dispatch({type: actions.set_application_data, value: all})
      });
  }, []);
  const getDayWithAppointment = id => state.days.map(d => d.appointments.includes(id) ? d.id : null).filter(f => f)[0];
  // const updateDaysSlots = (appointmentId, sign = -1) => {
  //   const dayId = getDayWithAppointment(appointmentId);
  //   const localDays = state.days.slice();
  //   const localDay = localDays.filter(d => d.id === dayId)[0];
  //   localDay.spots += 1 * sign;
  //   dispatch({ type: actions.set_days, value: localDays });
  // };
  const updateDaysSlots = (appointmentId, sign = -1) => {
    const dayId = getDayWithAppointment(appointmentId);
    const localDays = state.days.slice();
    const localDay = localDays.filter(d => d.id === dayId)[0];
    const localDayAppointments = localDay.appointments;
    const stateAppointments = localDayAppointments.map(la => state.appointments[la].interview);
    const availableSpots = stateAppointments.filter(a => !a).length;
    localDay.spots = availableSpots + sign;
    dispatch({ type: actions.set_days, value: localDays });
  };
  const modifyAppointments = (id, interview = null, selfUpdate = false) => {
    const appointment = {
      ...state.appointments[id],
      interview: !interview ? null : { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    if (selfUpdate) {
      dispatch({ type: actions.set_interview, value: appointments });
      updateDaysSlots(id, !interview ? 1 : -1);
    }
    return appointments;
  };
  let myself = false;
  return {
    state,
    setDay: (newDay) => dispatch({type: actions.set_day, value: newDay}),
    bookInterview: (id, interview) => {
      const appointments = modifyAppointments(id, interview);
      const interviewPut = {student: interview.student, interviewer: interview.interviewer.id}
      return axios.put(`/api/appointments/${id}`, {interview: interviewPut})
        .then(res => {
          dispatch({ type: actions.set_interview, value: appointments });
          updateDaysSlots(id);
        });
    },
    deleteInterview: (id) => {
      const appointments = modifyAppointments(id);
      return axios.delete(`/api/appointments/${id}`)
        .then(res => {
          dispatch({ type: actions.set_interview, value: appointments });
          updateDaysSlots(id, 1);
        });
    }
  }
}
export { useApplicationData };