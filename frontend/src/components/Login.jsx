import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const APP_NAME = import.meta.env.VITE_APP_NAME || 'Money Manager';

  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    const endpoint = isRegister ? '/register' : '/login';
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert('Registration successful! Please login.');
          setIsRegister(false);
          setPassword('');
        } else {
          onLogin(data);
        }
      } else {
        setError(data.detail || 'Something went wrong');
      }
    } catch (err) {
      setError('Could not connect to server');
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isRegister ? 'Create Account' : `${APP_NAME} Login`}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.inputGroup}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          {isRegister ? 'Register' : 'Login'}
        </button>
        <p style={styles.toggleText}>
          {isRegister ? 'Already have an account?' : 'Need an account?'}
          <span 
            onClick={() => { setIsRegister(!isRegister); setError(''); }} 
            style={styles.toggleLink}
          >
            {isRegister ? ' Login here' : ' Register here'}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  inputGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
    textAlign: 'center'
  },
  toggleText: {
    marginTop: '15px',
    fontSize: '14px',
    textAlign: 'center'
  },
  toggleLink: {
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Login;
