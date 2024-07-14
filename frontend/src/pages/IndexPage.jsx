import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, Divider, 
  Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import { FaHome, FaLocationArrow, FaEye, FaComments } from "react-icons/fa";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function IndexPage() {
  const navigate = useNavigate(); 

  const rooms = [
    { 
      id: 1, 
      number: 101, 
      hotel: 'Grand Hotel', 
      location: 'City Center', 
      price: 150, 
      image: '/assets/room1.jpeg',
      feedbacks: [
        { id: 1, comment: 'Great room with a beautiful view!'},
        { id: 2, comment: 'Excellent service and very comfortable stay.' },
      ],
      overallPolarity: 'Positive'
    },
    { 
      id: 2, 
      number: 205, 
      hotel: 'Seaside Resort', 
      location: 'Beachfront', 
      price: 220, 
      image: '/assets/room2.jpeg',
      feedbacks: [
        { id: 3, comment: 'Amazing beach view and spacious room.'},
      ],
      overallPolarity: 'Positive'
    },
    { 
      id: 3, 
      number: 312, 
      hotel: 'Mountain Lodge', 
      location: 'Alpine Village', 
      price: 180, 
      image: '/assets/room3.jpeg',
      feedbacks: [
        { id: 4, comment: 'Cozy room with breathtaking mountain views.' },
        { id: 5, comment: 'Perfect for a relaxing getaway.' },
      ],
      overallPolarity: 'Positive'
    },
  ];

  const getPolarityColor = (polarity) => {
    switch (polarity) {
      case 'Positive':
        return 'success';
      case 'Neutral':
        return 'warning';
      case 'Negative':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'indigo' }}>
        <FaHome style={{ marginRight: '8px' }} /> Available Rooms
      </Typography>

      <Grid container spacing={3} mt={2}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Paper elevation={3} sx={{ borderRadius: 2 }}>
              <img
                src={room.image} 
                alt={`Room ${room.number}`}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              />

              <Box sx={{ padding: 2 }}>
                <Typography variant="h6" component="h3">
                  #{room.number}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <FaLocationArrow style={{ fontSize: '12px', marginRight: '4px' }} />
                  {room.hotel}, {room.location}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                  <Typography variant="h6" sx={{ color: 'indigo' }}>
                    ${room.price}
                  </Typography>
                  <Button 
                    variant="outlined"
                    startIcon={<FaEye />}
                    onClick={() => navigate(`/room/${room.id}`)}
                  >
                    View
                  </Button>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <FaComments style={{ marginRight: '4px' }} />
                        {room.feedbacks.length} Feedback{room.feedbacks.length !== 1 ? 's' : ''}
                      </Typography>
                      <Chip 
                        label={room.overallPolarity} 
                        color={getPolarityColor(room.overallPolarity)}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {room.feedbacks.map((feedback, index) => (
                      <Box key={feedback.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">• {feedback.comment}</Typography>
                    
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default IndexPage;