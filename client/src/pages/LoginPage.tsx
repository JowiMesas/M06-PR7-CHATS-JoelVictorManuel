import React from "react";
import Login from "../components/Login"; 
import { useAuth } from '../contexts/AuthContext';

import { User } from "../types/User";

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (user: User) => {
    login(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;