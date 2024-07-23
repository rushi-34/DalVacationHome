import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  CircularProgress,
} from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GET_ROOM_URL = 'https://2aortemmzjhlyqzknj3lnhkpjq0nmfmh.lambda-url.us-east-1.on.aws/';
const UPDATE_ROOM_URL = 'https://6mokcyyqngttiluobsekioccra0wnoqk.lambda-url.us-east-1.on.aws/';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAmenity, setNewAmenity] = useState('');

  const roomTypes = ['Normal Room', 'Suite', 'Deluxe', 'Super-Deluxe'];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.post(GET_ROOM_URL, { id });
        const fetchedRoomData = response.data;
        setRoomData(fetchedRoomData);
      } catch (error) {
        console.error('Error fetching room:', error);
        toast.error('Failed to load room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(UPDATE_ROOM_URL, {
        id: id,
        roomType: roomData.roomType,
        maxGuests: roomData.maxGuests,
        price: roomData.price,
        amenities: roomData.amenities
      });
      console.log('Room updated:', response.data);
      toast.success('Room updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!roomData) {
    return <Typography>No room data available.</Typography>;
  }

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
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="room-type-label">Room Type</InputLabel>
              <Select
                labelId="room-type-label"
                name="roomType"
                value={roomData.roomType}
                onChange={handleInputChange}
                label="Room Type"
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
