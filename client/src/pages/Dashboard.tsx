import { useState } from 'react';
import Chat from "../components/Chat";
import { useAuth } from "../contexts/AuthContext";
import DocumentEditor from "../components/DocumentEditor";
import DocumentList from "../components/DocumentList";
import { Document } from "../types/Document";
export default function Dashboard() {
  const { logout } = useAuth();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Cerrar sesión</button>
      </header>
      <main className="flex-1 overflow-auto p-4 space-y-6">
        <Chat />
        <DocumentList onSelect={setSelectedDoc} />
        {selectedDoc && <DocumentEditor doc={selectedDoc} />}
      </main>
    </div>
  );
}
