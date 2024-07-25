import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { FaLocationArrow, FaBed } from 'react-icons/fa';

const RoomCard = ({ room, onBook }) => {
    const getSentimentChip = (sentiment) => {
        switch (sentiment) {
            case 'Positive':
                return <Chip label="Positive" color="success" sx={{ margin: '4px' }} />;
            case 'Negative':
                return <Chip label="Negative" color="error" sx={{ margin: '4px' }} />;
            default:
                return <Chip label="No reviews found" color="default" sx={{ margin: '4px' }} />;
        }
    };

    return (
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
                        onClick={() => onBook(room.room_id)}
                    >
                        Book
                    </Button>
                </Box>
                <Box sx={{ marginTop: 1 }}>
                    {room.overall_sentiment && room.star_rating ? (
                        <>
                            {getSentimentChip(room.overall_sentiment)}
                            <Chip
                                label={`Rating: ${room.star_rating}`}
                                color="info"
                                sx={{ margin: '4px' }}
                            />
                        </>
                    ) : (
                        getSentimentChip('No reviews found')
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default RoomCard;
