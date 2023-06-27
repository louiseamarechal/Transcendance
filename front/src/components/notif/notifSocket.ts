import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000")

const notifSocket = () => {

  useEffect(() => {
    socket.connect();
    if (socket.connected) {
      console.log('socket connected !');
    }
  })
  // disconnectSocket(){}

  // disposeSocket(){}
  return ();
}

export default notifSocket;

