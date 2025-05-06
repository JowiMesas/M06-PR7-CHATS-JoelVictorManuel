import React from "react";
import Login from "../components/Login"; // Ajusta la ruta si es necesario
import { User } from "../types/user";

const LoginPage: React.FC = () => {
  const handleLogin = (user: User) => {
    console.log("Usuario logueado:", user);
    // Aquí puedes redirigir o guardar el usuario en un contexto, etc.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;