import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './LoginPage.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to /applications'); // лог
      navigate('/applications'); // редирект на защищённую страницу, если уже авторизован
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/applications'); // перенаправление после успешного логина
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-page">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
