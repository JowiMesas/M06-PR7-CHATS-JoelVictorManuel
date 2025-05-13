import  { useEffect, useState } from 'react';
import { initSocket, syncDocument, autosaveDocument, closeSocket } from '../services/socketService';
import { docService } from "../services/documentService";
import { Document } from "../types/Document";

export default function DocumentEditor() {
  const [doc, setDoc] = useState<Document|null>(null);
  const [text, setText] = useState('');
  const docId = 'd1';

  useEffect(() => {
    docService.open(docId).then(d => {
      setDoc(d);
      setText(d.contenido);
      initSocket(msg => {
        if (msg.type === 'sync') {
          setText(msg.contenido);
        }
      });
    });
    return () => closeSocket();
  }, []);

  useEffect(() => {
    syncDocument(docId, text);
    const iv = setInterval(() => autosaveDocument(docId, text), 5000);
    return () => clearInterval(iv);
  }, [text]);

  if (!doc) return <div>Cargando…</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">{doc.titulo}</h2>
      <textarea
        className="w-full h-64 border rounded p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => docService.save(doc.id, text)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Guardar
        </button>
        <button
          onClick={() => docService.export("txt", doc.id)}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Exportar TXT
        </button>
        <button
          onClick={() => docService.export("pdf", doc.id)}
          className="px-3 py-1 bg-purple-500 text-white rounded"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
}
