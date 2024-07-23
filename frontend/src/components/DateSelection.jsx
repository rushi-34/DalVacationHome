import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const DateSelection = ({ checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, onCheckAvailability }) => (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label="Check-in Date"
                value={checkInDate}
                onChange={(newValue) => setCheckInDate(newValue)}
                slots={{
                    textField: (props) => <TextField {...props} />
                }}
            />
            <DatePicker
                label="Check-out Date"
                value={checkOutDate}
                onChange={(newValue) => setCheckOutDate(newValue)}
                slots={{
                    textField: (props) => <TextField {...props} />
                }}
            />
        </LocalizationProvider>
        <Button
            variant="contained"
            sx={{
                backgroundColor: '#C51E3A',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#660000',
                },
            }}
            onClick={onCheckAvailability}
        >
            Check Availability
        </Button>
    </Box>
);

export default DateSelection;
