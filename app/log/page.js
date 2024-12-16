'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import RunningForm from '../../components/forms/RunningForm';
import PickleballForm from '../../components/forms/PickleballForm';
import BadmintonForm from '../../components/forms/BadmintonForm';
import JumpRopeForm from '../../components/forms/JumpRopeForm';
import HikingForm from '../../components/forms/HikingForm';
import OtherForm from '../../components/forms/OtherForm';
import WeightForm from '../../components/forms/WeightForm';

export default function LogPage() {
  const router = useRouter();
  const activities = [
    {id: 'running', label: 'Running', component: RunningForm },
    {id: 'pickleball', label: 'Pickleball', component: PickleballForm},
    {id: 'jump rope', label: 'Jump Rope', component: JumpRopeForm},
    {id: 'badminton', label: 'Badminton', component: BadmintonForm},
    {id: 'hiking', label: 'Hiking', component: HikingForm},
    {id: 'Other', label: 'Other', component: OtherForm},
    {id: 'weight', label: 'Weight', component: WeightForm},
  ]
  const [selectedActivity, setSelectedActivity] = useState('');

  const handleSelectActivity = (event) => {
    setSelectedActivity(event.target.value);
  };

  const renderForm = () => {
    const activity = activities.find((a) => a.id === selectedActivity);
    if (!activity) {
      return <Typography>Select an activity to log data.</Typography>;
    }
    const ActivityForm = activity.component;
    return <ActivityForm />;
  };

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/');
  };

  return (
    <Box sx={{ padding: '20px', textAlign: 'center'}}>
        <Button 
            variant="outlined"
            onClick={handleLogout}
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 2 
            }}
        >
            Log Out 
        </Button>
        <Typography variant="h4" gutterBottom>
            Log Data
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel id="activity-select-label">Select Activity</InputLabel>
          <Select
            labelId="activity-select-label"
            value={selectedActivity}
            onChange={handleSelectActivity}
            label="Select Activity"
        >
            {activities.map((activity) => (
            <MenuItem key={activity.id} value={activity.id}>
              {activity.label}
            </MenuItem>
          ))}
          </Select>
        </FormControl>
        <Box>{renderForm()}</Box>
    </Box>
  );
}