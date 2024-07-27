import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { FaLocationArrow, FaBed, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const RoomCard = ({ room, onBook }) => {
    const getSentimentChip = (sentiment) => {
        switch (sentiment) {
            case 'Positive':
                return <Chip label="Positive" color="success" sx={{ margin: '4px' }} />;
            case 'Negative':
                return <Chip label="Negative" color="error" sx={{ margin: '4px' }} />;
            default:
                return <Chip label="No Reviews found" color="default" sx={{ margin: '4px' }} />;
        }
    };

    const getStarRating = (rating) => {
        if (rating === null) {
            return <Chip label="No Ratings" color="default" sx={{ margin: '4px' }} />;
        }
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(<FaStar key={i} style={{ color: 'gold', fontSize: '16px', marginRight: '2px' }} />);
        }
        if (rating % 1 !== 0) {
            stars.push(<FaStarHalfAlt key={rating} style={{ color: 'gold', fontSize: '16px', marginRight: '2px' }} />);
        }
        return <Chip label={stars} color="default" sx={{ margin: '4px' }} />;
    };

    return (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <img
                src={room.image}
                alt={`Room ${room.roomType}`}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            />
            <Box sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>

                    <Typography variant="h6" component="h3">
                        {"#" + room.roomNumber}
                    </Typography>
                    <Box sx={{ marginTop: 1 }}>
                        {getStarRating(room.star_rating)}
                    </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaLocationArrow style={{ fontSize: '12px', marginRight: '4px' }} />
                    DalVacationHome
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FaBed style={{ fontSize: '16px', marginRight: '4px' }} />
                    {room.roomType}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>

                    <Box sx={{ marginTop: 1 }}>
                        {getSentimentChip(room.overall_sentiment)}
                    </Box>

                </Box>
            </Box>
        </Paper>
    );
};

export default RoomCard;
