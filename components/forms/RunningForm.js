'use client';
import { Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';

export default function RunningForm() {
    const [formData, setFormData] = useState({
        distance: '',
        time: '',
        calories: '',
        date: null,
        notes: '',
        }
    );
    const [lastSubmission, setLastSubmission] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const distance = parseFloat(formData.distance);
        const time = parseInt(formData.time, 10);
        const calories = parseInt(formData.calories, 10);
    
        if (!formData.distance.trim() || isNaN(distance) || distance <= 0) {
            setConfirmationMessage("Please enter a valid positive distance before submitting.");
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
        
        const existingData = JSON.parse(localStorage.getItem('fitnessData')) || [];

        const newEntry = {
            id: Date.now().toString(),
            type: 'Running',
            distance: parseFloat(formData.distance),
            elevation: null,
            weight: null,
            tod: null,
            level: null,
            count: null,
            time: parseInt(formData.time, 10),
            date: formData.date ? formData.date.toISOString() : new Date().toISOString(),
            calories: parseInt(formData.calories),
            notes: formData.notes,
        };

        const updatedData = [...existingData, newEntry];
        localStorage.setItem('fitnessData', JSON.stringify(updatedData));
        
        setLastSubmission(newEntry);
        setConfirmationMessage("Running data logged successfully!");
        setMessageType('success');

        setFormData({ 
            distance: '',
            time: '',
            calories: '',
            date: null,
            notes: '',
        });
    };

    const handleUndo = () => {
        if (!lastSubmission) return;
    
        const existingData = JSON.parse(localStorage.getItem('fitnessData')) || [];
    
        const updatedData = existingData.filter((entry) => entry.id !== lastSubmission.id);
        localStorage.setItem('fitnessData', JSON.stringify(updatedData));
    
        setLastSubmission(null);
        setConfirmationMessage('Reverted last submission.');
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
            Running Form
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
        {lastSubmission && (
            <Button
                variant="contained"
                color="secondary"
                onClick={handleUndo}
                sx={{marginTop: '10px'}}
            >
                Undo Submission
            </Button>
        )}
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