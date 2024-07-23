import React, { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import NavBar from '../components/Navbar';
import DateSelection from '../components/DateSelection';
import RoomList from '../components/RoomList';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchRooms, bookRoom, formatDate } from '../api/api';
import { currentUser } from '../api/api'; // Import the currentUser function from api.js
import BookingDrawer from '../components/BookingDrawer';

const ClientHome = () => {
    const [rooms, setRooms] = useState([]); // State variable to store the list of rooms
    const [loading, setLoading] = useState(false); // State variable to indicate if data is being loaded
    const [checkInDate, setCheckInDate] = useState(null); // State variable to store the check-in date
    const [checkOutDate, setCheckOutDate] = useState(null); // State variable to store the check-out date
    const [availabilityChecked, setAvailabilityChecked] = useState(false); // State variable to indicate if availability has been checked
    const [drawerOpen, setDrawerOpen] = useState(false); // State variable to indicate if the booking drawer is open

    // Method to handle checking availability of rooms
    const handleCheckAvailability = async () => {
        if (checkInDate && checkOutDate) {
            setLoading(true);
            try {
                const roomsData = await fetchRooms(checkInDate, checkOutDate); // Fetch rooms data from the API
                setRooms(roomsData); // Update the rooms state variable with the fetched data
                setAvailabilityChecked(true); // Set availabilityChecked to true to indicate availability has been checked
            } catch (err) {
                toast.error('Failed to load rooms. Please try again later.'); // Display an error toast if fetching rooms fails
            } finally {
                setLoading(false); // Set loading to false after fetching rooms data
            }
        } else {
            toast.error('Please select both check-in and check-out dates.'); // Display an error toast if check-in or check-out dates are not selected
        }
    };

    // Method to handle booking a room
    const handleBook = async (room_id) => {
        const user = currentUser(); // Get the current user from the API
        if (!user) {
            toast.error('You must be logged in to book a room.'); // Display an error toast if user is not logged in
            return;
        }

        const payload = {
            user_id: user.getUsername(), // Get the username of the current user
            room_id: room_id, // Get the ID of the selected room
            start_date: formatDate(checkInDate), // Format the check-in date
            end_date: formatDate(checkOutDate), // Format the check-out date
        };

        try {
            await bookRoom(payload); // Send the booking request to the API
            toast.success('Room booked successfully!'); // Display a success toast if booking is successful
        } catch (err) {
            toast.error('Failed to book room. Please try again later.'); // Display an error toast if booking fails
        }
    };

    return (
        <>
            <NavBar /> {/* Render the navigation bar component */}
            <Container>
                <Box sx={{ padding: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'indigo' }}>
                            Check Availability
                        </Typography>

                        {/* <Button
                            variant="outlined"
                            sx={{ color: 'purple' }}
                        >

                        </Button> */}
                        <Button
                            variant="outlined"
                            sx={{ color: 'purple' }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            My Bookings
                        </Button>
                    </Box>
                    <DateSelection
                        checkInDate={checkInDate}
                        setCheckInDate={setCheckInDate}
                        checkOutDate={checkOutDate}
                        setCheckOutDate={setCheckOutDate}
                        onCheckAvailability={handleCheckAvailability}
                    /> {/* Render the date selection component */}
                    {loading ? (
                        <LoadingSpinner /> // Render a loading spinner if data is being loaded
                    ) : (
                        availabilityChecked && <RoomList rooms={rooms} onBook={handleBook} /> // Render the room list component if availability has been checked
                    )}
                </Box>
            </Container>
            <BookingDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            /> {/* Render the booking drawer component */}
        </>
    );
};

export default ClientHome;
