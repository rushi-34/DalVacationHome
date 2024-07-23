import React from 'react';
import { Grid, Typography } from '@mui/material';
import RoomCard from './RoomCard';

const RoomList = ({ rooms, onBook }) => (
    <>
        <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'indigo' }}>
            Available Rooms
        </Typography>
        <Grid container spacing={3} mt={2}>
            {rooms.map((room) => (
                <Grid item xs={12} sm={6} md={4} key={room.room_id}>
                    <RoomCard room={room} onBook={onBook} />
                </Grid>
            ))}
        </Grid>
    </>
);

export default RoomList;
