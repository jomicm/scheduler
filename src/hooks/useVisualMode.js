import { useState } from "react";

// Hook definition to create transitions in Appointment Component
const useVisualMode = (initial) => {
  // State hooks definition
  const [error, setError] = useState('')
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  return {
    // Error handling for empty student or empty interviewer
    error,
    cleanError: () => {
      setError('');
    },
    putError: (message) => {
      setError(message);
    },
    // Main state
    mode,
    // Create transition
    transition: (newMode, replace = false) => {
      setMode(newMode);
      const tmpHistory = history.slice();
      if (replace) tmpHistory.pop();
      setHistory([...tmpHistory, newMode]);
    },
    // Go back to previous transition
    back: () => {
      const tmpHistory = history.slice();
      if (tmpHistory.length > 1) tmpHistory.pop();
      setHistory(tmpHistory);
      setMode(tmpHistory.slice(-1)[0]);
    }
  }
};
export { useVisualMode };