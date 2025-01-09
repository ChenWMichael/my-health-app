'use client';
import { React, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const [fitnessData, setFitnessData] = useState([]);
    const [visibleGraphs, setVisibleGraphs] = useState({
        caloriesGraph: true,
        activityCountGraph: true,
        weightLineGraph: true,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/fitnessData');
                const data = await response.json();
                setFitnessData(data);
            } catch (error) {
                console.error('Error fetching fitness data:', error);
            }
        }
        fetchData();
    }, []);

    const toggleGraph = (graphKey) => {
        setVisibleGraphs((prev) => ({
            ...prev,
            [graphKey]: !prev[graphKey],
        }));
    };

    const analyzeCalories = () => {
        return fitnessData.reduce((acc, entry) => {
            if (entry.type === 'Weight') return acc;
            acc[entry.type] = (acc[entry.type] || 0) + (entry.calories || 0);
            return acc;
        }, {});
    };

    const analyzeActivityCounts = () => {
        return fitnessData.reduce((acc, entry) => {
            if (entry.type === 'Weight') return acc;
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

    const caloriesBarData = {
        labels: Object.keys(analyzeCalories()),
        datasets: [
            {
                label: 'Calories Burned',
                data: Object.values(analyzeCalories()),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const activityCountBarData = {
        labels: Object.keys(analyzeActivityCounts()),
        datasets: [
            {
                label: 'Activity Counts',
                data: Object.values(analyzeActivityCounts()),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            }
        ],
    };

    const weightLineData = {
        labels: analyzeWeightTrend().labels,
        datasets: [
            {
                label: 'Weight Measurements',
                data: analyzeWeightTrend().data,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            }
        ]
    }

    return (
        <div>
            <div>
                {Object.keys(visibleGraphs).map((graphKey) => (
                    <FormControlLabel
                        key={graphKey}
                        control={
                            <Checkbox
                                checked={visibleGraphs[graphKey]}
                                onChange={() => toggleGraph(graphKey)}
                            />
                        }
                        label={graphKey.replace(/Graph$/, '').replace(/([A-Z])/g, ' $1').trim()}
                    />
                ))}
            </div>
            {visibleGraphs.caloriesGraph && (
                <Card sx={{ margin: '20px 0' }}>
                    <CardContent>
                        <Typography variant="h6">Calories Burned</Typography>
                        <Bar data={caloriesBarData} />
                    </CardContent>
                </Card>
            )}
            {visibleGraphs.activityCountGraph && (
                <Card sx={{ margin: '20px 0' }}>
                    <CardContent>
                        <Typography variant="h6">Activity Count</Typography>
                        <Bar data={activityCountBarData} />
                    </CardContent>
                </Card>
            )}
            {visibleGraphs.weightLineGraph && (
                <Card sx={{ margin: '20px 0' }}>
                    <CardContent>
                        <Typography variant="h6">Weight Trend</Typography>
                        <Line data={weightLineData} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}