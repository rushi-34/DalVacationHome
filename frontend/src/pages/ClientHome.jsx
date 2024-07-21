import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import { FaHome, FaLocationArrow, FaBed } from 'react-icons/fa';
import { toast } from 'react-toastify';
import NavBar from '../components/Navbar';

// const LAMBDA_URL = ' https://0vdot0tejk.execute-api.us-east-1.amazonaws.com/prod/room';
const LAMBDA_URL = import.meta.env.VITE_GET_ROOMS_LAMBDA_URL;
const UNSPLASH_API_URL = import.meta.env.VITE_UNSPLASH_API_URL;
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

function ClientHome() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(LAMBDA_URL);
                const roomsData = response.data;

                const roomsWithPhotos = await Promise.all(
                    roomsData.map(async (room) => {
                        const photoUrl = await fetchPhoto();
                        return { ...room, photoUrl };
                    })
                );

                setRooms(roomsWithPhotos);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching rooms:', err);
                toast.error('Failed to load rooms. Please try again later.');
                setLoading(false);
            }
        };

        const fetchPhoto = async () => {
            try {
                const response = await axios.get(UNSPLASH_API_URL, {
                    params: { query: 'Mountain room view', client_id: UNSPLASH_API_KEY, per_page: 1 }
                });
                return response.data.results[0]?.urls.small || 'https://via.placeholder.com/200';
            } catch (err) {
                console.error('Error fetching photo from Unsplash:', err);
                return 'https://via.placeholder.com/200';
            }
        };

        fetchRooms();
    }, []);

    const handleBook = (id) => {
        navigate(`/book-room/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <NavBar />
            <Container>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'indigo' }}>
                        <FaHome style={{ marginRight: '8px' }} /> Available Rooms
                    </Typography>
                    <Grid container spacing={3} mt={2}>
                        {rooms.map((room) => (
                            <Grid item xs={12} sm={6} md={4} key={room.room_id}>
                                <Paper elevation={3} sx={{ borderRadius: 2 }}>
                                    <img
                                        src={room.photoUrl}
                                        alt={`Room ${room.room_type}`}
                                        style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                    />
                                    <Box sx={{ padding: 2 }}>
                                        <Typography variant="h6" component="h3">
                                            {room.room_feature}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <FaLocationArrow style={{ fontSize: '12px', marginRight: '4px' }} />
                                            DalVacationHome
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <FaBed style={{ fontSize: '16px', marginRight: '4px' }} />
                                            {room.room_type}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                                            <Typography variant="h6" sx={{ color: 'indigo' }}>
                                                ${room.room_price}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: '#C51E3A',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#660000',
                                                    },
                                                }}
                                                onClick={() => handleBook(room.room_id)}
                                            >
                                                Book
                                            </Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </>
    );
}

export default ClientHome;
