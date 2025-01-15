'use client';
import { Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function HikingForm() {
    const [formData, setFormData] = useState({
        distance: '',
        elevation: '',
        time: '',
        calories: '',
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

        const distance = parseFloat(formData.distance);
        const elevation = parseInt(formData.elevation);
        const time = parseInt(formData.time, 10);
        const calories = parseInt(formData.calories, 10);

        if (!formData.distance.trim() || isNaN(distance) || distance < 0) {
            setConfirmationMessage("Please enter a valid distance before submitting.")
            setMessageType('error');
            return;
        }

        if (!formData.elevation.trim() || isNaN(elevation) || elevation < 0) {
            setConfirmationMessage("Please enter a valid elevation before submitting.")
            setMessageType('error');
            return;
        }

        if (!formData.time.trim() || isNaN(time) || time <= 0) {
            setConfirmationMessage("Please enter a valid positive time before submitting.");
            setMessageType('error');
            return;
        }
    
        if (!formData.calories.trim() || isNaN(calories) || calories <= 0) {
            setConfirmationMessage("Please enter a valid positive calorie count before submitting.");
            setMessageType('error');
            return;
        }

        if (!formData.date) {
            setConfirmationMessage("Please select a valid date before submitting.");
            setMessageType('error');
            return;
        }

        const formattedDate = dayjs(formData.date).format('YYYY-MM-DD');
        console.log(formattedDate);

        try {
            const response = await fetch('/api/fitness-data', {
                method: 'Post',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
                    'x-csrf-token': process.env.NEXT_PUBLIC_CSRF_TOKEN,
                 },
                body: JSON.stringify({
                    type: 'Hiking',
                    distance: distance,
                    elevation: elevation,
                    time: time,
                    calories: calories,
                    date: formattedDate,
                    notes: formData.notes,
                }),
            });

            if (response.ok) {
                setConfirmationMessage('Hiking data logged successfully!');
                setMessageType('success');
                setFormData({ 
                    distance: '',
                    elevation: '',
                    time: '',
                    calories: '',
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
            Hiking Form
        </Typography>
        <TextField
            label="Distance (miles)"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
        />
        <TextField
            label="Elevation (ft)"
            name="elevation"
            value={formData.elevation}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
        />
        <TextField
            label="Time (minutes)"
            name="time"
            value={formData.time}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
        />
        <TextField
            label="Calories"
            name="calories"
            value={formData.calories}
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