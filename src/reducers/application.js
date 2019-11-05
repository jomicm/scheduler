import actions from '../helpers/constants';
const reducers = {
  [actions.SET_DAY](_state, _action) {
    return { ..._state, day: _action.value }
  },
  [actions.SET_APPLICATION_DATA](_state, _action) {
    return { ..._state, days: _action.value[0].data, appointments: _action.value[1].data, interviewers: _action.value[2].data }
  },
  [actions.SET_INTERVIEW](_state, _action) {
    return { ..._state, appointments: _action.value }
  },
  [actions.SET_DAYS](_state, _action) {
    return { ..._state, days: _action.value }
  }
};

const reducer = (state, action) => {
  try {
    const newState = reducers[action.type](state, action);
    return newState;
  } catch {
    throw new Error('tried to reduce with unsupported action type');
  }
};

export { reducer };