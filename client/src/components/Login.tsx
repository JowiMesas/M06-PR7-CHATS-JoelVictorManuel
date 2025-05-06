import React, { useState, FormEvent } from "react";
import { authService } from "../services/authService";
import { User } from "../types/user";

interface Props {
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.login(username, email);
      onLogin(res.user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 w-96 bg-white rounded-2xl shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">Iniciar sesión</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Entrar
      </button>
    </form>
  );
};

export default Login;