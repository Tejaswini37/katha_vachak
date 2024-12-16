import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);

        // Store JWT token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect to front
        navigate('/front');
      } else {
        setMessage(data.message); // Display error message
      }
    } catch (err) {
      console.error('Error during login:', err);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h1 className="heading">Katha Vaachak</h1> {/* Styled Heading Outside Container */}
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
