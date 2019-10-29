const getAppointmentsForDay = (state, day) => {
  const result = [];
  if (!day) return result;
  const foundDay = state.days.filter(days => days.name === day);
  if (!foundDay.length) return result;
  foundDay[0].appointments.forEach(a => {
    if (state.appointments[a]) {
      result.push(state.appointments[a]);
    }
  });
  return result;
};

const getInterviewersForDay = (state, day) => {
  const result = [];
  if (!day) return result;
  const foundDay = state.days.filter(days => days.name === day);
  if (!foundDay.length) return result;
  foundDay[0].interviewers.forEach(a => {
    if (state.interviewers[a]) {
      result.push(state.interviewers[a]);
    }
  });
  return result;
};

const getInterview = (state, interview) => {
  if (interview === null) 
    return null;
  const interviewerId = typeof interview.interviewer === 'number' ? interview.interviewer : interview.interviewer.id;
  const found = state.interviewers[interviewerId];
  interview['interviewer'] = found;
  return interview;
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview };