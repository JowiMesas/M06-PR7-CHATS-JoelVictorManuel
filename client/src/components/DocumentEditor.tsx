import { useEffect, useState } from 'react';
import { initSocket, syncDocument, autosaveDocument, closeSocket } from '../services/socketService';
import { docService } from "../services/documentService";
import { Document } from "../types/Document";

export default function DocumentEditor({ doc }: { doc: Document }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    docService.open(doc.id).then(d => setText(d.contenido));
    initSocket(msg => {
      if (msg.type === 'sync' && msg.docId === doc.id) setText(msg.contenido);
    });
    return () => closeSocket();
  }, [doc.id]);

  useEffect(() => {
    // Mostramos el indicador de guardado
    const showSaving = () => {
      setSaving(true);
      setTimeout(() => setSaving(false), 1000);
    };

    syncDocument(doc.id, text);
    const iv = setInterval(() => {
      autosaveDocument(doc.id, text);
      showSaving();
    }, 3000);
    return () => clearInterval(iv);
  }, [text, doc.id]);

  if (!doc) return <div className="p-10 text-center text-gray-500">Selecciona un documento para editar</div>;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">{doc.titulo}</h2>
        </div>
        <div className="text-xs">
          {saving ? (
            <span className="text-green-600 animate-pulse flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardando...
            </span>
          ) : (
            <span className="text-gray-400">Autoguardado</span>
          )}
        </div>
      </div>

      <textarea
        className="w-full flex-1 border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Comienza a escribir aquí..."
      />

      <div className="mt-3 flex space-x-2 justify-end">
        <button
          onClick={() => docService.export("txt", doc.id)}
          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          TXT
        </button>
        <button
          onClick={() => docService.export("pdf", doc.id)}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          PDF
        </button>
      </div>
    </div>
  );
}