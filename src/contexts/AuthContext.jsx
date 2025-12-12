import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // функция для проверки, не истек ли токен
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // в секундах
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // если токен невалидный, считает истекшим
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext useEffect: storedToken exists?', !!storedToken); // лог
    if (storedToken && !isTokenExpired(storedToken)) {
      // Токен есть И не истек — авторизуем
      try {
        const decoded = jwtDecode(storedToken);
        console.log('Token valid, user role:', decoded.role); // Лог
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Token invalid, removing:', error);
        // Если токен битый, удаляем
        setToken(null);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      // если токен отсутствует ИЛИ истек — очищаем и не авторизуем
      console.log('No token or token expired, user not authenticated');
      setToken(null);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (username, password) => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
