import { useEffect, useReducer } from "react";
import axios from "axios";
import useWebSocket from "../hooks/useWebSocket";
import actions from "../helpers/constants";
import { reducer } from "../reducers/application";
const URL = process.env.REACT_APP_WEBSOCKET_URL;

const useApplicationData = () => {
  // Define reducer
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    socketMsg: ""
  });
  // Websocket receiving messages function
  const onMessageHandler = e => {
    const res = JSON.parse(e.data);
    modifyAppointments(res.id, res.interview, true);
  };
  // Initialize websocket
  useWebSocket(URL, onMessageHandler);
  // useEffect to load data
  useEffect(() => {
    const daysPromise = axios.get("/api/days");
    const appointmentsPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise]).then(
      all => {
        dispatch({ type: actions.SET_APPLICATION_DATA, value: all });
      }
    );
  }, []);
  // Get a day from the appointment id
  const getDayWithAppointment = id =>
    state.days
      .map(d => (d.appointments.includes(id) ? d.id : null))
      .filter(f => f)[0];
  // Function to update slots remaining number
  const updateDaysSlots = (appointmentId, sign = -1, edit = false) => {
    if (edit) return;
    const dayId = getDayWithAppointment(appointmentId);
    const localDays = state.days.slice();
    const localDay = localDays.filter(d => d.id === dayId)[0];
    // const localDayAppointments = localDay.appointments;
    const stateAppointments = localDay.appointments.map(
      la => state.appointments[la].interview
    );
    const availableSpots = stateAppointments.filter(a => !a).length;
    localDay.spots = availableSpots + sign;
    dispatch({ type: actions.SET_DAYS, value: localDays });
  };
  // Modify local Appointments to re-render changes from Add, Edit, Delete and Websockets messages
  const modifyAppointments = (id, interview = null, selfUpdate = false) => {
    const isEdit = state.appointments[id].interview && interview ? true : false;
    const appointment = {
      ...state.appointments[id],
      interview: !interview ? null : { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    if (selfUpdate) {
      dispatch({ type: actions.SET_INTERVIEW, value: appointments });
      updateDaysSlots(id, !interview ? 1 : -1, isEdit)
    }
    return appointments;
  };
  // Return an object containing the state and methods
  return {
    // Main state
    state,
    // Update current day
    setDay: newDay => dispatch({ type: actions.SET_DAY, value: newDay }),
    // Create/edit a interview
    bookInterview: (id, interview, edit) => {
      const appointments = modifyAppointments(id, interview);
      const interviewPut = {
        student: interview.student,
        interviewer: interview.interviewer.id
      };
      return axios
      .put(`/api/appointments/${id}`, { interview: interviewPut })
      .then(async() => {
        await dispatch({ type: actions.SET_INTERVIEW, value: appointments });
          updateDaysSlots(id, -1, edit);
        });
    },
    // Delete new interview
    deleteInterview: id => {
      const appointments = modifyAppointments(id);
      return axios.delete(`/api/appointments/${id}`).then(async() => {
        await dispatch({ type: actions.SET_INTERVIEW, value: appointments });
        updateDaysSlots(id, 1);
      });
    }
  };
};
export { useApplicationData };
