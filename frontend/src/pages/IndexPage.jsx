import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Grid, Paper, Button, CircularProgress
} from '@mui/material';
import { FaHome, FaLocationArrow, FaEdit, FaTrash, FaBed } from "react-icons/fa";
import { toast } from 'react-toastify';

const LAMBDA_URL = 'https://qlpywupcdaqtiibipylxwifzhq0rfxop.lambda-url.us-east-1.on.aws/';
const DELETE_LAMBDA_URL = 'https://jugqhcf4gugo46i2vmynwbxswy0uwohw.lambda-url.us-east-1.on.aws/';

function IndexPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortRoomsByNumber = (a, b) => {
    return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(LAMBDA_URL);
        const sortedRooms = response.data.sort(sortRoomsByNumber);
        setRooms(sortedRooms);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        toast.error('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.post(DELETE_LAMBDA_URL, { id });
        const updatedRooms = rooms.filter(room => room.id !== id).sort(sortRoomsByNumber);
        setRooms(updatedRooms);
        toast.success('Room deleted successfully');
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room. Please try again.');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/app/agent/edit-room/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'indigo' }}>
        <FaHome style={{ marginRight: '8px' }} /> Available Rooms
      </Typography>

      <Grid container spacing={3} mt={2}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              <img
                src={room.image} 
                alt={`Room ${room.roomNumber}`}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              />

              <Box sx={{ padding: 2 }}>
                <Typography variant="h6" component="h3">
                  #{room.roomNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FaLocationArrow style={{ fontSize: '12px', marginRight: '4px' }} />
                  DalVacationHome {room.location}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FaBed style={{ fontSize: '16px', marginRight: '4px' }} />
                  {room.roomType}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                  <Typography variant="h6" sx={{ color: 'indigo' }}>
                    ${room.price}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined"
                      startIcon={<FaEdit />}
                      onClick={() => handleEdit(room.id)}
                      sx={{ 
                        borderColor: '#2196f3',
                        color: '#2196f3',
                        '&:hover': {
                          backgroundColor: '#2196f3',
                          color: '#fff',
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined"
                      startIcon={<FaTrash />}
                      onClick={() => handleDelete(room.id)}
                      sx={{ 
                        borderColor: '#f44336',
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: '#f44336',
                          color: '#fff',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default IndexPage;
