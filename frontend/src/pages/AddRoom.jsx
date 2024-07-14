import React, { useState } from 'react';
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
    Autocomplete,
} from '@mui/material';
import { PhotoCamera, Hotel, Room, People, LocationOn, AttachMoney } from '@mui/icons-material';

function AddRoom() {
    const [roomData, setRoomData] = useState({
        photo: null,
        hotel: '',
        roomNumber: '',
        maxGuests: '',
        location: '',
        price: '',
        type: '',
        customType: '',
        amenities: [],
    });

    const roomTypes = ['Normal Room', 'Suite', 'Other'];
    const availableAmenities = ['2-bed', 'Lunch', 'WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Swimming Pool', 'Gym', 'Spa', 'Parking'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...roomData, [name]: value });
    };

    const handleFileChange = (e) => {
        setRoomData({ ...roomData, photo: e.target.files[0] });
    };

    const handleAmenitiesChange = (event, newValue) => {
        setRoomData({ ...roomData, amenities: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(roomData);
    };

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
                    Add New Room
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<PhotoCamera />}
                                sx={{ width: '100%', height: 100, borderStyle: 'dashed' }}
                            >
                                {roomData.photo ? roomData.photo.name : 'Upload Room Photo'}
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Hotel" 
                                name="hotel" 
                                value={roomData.hotel} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required 
                                InputProps={{
                                    startAdornment: <Hotel sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Room Number" 
                                name="roomNumber" 
                                value={roomData.roomNumber} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required 
                                InputProps={{
                                    startAdornment: <Room sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Maximum Guests" 
                                type="number" 
                                name="maxGuests" 
                                value={roomData.maxGuests} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required 
                                InputProps={{
                                    startAdornment: <People sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Location" 
                                name="location" 
                                value={roomData.location} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required 
                                InputProps={{
                                    startAdornment: <LocationOn sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Price ($)" 
                                type="number" 
                                name="price" 
                                value={roomData.price} 
                                onChange={handleInputChange} 
                                fullWidth 
                                required 
                                InputProps={{
                                    startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Room Type</InputLabel>
                                <Select
                                    name="type"
                                    value={roomData.type}
                                    onChange={handleInputChange}
                                    required
                                    label="Room Type"
                                >
                                    {roomTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {roomData.type === 'Other' && (
                            <Grid item xs={12}>
                                <TextField 
                                    label="Custom Room Type" 
                                    name="customType" 
                                    value={roomData.customType} 
                                    onChange={handleInputChange} 
                                    fullWidth 
                                    required 
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                id="amenities-select"
                                options={availableAmenities}
                                value={roomData.amenities}
                                onChange={handleAmenitiesChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Amenities"
                                        placeholder="Select amenities"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                    ))
                                }
                            />
                        </Grid>
                    </Grid>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        sx={{ mt: 4, width: '100%' }}
                    >
                        Add Room
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default AddRoom;