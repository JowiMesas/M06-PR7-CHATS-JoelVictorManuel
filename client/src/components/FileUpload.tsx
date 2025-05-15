import { useState } from 'react';
import { fileService } from '../services/fileService';

export default function FileUpload({ onUploaded }: { onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      await fileService.upload(file);
      onUploaded();
      setFile(null); // Reset file after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-semibold text-gray-700 mb-3">Subir un nuevo archivo</h3>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
          <label 
            htmlFor="file-upload" 
            className="flex items-center justify-between w-full border border-gray-300 rounded px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="truncate max-w-xs">
              {file ? file.name : "Seleccionar archivo..."}
            </span>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </label>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!file || isUploading}
          className={`px-4 py-2 rounded-md text-white font-medium flex items-center justify-center min-w-24 ${
            !file ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Subir
            </>
          )}
        </button>
      </div>
      {file && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Archivo seleccionado:</span> {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}
    </div>
  );
}