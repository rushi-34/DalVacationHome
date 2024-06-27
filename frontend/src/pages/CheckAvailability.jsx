import React, { useEffect, useState } from 'react';

function CheckAvailability() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('https://0vdot0tejk.execute-api.us-east-1.amazonaws.com/prod/room')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // Log the data to the console
        setRooms(data);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      <h1 className="text-4xl font-bold mb-6">Dalhousie University</h1>
      <div className="w-full max-w-4xl">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Room ID</th>
              <th className="py-2 px-4 border-b">Room Type</th>
              <th className="py-2 px-4 border-b">Room Feature</th>
              <th className="py-2 px-4 border-b">Room Price</th>
              <th className="py-2 px-4 border-b">Check Availability</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{room.room_id}</td>
                <td className="py-2 px-4 border-b">{room.room_type}</td>
                <td className="py-2 px-4 border-b">{room.room_feature}</td>
                <td className="py-2 px-4 border-b">{room.room_price}</td>
                <td className="py-2 px-4 border-b">{room.check_availability ? 'Available' : 'Unavailable'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CheckAvailability;
