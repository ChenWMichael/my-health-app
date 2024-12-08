'use client';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';

export default function RunningForm() {
    const [formData, setFormData] = userState({
        distance: '',
        time: '',
        calories: '',
        date: '',
        notes: '',
        }
    )
}