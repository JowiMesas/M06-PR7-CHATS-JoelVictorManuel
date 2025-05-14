import { useState } from 'react';
import Chat from "../components/Chat";
import { useAuth } from "../contexts/AuthContext";
import DocumentEditor from "../components/DocumentEditor";
import DocumentList from "../components/DocumentList";
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { Document } from "../types/Document";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Workspace</h1>
            {user && (
              <div className="bg-blue-700 text-sm px-3 py-1 rounded-full">
                {user.email || user.username || `Usuario ${user.id}`}
              </div>
            )}
          </div>
          <button 
            onClick={logout} 
            className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* Left sidebar - Documents list */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col h-full overflow-hidden">
            <DocumentList onSelect={setSelectedDoc} />
          </div>

          {/* Center - Document editor */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7 flex flex-col h-full overflow-hidden">
            {selectedDoc ? (
              <DocumentEditor doc={selectedDoc} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col items-center justify-center text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-500">Selecciona un documento</h3>
                <p className="text-gray-400 mt-2 max-w-xs">
                  Elige un documento de la lista o crea uno nuevo para comenzar a editar
                </p>
              </div>
            )}
          </div>

          {/* Right sidebar - Chat */}
          <div className="col-span-12 lg:col-span-3 h-full overflow-hidden hidden lg:block">
            <Chat />
        <FileUpload onUploaded={() => {/* refresca lista abajo */}} />
      <FileList />
          </div>
        </div>
      </main>

      {/* Float chat for mobile */}
      <div className="lg:hidden">
        <Chat />
      </div>
    </div>
  );
}