import  { useEffect, useState } from 'react';
import { docService } from '../services/documentService';
import { createDocument, initSocket } from '../services/socketService';
import { Document } from '../types/Document';

export default function DocumentList({ onSelect }: { onSelect: (d: Document) => void }) {
  const [docs, setDocs] = useState<Document[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    docService.list().then(setDocs);
    initSocket(msg => {
      if (msg.type === 'doc-created') setDocs(prev => [...prev, msg.doc]);
    });
  }, []);

  const handleCreate = () => {
    if (!title.trim()) return;
    createDocument(title);
    setTitle('');
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Documentos</h3>
      <ul className="list-disc pl-5">
        {docs.map(d => (
          <li
            key={d.id}
            onClick={() => onSelect(d)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {d.titulo}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          className="border p-1 flex-1"
          placeholder="Título del documento"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-green-500 px-3 text-white rounded">
          Crear
        </button>
      </div>
    </div>
  );
}