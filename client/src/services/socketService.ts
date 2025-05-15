// Variable para mantener la conexión WebSocket
let socket: WebSocket | null = null;

/**
 * Inicializa la conexión WebSocket y configura los manejadores de eventos
 * @param msgHandler - Función que procesará los mensajes recibidos por el WebSocket
 */
export const initSocket = (msgHandler: (msg: any) => void) => {
  socket = new WebSocket('ws://localhost:4000');
  
  // Se ejecuta cuando la conexión se establece
  socket.onopen = () => console.log('WS open');
  
  // Se ejecuta cuando se recibe un mensaje
  socket.onmessage = async e => {
    // Procesa los datos recibidos (pueden ser string o Blob)
    const data = typeof e.data === 'string'
      ? e.data
      : await (e.data as Blob).text();
    
    // Convierte los datos a objeto JSON y los pasa al manejador
    msgHandler(JSON.parse(data));
  };
  
  // Se ejecuta cuando la conexión se cierra
  socket.onclose = () => console.log('WS closed');
};

/**
 * Envía un mensaje de chat a través del WebSocket
 * @param emisorId - ID del usuario que envía el mensaje
 * @param contenido - Contenido del mensaje a enviar
 */
export const sendThroughSocket = (emisorId: string, contenido: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'chat', emisorId, contenido }));
  }
};

/**
 * Crea un nuevo documento y notifica al servidor a través del WebSocket
 * @param titulo - Título del nuevo documento
 */
export const createDocument = (titulo: string) => {
  socket?.readyState === WebSocket.OPEN &&
    socket.send(JSON.stringify({ type: 'create-doc', titulo }));
};

/**
 * Sincroniza los cambios en un documento con el servidor
 * @param docId - ID del documento a sincronizar
 * @param contenido - Contenido actualizado del documento
 */
export const syncDocument = (docId: string, contenido: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'sync', docId, contenido }));
  }
};

/**
 * Guarda automáticamente un documento en el servidor
 * @param docId - ID del documento a guardar
 * @param contenido - Contenido actualizado del documento
 */
export const autosaveDocument = (docId: string, contenido: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'autosave', docId, contenido }));
  }
};

/**
 * Cierra la conexión WebSocket
 */
export const closeSocket = () => socket?.close();