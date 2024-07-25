import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room ID</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Room Feature</TableCell>
              <TableCell>Room Price</TableCell>
              <TableCell>Room Booking</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell>{room.room_id}</TableCell>
                <TableCell>{room.room_type}</TableCell>
                <TableCell>{room.room_feature}</TableCell>
                <TableCell>{room.room_price}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small">
                    Book
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CheckAvailability;
