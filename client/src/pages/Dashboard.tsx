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
  const [showFileSection, setShowFileSection] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Workspace</h1>
            {user && (
              <div className="bg-blue-700 text-sm px-3 py-1 rounded-full">
                {user.username || `Usuario ${user.id}`}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Botones de toggle para móvil */}
            <div className="lg:hidden flex space-x-2">
              <button
                onClick={() => {setShowChatMobile(true); setShowFileSection(false);}}
                className={`bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded text-sm transition-colors flex items-center ${showChatMobile ? 'ring-2 ring-white' : ''}`}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Chat
              </button>
              <button
                onClick={() => {setShowFileSection(true); setShowChatMobile(false);}}
                className={`bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded text-sm transition-colors flex items-center ${showFileSection ? 'ring-2 ring-white' : ''}`}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
                Archivos
              </button>
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
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* Left sidebar - Documents list */}
          <div className={`${(showFileSection || showChatMobile) ? 'hidden' : 'col-span-12'} md:col-span-3 lg:col-span-2 md:block flex flex-col h-full overflow-hidden`}>
            <DocumentList onSelect={setSelectedDoc} />
          </div>

          {/* Center - Document editor */}
          <div className={`${(showFileSection || showChatMobile) ? 'hidden' : 'col-span-12'} md:col-span-9 lg:col-span-7 md:block flex flex-col h-full overflow-hidden`}>
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

          {/* Right sidebar - Chat and Files */}
          <div className={`${(!showFileSection && !showChatMobile) ? 'hidden lg:block' : 'col-span-12'} lg:col-span-3 h-full overflow-hidden`}>
            <div className="h-full flex flex-col">
              {/* Panel de pestañas para móvil */}
              <div className="lg:hidden flex border-b border-gray-200 mb-4">
                <button 
                  onClick={() => {setShowChatMobile(true); setShowFileSection(false);}}
                  className={`flex-1 py-2 text-center text-sm font-medium ${showChatMobile ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                  Chat
                </button>
                <button 
                  onClick={() => {setShowFileSection(true); setShowChatMobile(false);}}
                  className={`flex-1 py-2 text-center text-sm font-medium ${showFileSection ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                  Archivos
                </button>
              </div>
              
              {/* Contenedor flexible que adapta el tamaño */}
              <div className="flex flex-col h-full overflow-hidden">
                {/* Chat Section */}
                {(showChatMobile || !showFileSection) && (
                  <div className={`${showFileSection ? 'hidden' : 'flex-1'} lg:block h-full overflow-hidden mb-4 lg:mb-0`}>
                    <Chat />
                  </div>
                )}
                
                {/* Files Section */}
                {(showFileSection || (!showChatMobile && !showFileSection)) && (
                  <div className={`${showChatMobile ? 'hidden' : 'flex-none'} lg:mt-4 space-y-4 overflow-auto max-h-full lg:max-h-96`}>
                    <FileUpload onUploaded={() => {/* refresca lista abajo */}} />
                    <FileList />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botón flotante para volver */}
      {(showFileSection || showChatMobile) && (
        <button
          onClick={() => {setShowFileSection(false); setShowChatMobile(false);}}
          className="lg:hidden fixed bottom-4 left-4 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
    </div>
  );
}