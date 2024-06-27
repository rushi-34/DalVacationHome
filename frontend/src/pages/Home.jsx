import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-6">Dalhousie University</h1>
      <button 
        onClick={() => navigate('/check-availability')} 
        className="px-4 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-700"
      >
        Check Availability
      </button>
    </div>
  );
}

export default Home;
