import  { useEffect, useState } from 'react';
import { fileService } from '../services/fileService';

export default function FileList() {
  const [files, setFiles] = useState<string[]>([]);

  const load = () => fileService.list().then(setFiles);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">Archivos de la Sala</h3>
      <ul className="list-disc pl-5">
        {files.map(f => (
          <li key={f} className="flex justify-between items-center">
            <span>{f}</span>
            <button
              onClick={() => fileService.download(f)}
              className="text-blue-600 hover:underline"
            >
              Descargar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}