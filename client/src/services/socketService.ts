let socket: WebSocket | null = null;
 
export const initSocket = (
  onMessage: (msg: string) => void,
  onOpen?: () => void
) => {
  socket = new WebSocket("ws://localhost:4000");
 
  socket.onopen = () => {
    console.log("WebSocket conectado");
    onOpen?.();
  };
 
  socket.onmessage = (event) => {
    onMessage(event.data);
  };
 
  socket.onclose = () => {
    console.log("WebSocket cerrado");
  };
};
 
export const sendThroughSocket = (msg: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(msg);
  }
};
 
export const closeSocket = () => {
  socket?.close();
};