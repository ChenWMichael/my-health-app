'use client';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';

export default function RunningForm() {
    const [formData, setFormData] = useState({
        distance: '',
        time: '',
        calories: '',
        date: '',
        notes: '',
        }
    );
    const [lastSubmission, setLastSubmission] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const existingData = JSON.parse(localStorage.getItem('fitnessData')) || [];

        const newEntry = {
            id: Date.now().toString(),
            type: 'Running',
            distance: parseFloat(formData.distance),
            time: parseInt(formData.time, 10),
            date: formData.date ? new Date().toISOString() : new Date().toISOString(),
            calories: parseInt(formData.calories),
            notes: formData.notes,
        };

        const updatedData = [...existingData, newEntry];
        localStorage.setItem('fitnessData', JSON.stringify(updatedData));
        
        setLastSubmission(newEntry);
        setConfirmationMessage("Running data logged successfully!");

        setFormData({ 
            distance: '',
            time: '',
            calories: '',
            date: '',
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
            backgroundColor: '#white',
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
        <TextField
            label="Date (YYYY-MM-DD)"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Blank == Today's Date"
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
    );
}