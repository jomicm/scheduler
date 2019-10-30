import {useEffect, useRef} from 'react';

const useWebSocket = (url, onMessageHandler) => {
  const socket = useRef();
  const savedMessageHandler = useRef();
  useEffect(() => {
    savedMessageHandler.current = onMessageHandler;
    return () => {};
  }, [onMessageHandler]);

  useEffect(() => {
    socket.current = new WebSocket(url);
    const onMessageListener = (e) => {
      savedMessageHandler.current(e);
    }
    socket.current.onmessage = onMessageListener
    // socket.current.onconnect = () => console.log('connect')
    socket.current.onopen = () => console.log('Connected to ', url)
    socket.current.onclose = () => console.log('Closed');
    // socket.current.onmessage = (msg) => console.log('Received >', msg);
    return () => {
      socket.current.close()
    };
  }, [url])

  const send = message => {
    socket.current.send(message);
  }
  return {send};
};

export default useWebSocket;