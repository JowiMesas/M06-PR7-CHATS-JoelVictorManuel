import { useEffect, useState } from "react";
import { docService } from "../services/documentService";
import { createDocument, initSocket } from "../services/socketService";
import { Document } from "../types/Document";

export default function DocumentList({
  onSelect,
}: {
  onSelect: (d: Document) => void;
}) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Función para cargar la lista de documentos
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const documentList = await docService.list();
      setDocs(documentList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargamos la lista inicial de documentos
    loadDocuments();

    // Inicializamos el socket y escuchamos todos los tipos de mensajes relacionados con documentos
    initSocket((msg) => {
      console.log("Socket message received:", msg);

      // Cuando se crea un documento nuevo
      if (msg.type === "doc-created" || msg.type === "create-doc-response") {
        const newDoc = msg.doc || msg.document;
        if (newDoc && newDoc.id) {
          setDocs((prev) => {
            // Verificamos si el documento ya existe en la lista para evitar duplicados
            const exists = prev.some((doc) => doc.id === newDoc.id);
            if (exists) return prev;
            return [...prev, newDoc];
          });
        } else {
          // Si la respuesta no contiene el documento completo, recargamos la lista
          loadDocuments();
        }
      }
    });

    // Limpieza al desmontar el componente
    return () => {
      // El socket se cierra en otro lugar, no necesitamos cerrarlo aquí
    };
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return;

    // Creamos el documento a través del socket
    createDocument(title);
    setTitle("");
    setTimeout(loadDocuments, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Documentos</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {docs.length} docs
          </span>
          <button
            onClick={loadDocuments}
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center"
            title="Refrescar lista"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : docs.length > 0 ? (
        <ul className="divide-y divide-gray-100 flex-1 overflow-y-auto">
          {docs.map((d) => (
            <li
              key={d.id}
              onClick={() => onSelect(d)}
              className="py-2 flex items-center cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors group"
            >
              <svg
                className="w-5 h-5 text-gray-400 mr-2 group-hover:text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-gray-700 group-hover:text-blue-600">
                {d.titulo}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-6 text-gray-500 text-sm">
            No hay documentos disponibles
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Título del documento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white rounded-md text-sm transition-colors flex items-center"
            disabled={!title.trim()}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}