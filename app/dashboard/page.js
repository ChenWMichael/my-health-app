'use client';
import { React, useState, useEffect } from 'react';
import { generateAllMockData } from '../../utils/mockData';
import GridLayout from 'react-grid-layout';
import { Card, CardContent, Typography } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
    // Default layout refers to the order of graphs displayed in the given session
    // Squishing issues are related to the default layout not taking account the extra graphs
    const defaultLayout = [
        { i: 'caloriesGraph', x: 0, y: 0, w: 6, h: 2 },
        { i: 'activityCountGraph', x: 6, y: 0, w: 6, h: 2 },
        { i: 'weightLineGraph', x: 0, y: 2, w:6, h:2 },
    ];

    const [layout, setLayout] = useState(defaultLayout);
    const [fitnessData, setFitnessData] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLayout = JSON.parse(localStorage.getItem('dashboardLayout'));
            const storedData = JSON.parse(localStorage.getItem('fitnessData'));
            
            // Restore layout
            if (savedLayout) {
                setLayout(savedLayout);
            }

            // Use stored fitness data or fallback to mock
            if (storedData && storedData.length > 0) {
                setFitnessData(storedData);
            } else {
                // Generate mock data
                const mockData = generateMockData(); // Replace with actual data fetch in production
                localStorage.setItem('fitnessData', JSON.stringify(mockData));
                setFitnessData(mockData);
            }
        }
    }, []);

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        if (typeof window !== 'undefined') {
            localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
        }
    }

    const analyzeCalories = () => {
        return fitnessData.reduce((acc, entry) => {
            if (entry.type === 'Weight') {
                return acc;
            } 
            acc[entry.type] = (acc[entry.type] || 0) + (entry.calories || 0);
            return acc;
        }, {});
    };

    const analyzeActivityCounts = () => {
        return fitnessData.reduce((acc, entry) => {
            if (entry.type === 'Weight') {
                return acc;
            } 
            acc[entry.type] = (acc[entry.type] || 0) + 1;
            return acc;
        }, {});
    };

    const analyzeWeightTrend = () => {
        const weightEntries = fitnessData
        .filter((entry) => entry.type === 'Weight')
        .sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            labels: weightEntries.map((entry) => new Date(entry.date).toLocaleDateString()),
            data: weightEntries.map((entry) => entry.weight),
        };
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

    const activityCountBarData = {
        labels: Object.keys(activityCounts),
        datasets: [
            {
                label: 'Activity Counts',
                data: Object.values(activityCounts),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ],
    };

    const weightLineData = {
        labels: weightTrendData.labels,
        datasets: [
            {
                label: 'Weight Measurements',
                data: weightTrendData.data,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            }
        ]
    }

    return (
        <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={155}
            width={1200}
            margin={[10, 20]}
            preventCollision={true} 
            onLayoutChange={handleLayoutChange}
        >
            <div key="caloriesGraph">
                <Card sx={{ height: '105%'}}>
                    <CardContent>
                        <Typography variant="h6">Calories Burned</Typography>
                        <Bar 
                            data={caloriesBarData} 
                            options={{
                                responsive: true,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            
            <div key="activityCountGraph">
                <Card sx={{ height: '105%' }}>
                    <CardContent>
                        <Typography variant="h6">Activity Count</Typography>
                        <Bar data={activityCountBarData} />
                    </CardContent>
                </Card>
            </div>

            <div key="weightLineGraph">
                <Card sx={{ height: '105%' }}>
                    <CardContent>
                        <Typography variant="h6">Weight Trend</Typography>
                        <Line data={weightLineData} />
                    </CardContent>
                </Card>
            </div>
        </GridLayout>
    );
}