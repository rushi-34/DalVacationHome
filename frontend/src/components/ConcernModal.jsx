import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ConcernModal = ({ open, handleClose }) => {
  const [bookingReference, setBookingReference] = useState('');
  const [concern, setConcern] = useState('');
  // const history = useHistory();

   const handleSubmit = async (event) => {
    event.preventDefault();
    if (bookingReference && concern) {
      try {
        const postData = {
          booking_id: bookingReference,
          message: concern,
          isAgent: false
      };
  
      const url = 'https://northamerica-northeast1-dalvacationhome-428403.cloudfunctions.net/publish-support-message';
      
      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          
          return response.json(); 
      });
        setBookingReference('');
        setConcern('');
        handleClose();
        history.push('/app/support');
      } catch (error) {
        console.error('Error publishing message:', error);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Submit Your Concern
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate mt={2}>
          <TextField
            label="Booking Reference"
            variant="outlined"
            fullWidth
            margin="normal"
            value={bookingReference}
            onChange={(e) => setBookingReference(e.target.value)}
            required
          />
          <TextField
            label="Your Concern"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConcernModal;
