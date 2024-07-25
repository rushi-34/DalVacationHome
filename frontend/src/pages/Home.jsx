import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

function Home() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleLogin = () => {
    navigate(`/login`);
  };

  const handleNavigate = () => {
    navigate(`/check-availability?start=${startDate}&end=${endDate}`);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-4xl font-bold mb-6">Dalhousie University</h1>
      <div className="flex gap-4 mb-4">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNavigate}
        className="px-4 py-2 text-lg rounded"
      >
        Check Availability
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        className="px-4 py-2 text-lg rounded"
      >
        Login/Register
      </Button>

    </div>
  );
}

export default Home;
