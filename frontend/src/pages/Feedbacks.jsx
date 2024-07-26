import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import NavBar from '../components/Navbar';

const Feedbacks = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('https://lwylikrcz6.execute-api.us-east-1.amazonaws.com/default/get-all-rooms');
                // Sort rooms by roomNumber in ascending order
                const sortedRooms = response.data.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber));
                setRooms(sortedRooms);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const getDummyFeedback = (sentiment, roomNumber) => {
        const positiveFeedbacks = [
            "Excellent service!",
            "Very clean and comfortable.",
            "Had a wonderful stay!",
            "Great amenities and location!",
            "Will definitely come back!",
            "Staff was very friendly and helpful.",
            "The room exceeded our expectations.",
            "Beautiful view from the balcony.",
            "Room service was prompt and efficient.",
            "The bed was extremely comfortable."
        ];

        const negativeFeedbacks = [
            "Room was not clean.",
            "Very noisy environment.",
            "Staff was not helpful.",
            "Poor amenities.",
            "Not worth the price.",
            "The room was too small.",
            "The air conditioning was not working.",
            "The bathroom was dirty.",
            "The location was not convenient.",
            "The check-in process was very slow."
        ];

        const feedbacks = sentiment === 'Positive' ? positiveFeedbacks : negativeFeedbacks;
        const hash = roomNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const numberOfFeedbacks = (hash % feedbacks.length) + 1;
        return feedbacks.slice(0, numberOfFeedbacks);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error: {error}</Alert>;

    return (
        <>
            <NavBar />
            <Container>
                <Typography variant="h4" marginTop={3} gutterBottom>
                    Feedbacks            </Typography>
                <Grid container spacing={3}>
                    {rooms.map(room => (
                        <Grid item xs={12} sm={6} md={4} key={room.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={room.image}
                                    alt={`Room ${room.roomNumber}`}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        Room {room.roomNumber}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Sentiment: {room.overall_sentiment || 'No reviews found'}
                                    </Typography>
                                    {room.overall_sentiment && (
                                        <>
                                            <Typography variant="subtitle1" component="div" gutterBottom>
                                                Feedback:
                                            </Typography>
                                            {getDummyFeedback(room.overall_sentiment, room.roomNumber).map((feedback, index) => (
                                                <Typography key={index} variant="body2" color="text.secondary">
                                                    - {feedback}
                                                </Typography>
                                            ))}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>

    );
};

export default Feedbacks;
