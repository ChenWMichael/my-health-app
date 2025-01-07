'use client';
import { React, useState, useEffect } from 'react';
import { generateAllMockData } from '../../utils/mockData';
import GridLayout from 'react-grid-layout';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
    // Default layout refers to the order of graphs displayed in the given session
    const defaultLayout = [
        { i: 'caloriesGraph', x: 0, y: 0, w: 6, h: 2 },
        { i: 'activityCountGraph', x: 6, y: 0, w: 6, h: 2 },
        { i: 'weightTrendGraph', x: 0, y: 2, w: 12, h: 2 },
    ];

    const [layout, setLayout] = useState(() => {
        const savedLayout = JSON.parse(localStorage.getItem('dashboardLayout'));
        return savedLayout || defaultLayout;
    })

    const [fitnessData, setFitnessData] = useState([]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('fitnessData'));
        if (!storedData || storedData.length === 0) {
            const mockData = generateAllMockData();
            localStorage.setItem('fitnessData', JSON.stringify(mockData));
            setFitnessData(mockData);
        } else {
            setFitnessData(storedData);
        }
    })

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
    }

    const analyzeCalories = () => {
        return fitnessData.reduce((acc, entry) => {
            acc[entry.type] = (acc[entry.type] || 0) + (entry.calories || 0);
            return acc;
        }, {});
    };

    const analyzeActivityCounts = () => {
        return fitnessData.reduce((acc, entry) => {
            acc[entry.type] = (acc[entry.type] || 0) + 1;
            return acc;
        }, {});
    }

    const analyzeWeightTrend = () => {
        return fitnessData
            .filter((entry) => entry.type === 'Weight')
            .sort((a,b) => new Date(a.date) - new Date(b.date));
    }

    const caloriesData = analyzeCalories();
    const activityCounts = analyzeActivityCounts();
    const weightTrendData = analyzeWeightTrend();

    const caloriesBarData = {
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
                        <Bar data={caloriesBarData} />
                    </CardContent>
                </Card>
            </div>
        </GridLayout>
    );
}