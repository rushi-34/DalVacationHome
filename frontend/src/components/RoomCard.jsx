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
                src={room.image}
                alt={`Room ${room.roomType}`}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            />
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6" component="h3">
                    {room.roomType}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaLocationArrow style={{ fontSize: '12px', marginRight: '4px' }} />
                    DalVacationHome
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaBed style={{ fontSize: '16px', marginRight: '4px' }} />
                    {room.roomNumber}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                    <Typography variant="h6" sx={{ color: 'indigo' }}>
                        ${room.price}
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
                        onClick={() => onBook(room.roomNumber)}
                    >
                        Book
                    </Button>
                </Box>
                <Box sx={{ marginTop: 1 }}>
                    {room.feedback.length > 0 ? (
                        <>
                            {getSentimentChip('Positive')}
                            <Chip
                                label={`Rating: ${room.feedback.length}`}
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
