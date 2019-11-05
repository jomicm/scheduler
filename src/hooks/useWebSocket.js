import { useEffect, useRef } from "react";
// Hook definition to create transitions in Appointment Component
const useWebSocket = (url, onMessageHandler) => {
  // Declare socket using Ref
  const socket = useRef();
  const savedMessageHandler = useRef();
  // Assign incoming messages to onMessageHandler function
  useEffect(() => {
    savedMessageHandler.current = onMessageHandler;
    return () => {};
  }, [onMessageHandler]);
  // Manage sockets creations any time URL changes
  useEffect(() => {
    socket.current = new WebSocket(url);
    const onMessageListener = e => {
      savedMessageHandler.current(e);
    };
    socket.current.onmessage = onMessageListener;
    socket.current.onopen = () => console.log("Connected to ", url);
    socket.current.onclose = () => console.log("Closed");
    return () => {
      socket.current.close();
    };
  }, [url]);
  // Send message to server from client
  const send = message => {
    socket.current.send(message);
  };
  return { send };
};

export default useWebSocket;
