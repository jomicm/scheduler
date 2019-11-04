import { useState } from "react";

const useVisualMode = (initial) => {
  const [error, setError] = useState('')
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  return {
    error,
    cleanError: () => {
      setError('');
    },
    putError: (message) => {
      setError(message);
    },
    mode,
    transition: (newMode, replace = false) => {
      setMode(newMode);
      const tmpHistory = history.slice();
      if (replace) tmpHistory.pop();
      setHistory([...tmpHistory, newMode]);
    },
    back: () => {
      const tmpHistory = history.slice();
      if (tmpHistory.length > 1) tmpHistory.pop();
      setHistory(tmpHistory);
      setMode(tmpHistory.slice(-1)[0]);
    }
  }
};

export { useVisualMode };