import React from "react";
import Login from "../components/Login"; // Ajusta la ruta si es necesario
import { User } from "../types/User";

const LoginPage: React.FC = () => {
  const handleLogin = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Usuario logueado:", user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;