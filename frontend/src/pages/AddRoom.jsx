import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { PhotoCamera } from '@mui/icons-material';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UPLOAD_IMAGE_URL = 'https://r2gzzdiz7wkh2i2l5g2btfqcni0dnwyv.lambda-url.us-east-1.on.aws/';
const ADD_ROOM_URL = 'https://423mzrknqx7gj4otyur2ur2dbi0nnzqg.lambda-url.us-east-1.on.aws/';

const AddRoom = () => {
const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    photo: null,
    roomNumber: '',
    roomType: '',
    maxGuests: '',
    price: '',
    amenities: [],
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roomTypes = ['Normal Room', 'Suite', 'Deluxe', 'Super-Deluxe'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleFileChange = (e) => {
    setRoomData({ ...roomData, photo: e.target.files[0] });
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
    setIsSubmitting(true);

    try {
      // First, add the room
      const addRoomResponse = await axios.post(ADD_ROOM_URL, {
        roomNumber: roomData.roomNumber,
        roomType: roomData.roomType,
        maxGuests: roomData.maxGuests,
        price: roomData.price,
        amenities: roomData.amenities,
      });

      const roomId = addRoomResponse.data.id;

      // If a photo was selected, upload it
      if (roomData.photo) {
        const formData = new FormData();
        formData.append('file', roomData.photo);

        await axios.post(`${UPLOAD_IMAGE_URL}?roomId=${roomId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      toast.success('Room added successfully');
      navigate('/');
      setRoomData({
        photo: null,
        roomNumber: '',
        roomType: '',
        maxGuests: '',
        price: '',
        amenities: [],
      });
    } catch (error) {
      console.error('Error adding room:', error);
      toast.error('Failed to add room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Room
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                height: 100,
                borderStyle: 'dashed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="photo-upload">
                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                  {roomData.photo ? roomData.photo.name : 'Upload Room Photo'}
                </Button>
              </label>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room Number"
              name="roomNumber"
              value={roomData.roomNumber}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="room-type-label" shrink>Room Type</InputLabel>
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
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label="Add Amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Room'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddRoom;
