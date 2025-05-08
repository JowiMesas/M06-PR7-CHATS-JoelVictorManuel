import { useEffect, useState, useRef } from "react";
import {
  initSocket,
  sendThroughSocket,
  closeSocket,
} from "../services/socketService";
import { useAuth } from "../contexts/AuthContext";
import { Mensaje } from "../types/Chat";

export default function Chat() {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Mensaje[]>([]);
  const [text, setText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cargar historial inicial
    fetch("http://localhost:4000/api/chat/view_hist")
      .then((res) => res.json())
      .then((data: Mensaje[]) => setMsgs(data));

    // Iniciar WebSocket y manejar mensajes sin duplicados
    initSocket(async (dataStr: string) => {
      try {
        const msg: Mensaje = JSON.parse(dataStr);
        setMsgs((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
        );
      } catch (err) {
        console.error("WS parse error", err);
      }
    });

    return () => {
      closeSocket();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll al final cuando cambian los mensajes
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [msgs]);

  const send = () => {
    if (!user || !text.trim()) return;
    const msg = { emisorId: user.id.toString(), contenido: text };
    // Solo WebSocket: el servidor persiste y reenvía
    sendThroughSocket(JSON.stringify(msg));
    setText("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Cabecera del chat */}
      <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
        <h3 className="font-medium text-sm">Chat en vivo</h3>
      </div>

      {/* Mensajes */}
      <div ref={containerRef} className="h-64 overflow-auto p-3 bg-gray-50">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${
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
              <div className="text-xs opacity-80 mb-1">
                {m.emisorId === user?.id.toString()
                  ? "Tú"
                  : m.username || m.emisorId}
              </div>
              <div>{m.contenido}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input y botón de enviar */}
      <div className="border-t border-gray-200 p-2 flex space-x-2 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
