import React, { useState } from 'react';
import '../css/LoginPage.css';
import { HARDCODED_EMAIL, HARDCODED_PASSWORD } from '../secret';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
        localStorage.setItem('authToken', 'fake-local-token');
        if (onLogin) onLogin();
        navigate('/dashboard');
      } else {
        setError('Ongeldige login. Probeer opnieuw.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <h1 className="login-title">Leiding Login</h1>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        <label htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Bezig...' : 'Inloggen'}</button>
        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginPage; 