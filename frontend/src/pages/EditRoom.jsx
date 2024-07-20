import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    roomType: '',
    maxGuests: '',
    price: '',
    amenities: [],
  });

  const [newAmenity, setNewAmenity] = useState('');
  const roomTypes = ['Normal Room', 'Suite', 'Deluxe', 'Super-Deluxe'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleAddAmenity = () => {
    if (newAmenity && !roomData.amenities.includes(newAmenity)) {
      setRoomData({ ...roomData, amenities: [...roomData.amenities, newAmenity] });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setRoomData({
      ...roomData,
      amenities: roomData.amenities.filter((am) => am !== amenity),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Editing room:', id);
    console.log('Updated room data:', roomData);
    toast.success('Room edited successfully (simulated)');
    navigate('/');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Room
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room Number"
              name="roomNumber"
              value={roomData.roomNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Room Type</InputLabel>
              <Select
                name="roomType"
                value={roomData.roomType}
                onChange={handleInputChange}
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Maximum Guests"
              name="maxGuests"
              type="number"
              value={roomData.maxGuests}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price (CAD)"
              name="price"
              type="number"
              value={roomData.price}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label="Add Amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddAmenity} sx={{ ml: 1 }}>
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {roomData.amenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onDelete={() => handleRemoveAmenity(amenity)}
                  deleteIcon={<FaTimes />}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Edit Room
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditRoom;
