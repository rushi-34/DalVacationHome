import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CheckAvailability from './pages/CheckAvailability';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check-availability" element={<CheckAvailability />} />
      </Routes>
    </Router>
  );
}

export default App;
