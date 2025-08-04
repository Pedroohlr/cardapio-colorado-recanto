import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem("cardapio_authenticated");
    const authTimestamp = localStorage.getItem("cardapio_auth_timestamp");
    
    if (authStatus === "true" && authTimestamp) {
      const loginTime = parseInt(authTimestamp);
      const currentTime = Date.now();
      const twoMinutesInMs = 2 * 60 * 1000; // 2 minutos em milissegundos
      
      // Verifica se ainda não passou 2 minutos
      if (currentTime - loginTime < twoMinutesInMs) {
        setIsAuthenticated(true);
      } else {
        // Sessão expirada, limpa o localStorage
        localStorage.removeItem("cardapio_authenticated");
        localStorage.removeItem("cardapio_auth_timestamp");
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const login = () => {
    const currentTime = Date.now();
    localStorage.setItem("cardapio_authenticated", "true");
    localStorage.setItem("cardapio_auth_timestamp", currentTime.toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("cardapio_authenticated");
    localStorage.removeItem("cardapio_auth_timestamp");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
  };
} 