import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Divider, 
  List, ListItem, ListItemIcon, ListItemText,
  TextField, IconButton, Grid, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FaHome, FaUtensils, FaWifi, FaUser, FaLocationArrow, FaDollarSign, FaComments } from "react-icons/fa";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [reservationByRoom, setReservationByRoom] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const rooms = [
    { id: 1, number: 101, hotel: 'Grand Hotel', location: 'City Center', price: 150, image: '/assets/room1.jpeg', amenities: ['2 BED', 'Lunch', 'Wifi'] },
    { id: 2, number: 205, hotel: 'Seaside Resort', location: 'Beachfront', price: 220, image: '/assets/room2.jpeg', amenities: ['2 BED', 'Lunch', 'Wifi'] },
    { id: 3, number: 312, hotel: 'Mountain Lodge', location: 'Alpine Village', price: 180, image: '/assets/room3.jpeg', amenities: ['2 BED', 'Lunch', 'Wifi'] },
  ];

  useEffect(() => {
    const fetchRoom = async () => {
      setIsLoading(true);
      try {
        const data = rooms.find(r => r.id === parseInt(roomId));
        setRoom(data);
        setReservationByRoom(null);
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      return checkOutDate.diff(checkInDate, 'day');
    }
    return 0;
  };

  const totalPrice = room ? room.price * calculateNights() : 0;

  const handleReserve = () => {
    console.log('Reserved Room:', room, 'Guests:', guestCount, 'Check-in:', checkInDate, 'Check-out:', checkOutDate);
    navigate('/confirmation');
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (!room) {
    return <Typography variant="h6">Room not found.</Typography>;
  }

  return (
    <Box sx={{ padding: 2, maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h6" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'indigo', mb: 3 }}>
        <FaHome style={{ marginRight: '16px' }} /> {room.hotel} - Room #{room.number}
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <img
              src={room.image}
              alt={`Room ${room.number}`}
              style={{ width: '100%', height: '100%', minHeight: 300, objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ padding: 3 }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FaLocationArrow style={{ marginRight: '8px' }} />
                {room.location}
              </Typography>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', color: 'indigo', mb: 2 }}>
                <FaDollarSign style={{ marginRight: '4px' }} />
                {room.price} per night
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 1 }}>Amenities:</Typography>
              <List disablePadding>
                {room.amenities.map((amenity) => (
                  <ListItem key={amenity}>
                    <ListItemIcon>
                      {amenity.includes('BED') ? <FaHome /> : 
                       amenity.includes('Lunch') ? <FaUtensils /> : 
                       <FaWifi />}
                    </ListItemIcon>
                    <ListItemText primary={amenity} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {reservationByRoom ? (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>Current Reservation</Typography>
                  <Typography>
                    You have a reservation for this room from{" "}
                    <strong>{dayjs(reservationByRoom.checkIn).format("MMM DD, YYYY")}</strong> to{" "}
                    <strong>{dayjs(reservationByRoom.checkOut).format("MMM DD, YYYY")}</strong>.
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Your booking reference code is <strong>{reservationByRoom.ReferenceCode}</strong>
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FaUser style={{ marginRight: '8px' }} />
                    <Typography sx={{ mr: 2 }}>Guests:</Typography>
                    <IconButton onClick={() => setGuestCount(Math.max(1, guestCount - 1))}>
                      <RemoveIcon />
                    </IconButton>
                    <TextField value={guestCount} size="small" inputProps={{ readOnly: true }} sx={{ width: 50, textAlign: 'center' }} />
                    <IconButton onClick={() => setGuestCount(guestCount + 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <DatePicker
                        label="Check-in"
                        value={checkInDate}
                        onChange={(newValue) => setCheckInDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDate={dayjs()}
                      />
                      <DatePicker
                        label="Check-out"
                        value={checkOutDate}
                        onChange={(newValue) => setCheckOutDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDate={checkInDate ? checkInDate.add(1, 'day') : dayjs().add(1, 'day')}
                      />
                    </Box>
                  </LocalizationProvider>

                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Total: ${totalPrice}
                    {calculateNights() > 0 && <span> ({calculateNights()} nights)</span>}
                  </Typography>

                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleReserve}
                    sx={{ mt: 2, width: '100%', bgcolor: 'indigo', '&:hover': { bgcolor: 'indigo.dark' } }}
                    disabled={!checkInDate || !checkOutDate} 
                  >
                    Reserve Now
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default RoomDetailsPage;