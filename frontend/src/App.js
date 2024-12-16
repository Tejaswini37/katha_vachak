import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Frontpage from './Front';
import ReadBooks from './ReadBooks';
import Signup from './Signup';
import Login from './Login';

import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/ReadBooks" element={<ProtectedRoute element={<ReadBooks />} />} />
        <Route path="/Home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/Front" element={<Frontpage />} /> {/* Optional: Keep Frontpage route */}
      </Routes>
    </Router>
  );
};

export default App;
