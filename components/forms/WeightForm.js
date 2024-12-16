'use client';
import { Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';

export default function WeightForm() {
    const [formData, setFormData] = useState({
        weight: '',
        tod: '',
        date: null,
        notes: '',
        }
    );
    const [lastSubmission, setLastSubmission] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const existingData = JSON.parse(localStorage.getItem('fitnessData')) || [];

        const newEntry = {
            id: Date.now().toString(),
            type: 'Weight',
            distance: parseFloat(formData.distance),
            elevation: null,
            weight: parseFloat(formData.weight),
            tod: '',
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
        setConfirmationMessage("Weight data logged successfully!");

        setFormData({ 
            weight: '',
            tod: '',
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
            <Typography variant="body1" color="success.main" sx={{ marginTop: '20px' }}>
                {confirmationMessage}
            </Typography>
        )}
    </Box>
    </LocalizationProvider>
    );
}