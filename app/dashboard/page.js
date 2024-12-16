'use client';
import { React, useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const defaultLayout = [
        { i: 'caloriesGraph', x: 0, y: 0, w: 6, h: 2 },
    ];

    const [layout, setLayout] = useState(() => {
        const savedLayout = JSON.parse(localStorage.getItem('dashboardLayout'));
        return savedLayout || defaultLayout;
    })

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
    }

    const fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];

    const analyzeCalories = () => {
        return fitnessData.reduce((acc, entry) => {
            acc[entry.type] = (acc[entry.type] || 0) + (entry.calories || 0);
            return acc;
        }, {});
    };

    const caloriesData = analyzeCalories();
    const barData = {
        labels: Object.keys(caloriesData),
        datasets: [
            {
                label: 'Calories Burned',
                data: Object.values(caloriesData),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={150}
            width={1200}
            onLayoutChange={handleLayoutChange}
        >
            <div key="caloriesGraph">
                <Card sx={{ height: '105%' }}>
                    <CardContent>
                        <Typography variant="h6">Calories Burned</Typography>
                        <Bar data={barData} />
                    </CardContent>
                </Card>
            </div>
        </GridLayout>
    );
}