let socket: WebSocket | null = null;

export const initSocket = (onMessage: (msg: string) => void) => {
  socket = new WebSocket("ws://localhost:4000");
  socket.onopen = () => console.log("WS open");
  socket.onmessage = async (event) => {
    let dataStr: string;
    if (typeof event.data === "string") {
      dataStr = event.data;
    } else {
      dataStr = await (event.data as Blob).text();
    }
    onMessage(dataStr);
  };
  socket.onclose = () => console.log("WS close");
};

export const sendThroughSocket = (msg: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(msg);
  }
};

export const closeSocket = () => {
  socket?.close();
};
