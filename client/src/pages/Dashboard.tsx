import Chat from "../components/Chat";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-blue-600 text-white flex justify-between">
        <h1>Dashboard</h1>
        <button
          onClick={logout}
          className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <Chat />
        {/* Aquí podrías añadir sección de documentos colaborativos */}
      </main>
    </div>
  );
}
