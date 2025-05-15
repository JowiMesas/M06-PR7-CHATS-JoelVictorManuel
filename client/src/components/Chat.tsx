import { useEffect, useState, useRef } from "react";
import {
  initSocket,
  sendThroughSocket,
  closeSocket,
} from "../services/socketService";
import { useAuth } from "../contexts/AuthContext";
import { Mensaje } from "../types/Chat";
import { chatService } from "../services/chatService";

export default function Chat() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Mensaje[]>([]);
  const [text, setText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar historial inicial
    chatService.getHistory().then(setMsgs);

    // Iniciar WebSocket y manejar mensajes sin duplicados
    initSocket((msg) => {
      if (msg.type !== "chat") return;
      setMsgs((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    });

    return () => closeSocket();
  }, []);

  useEffect(() => {
    // Auto-scroll al final cuando cambian los mensajes
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    sendThroughSocket(user!.id.toString(), text);
    setText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Cabecera del chat */}
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">Chat en vivo</h3>
        <div className="flex items-center space-x-2">
          <div className="text-xs bg-blue-800 px-2 py-1 rounded-full">
            {msgs.length} mensajes
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="text-white hover:bg-blue-700 p-1 rounded"
          >
            {isCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Mensajes */}
          <div 
            ref={containerRef} 
            className="flex-1 overflow-auto p-3 bg-gray-50"
            style={{ minHeight: "150px" }}
          >
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`mb-3 flex ${
                  m.emisorId === user?.id.toString()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
                    m.emisorId === user?.id.toString()
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-medium">
                      {m.emisorId === user?.id.toString()
                        ? "Tú"
                        : m.username || `Usuario ${m.emisorId}`}
                    </span>
                    <span className="ml-2 opacity-75">
                      {new Date(m.timestamp).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="mt-1">{m.contenido}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de exportación */}
          <div className="bg-gray-50 border-t border-gray-200 p-2 flex justify-end space-x-3">
            <button
              onClick={() => chatService.exportChat("json")}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              JSON
            </button>
            <button
              onClick={() => chatService.exportChat("txt")}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              TXT
            </button>
          </div>

          {/* Input y botón de enviar */}
          <div className="p-2 flex space-x-2 bg-white">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Enviar
            </button>
          </div>
        </>
      )}
    </div>
  );
}