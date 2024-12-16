import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Make the fetch request to your backend
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is OK (status code 200-299)
      if (response.ok) {
        const data = await response.json(); // Parse the response body
        alert(data.message); // Show success message
        navigate('/login'); // Redirect to the login page after successful signup
      } else {
        // If response is not OK, throw an error to catch it below
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      // Log the error for debugging and show a user-friendly alert
      console.error('Signup error:', error);
      alert('An error occurred while signing up. Please try again.');
    } finally {
      setLoading(false); // Reset loading state after the request is completed
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
