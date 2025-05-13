let socket: WebSocket | null = null;

// msgHandler recibirá ya el objeto { type, ... }
export const initSocket = (msgHandler: (msg: any) => void) => {
  socket = new WebSocket('ws://localhost:4000');
  socket.onopen = () => console.log('WS open');
  socket.onmessage = async e => {
    const data = typeof e.data === 'string'
      ? e.data
      : await (e.data as Blob).text();
    msgHandler(JSON.parse(data));
  };
  socket.onclose = () => console.log('WS closed');
};

// Para chat
export const sendThroughSocket = (emisorId: string, contenido: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'chat', emisorId, contenido }));
  }
};

// Para documento
export const syncDocument = (docId: string, contenido: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'sync', docId, contenido }));
  }
};
export const autosaveDocument = (docId: string, contenido: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'autosave', docId, contenido }));
  }
};

export const closeSocket = () => socket?.close();
