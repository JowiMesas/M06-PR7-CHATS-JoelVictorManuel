import { useState } from 'react';
import { fileService } from '../services/fileService';

export default function FileUpload({ onUploaded }: { onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      await fileService.upload(file);
      onUploaded();
      setFile(null); // Limpiar después de subir exitosamente
    } catch (error) {
      console.error('Error al subir archivo:', error);
    } finally {
      setUploading(false);
    }
  };

  // Manejadores para drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Para mostrar el nombre del archivo de manera más amigable
  const formatFileName = (name: string) => {
    if (name.length > 25) {
      return name.substring(0, 12) + '...' + name.substring(name.length - 10);
    }
    return name;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Subir Archivo
      </h3>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          {file ? (
            <div className="text-sm font-medium text-gray-700 mb-2">
              Archivo seleccionado: 
              <span className="ml-1 text-blue-600">{formatFileName(file.name)}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-2">
              Arrastra un archivo aquí o haz clic para seleccionar
            </p>
          )}
          
          <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            <span>Seleccionar archivo</span>
            <input
              type="file"
              className="sr-only"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
            !file ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
            uploading ? 'bg-blue-400 text-white cursor-wait' : 
            'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Subir Archivo
            </>
          )}
        </button>
      </div>
    </div>
  );
}