'use client';
import { Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function WeightForm() {
    const [formData, setFormData] = useState({
        weight: '',
        tod: '',
        date: null,
        notes: '',
        }
    );

    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const weight = parseFloat(formData.weight);
    
        if (!formData.weight.trim() || isNaN(weight) || weight <= 0) {
            setConfirmationMessage("Please enter a valid positive weight before submitting.");
            setMessageType('error');
            return;
        }
        
        if (!formData.date) {
            setConfirmationMessage("Please select a date before submitting.");
            setMessageType('error');
            return;
        }

        if (formData.tod.toLowerCase() != 'morning' && formData.tod.toLowerCase() != 'afternoon' && formData.tod.toLowerCase() != 'night') {
            setConfirmationMessage("Please enter a valid time of day.")
            setMessageType('error');
            return;
        }

        const formattedDate = dayjs(formData.date).format('YYYY-MM-DD');
        console.log(formattedDate);

        try {
            const response = await fetch('/api/fitness-data', {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'Weight',
                    weight: weight,
                    time_of_day: formData.tod,
                    date: formattedDate,
                    notes: formData.notes,
                }),
            });

            if (response.ok) {
                setConfirmationMessage('Weight data logged successfully!');
                setMessageType('success');
                setFormData({ 
                    weight: '',
                    tod: '',
                    date: null,
                    notes: '',
                });
            } else {
                setConfirmationMessage('Error logging data. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            setConfirmationMessage('Network error. Please try again.');
            setMessageType('error');
        }
    };
    
    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '10px',
            backgroundColor: '#f2f2f2',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
        <Typography variant="h5" gutterBottom>
            Weight Form
        </Typography>
        <TextField
            label="Weight (lbs)"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
        />
        <TextField
            label="Time of Day (morning, afternoon, night)"
            name="tod"
            value={formData.tod}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
        />
        <DatePicker
            label="Date"
            value={formData.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal"/>}
            required
        />
        <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
            Save
        </Button>
        {confirmationMessage && (
            <Typography 
                variant="body1" 
                sx={{ 
                    marginTop: '20px',
                    color: messageType === 'success' ? 'success.main' : 'error.main',
                }}>
                {confirmationMessage}
            </Typography>
        )}
    </Box>
    </LocalizationProvider>
    );
}