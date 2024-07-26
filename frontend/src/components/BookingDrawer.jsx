import React, { useEffect, useState } from 'react';
import { Drawer, List, Divider, Box, Typography, Paper, Button, TextField, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { FaLocationArrow, FaBed } from 'react-icons/fa';
import { currentUser } from '../api/api'; // Import the currentUser function from api.js
import { toast } from 'react-toastify';
import { Rating } from '@mui/lab';

const BOOKINGS_URL = import.meta.env.VITE_GET_BOOKINGS_LAMBDA_URL; // URL for fetching bookings
const FEEDBACK_URL = import.meta.env.VITE_GIVE_FEEDBACK_LAMBDA_URL; // URL for submitting feedback

const BookingDrawer = ({ open, onClose }) => {
    const theme = useTheme();
    const [bookings, setBookings] = useState([]); // Array of bookings
    const [loading, setLoading] = useState(false); // Loading state for fetching bookings
    const [feedback, setFeedback] = useState({}); // Object to store feedback for each booking
    const [rating, setRating] = useState({}); // Object to store rating for each booking
    const [selectedBooking, setSelectedBooking] = useState(null); // ID of the selected booking
    const [loadingFeedback, setLoadingFeedback] = useState(false); // Loading state for submitting feedback

    useEffect(() => {
        if (open) {
            fetchBookings(); // Fetch bookings when the drawer is opened
        }
    }, [open]);

    const fetchBookings = async () => {
        setLoading(true);
        const user = currentUser();
        if (!user) {
            toast.error('You must be logged in to view your bookings.');
            setLoading(false);
            return;
        }
        try {
            const payload = { user_id: user.getUsername() };
            console.log('Payload:', payload);
            const response = await axios.post(BOOKINGS_URL, payload); // Fetch bookings from the server
            setBookings(response.data); // Update the bookings state
        } catch (err) {
            console.error('Error fetching bookings:', err);
            toast.error('Failed to load bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackChange = (bookingId, value) => {
        setFeedback(prev => ({ ...prev, [bookingId]: value })); // Update the feedback state for a specific booking
    };

    const handleRatingChange = (bookingId, value) => {
        setRating(prev => ({ ...prev, [bookingId]: value })); // Update the rating state for a specific booking
    };

    const isSubmitDisabled = (bookingId) => {
        const feedbackText = feedback[bookingId] || '';
        const ratingValue = rating[bookingId] || 0;
        return feedbackText.trim() === '' || ratingValue === 0; // Check if the feedback and rating are empty
    };

    const handleFeedbackSubmit = async (bookingId) => {
        const user = currentUser();
        if (!user) {
            toast.error('You must be logged in to give feedback.');
            return;
        }

        const payload = {
            user_id: user.getUsername(),
            booking_id: bookingId,
            review_comments: feedback[bookingId] || '',
            review_stars: rating[bookingId] || 0,
        };

        if (isSubmitDisabled(bookingId)) {
            toast.error('Feedback and rating cannot be empty.');
            return;
        }

        setLoadingFeedback(true);

        try {
            await axios.post(FEEDBACK_URL, payload); // Submit feedback to the server
            toast.success('Feedback submitted successfully!');
            setSelectedBooking(null);
            handleFeedbackChange(bookingId, ''); // Clear the feedback state
            handleRatingChange(bookingId, 0); // Clear the rating state
        } catch (err) {
            console.error('Error submitting feedback:', err);
            toast.error('Failed to submit feedback. Please try again later.');
        } finally {
            setLoadingFeedback(false);
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 400,
                    backgroundColor: theme.palette.background.paper,
                    padding: theme.spacing(2),
                }
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                My Bookings
            </Typography>
            <Divider />
            <List>
                {loading ? (
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Loading...
                    </Typography>
                ) : (
                    bookings.map((booking) => (
                        <Paper key={booking.booking_id} elevation={3} sx={{ padding: 2, mb: 2 }}>
                            <Typography variant="h6">{`Booking ID: ${booking.booking_id}`}</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FaLocationArrow style={{ fontSize: '12px', marginRight: '4px' }} />
                                Room ID: {booking.roomNumber}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <FaBed style={{ fontSize: '16px', marginRight: '4px' }} />
                                Status: {booking.status}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Check-in: {booking.start_date}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Check-out: {booking.end_date}
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 1,
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                }}
                                onClick={() => setSelectedBooking(booking.booking_id)}
                            >
                                Give Feedback
                            </Button>
                            {selectedBooking === booking.booking_id && (
                                <>
                                    <TextField
                                        label="Feedback"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={feedback[booking.booking_id] || ''}
                                        onChange={(e) => handleFeedbackChange(booking.booking_id, e.target.value)}
                                        sx={{ mt: 1, mb: 1 }}
                                    />
                                    <Rating
                                        name="rating"
                                        value={rating[booking.booking_id] || 0}
                                        onChange={(event, newValue) => handleRatingChange(booking.booking_id, newValue)}
                                        precision={0.5}
                                        sx={{ mb: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            mt: 1,
                                            backgroundColor: theme.palette.success.main,
                                            color: theme.palette.success.contrastText,
                                            '&:hover': {
                                                backgroundColor: theme.palette.success.dark,
                                            },
                                        }}
                                        onClick={() => handleFeedbackSubmit(booking.booking_id)}
                                        disabled={loadingFeedback || isSubmitDisabled(booking.booking_id)}
                                    >
                                        {loadingFeedback ? (
                                            <CircularProgress size={24} sx={{ color: theme.palette.success.contrastText }} />
                                        ) : (
                                            'Submit Feedback'
                                        )}
                                    </Button>
                                </>
                            )}
                        </Paper>
                    ))
                )}
            </List>
        </Drawer>
    );
};

export default BookingDrawer;
