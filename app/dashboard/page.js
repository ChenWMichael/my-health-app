'use client';
import { React, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-luxon';


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, TimeScale, Title, Tooltip, Legend);

const timeframes = ['1D', '7D', '1M', '6M', 'YTD', '1Y', '5Y', '10Y']

export default function Dashboard() {
    const [fitnessData, setFitnessData] = useState([]);
    const [visibleGraphs, setVisibleGraphs] = useState({
        caloriesGraph: true,
        activityCountGraph: true,
        weightLineGraph: true,
    });

    const [timeframe, setTimeframe] = useState('1Y');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/fitness-data');
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

    const filterDataByTimeframe = (data, timeframe) => {
        const now = new Date();
        let startDate;
        switch (timeframe) {
            case '1D':
                startDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
                break;
            case '7D':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
                break;
            case '1M':
                startDate = new Date(new Date().setMonth(now.getMonth() - 1)); // 1 month ago
                break;
            case '6M':
                startDate = new Date(new Date().setMonth(now.getMonth() - 6)); // 6 months ago
                break;
            case 'YTD':
                startDate = new Date(now.getFullYear(), 0, 1); // January 1st of the current year
                break;
            case '1Y':
                startDate = new Date(new Date().setFullYear(now.getFullYear() - 1)); // 1 year ago
                break;
            case '5Y':
                startDate = new Date(new Date().setFullYear(now.getFullYear() - 5)); // 5 years ago
                break;
            case '10Y':
                startDate = new Date(new Date().setFullYear(now.getFullYear() - 10)); // 10 years ago
                break;
            default:
                startDate = new Date(0); // Default to the earliest possible date
        }
    
        return data.filter((entry) => new Date(entry.date) >= startDate);
    }

    console.log('Fitness Data:', fitnessData);

    const filteredFitnessData = filterDataByTimeframe(fitnessData, timeframe);

    const analyzeCalories = () => {
        return filteredFitnessData.reduce((acc, entry) => {
            if (entry.type === 'Weight') return acc;
            acc[entry.type] = (acc[entry.type] || 0) + (entry.calories || 0);
            return acc;
        }, {});
    };

    const caloriesBarData = {
        labels: Object.keys(analyzeCalories()),
        datasets: [
            {
                label: `Calories Burned (${timeframe})`,
                data: Object.values(analyzeCalories()),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const analyzeActivityCounts = () => {
        return filteredFitnessData.reduce((acc, entry) => {
            if (entry.type === 'Weight') return acc;
            acc[entry.type] = (acc[entry.type] || 0) + 1;
            return acc;
        }, {});
    };

    const activityCountsData = {
        labels: Object.keys(analyzeActivityCounts()),
        datasets: [
            {
                label: `Activity Counts (${timeframe})`,
                data: Object.values(analyzeActivityCounts()),
                backgroundColor: 'rgba(75, 112, 192, 0.4)',
                borderColor: 'rgb(75, 75, 192)',
                borderWidth: 1,
            }
        ]
    };

    const analyzeWeight = () => {
        console.log('Filtered Fitness Data:', filteredFitnessData);
        return filteredFitnessData
            .filter((entry) => entry.type === 'Weight')
            .sort((a,b) => new Date(a.date) - new Date(b.date));
    };

    const weightAnalysis = analyzeWeight();
    console.log('Weight Analysis:', weightAnalysis);

    const weightData = {
        labels: weightAnalysis.map((entry) => new Date(entry.date).toLocaleDateString()),
        datasets: [
            {
                label: `Weight`,
                data: weightAnalysis.map((entry) => ({
                    x: entry.date,
                    y: entry.weight,
                })),
                backgroundColor: 'rgba(65, 235, 50, 0.4)',
                borderColor: 'rgb(55, 185, 94)',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
            }
        ]
    }

    const weightOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weight Trend',
            },
        },
        scales: {
            x: {
                type: 'time', // Sets the x-axis to interpret values as dates
                time: {
                    parser: 'yyyy-MM-dd',
                    tooltipFormat: 'MMM d, yyyy', // Tooltip format
                    unit: 'day',
                    displayFormats: {
                        day: 'MM/d/yy', // Display day-level ticks as "Jan 3"
                        week: 'MM/d/yy', // Weekly view, same as day for simplicity
                        month: 'MMM yyyy', // Month-level ticks as "Jan 2025"
                        year: 'yyyy', // Year-level ticks as "2025"
                    }
                },
                title: {
                    display: true,
                    text: 'Date',
                },
                ticks: {
                    autoSkip: true, // Skip overlapping labels
                    maxTicksLimit: 12, // Limit the number of ticks
                },
                min: weightAnalysis.length > 0 ? weightAnalysis[0].date : undefined,
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight (lbs)',
                },
            },
        },
    };

    return (
        <div>
            <FormControl 
                variant="outlined" 
                sx={{ marginTop: '10px', marginBottom: '10px', marginLeft: '10px', width: '200px' }}
            >
                <InputLabel id="timeframe-label">Timeframe</InputLabel>
                <Select
                    labelId="timeframe-label"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    label="Timeframe" // This associates the label with the Select component
                >
                    {timeframes.map((frame) => (
                        <MenuItem key={frame} value={frame}>
                            {frame}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div>
                {Object.entries(visibleGraphs).map(([graphKey, visible]) => (
                    <FormControlLabel sx= {{marginLeft: '10px'}}
                        key={graphKey}
                        control={
                            <Checkbox
                                checked={visible}
                                onChange={() => toggleGraph(graphKey)}
                            />
                        }
                        label={
                            {
                                caloriesGraph: 'Calories Burned',
                                activityCountGraph: 'Activity Counts',
                                weightLineGraph: 'Weight Trend',
                            }[graphKey]
                        }
                    />
                ))}
            </div>

            {visibleGraphs.caloriesGraph && (
                <Card sx={{ }}>
                    <CardContent>
                        <Typography variant="h6">Calories Burned</Typography>
                        <Bar data={caloriesBarData} />
                    </CardContent>
                </Card>
            )}

            {visibleGraphs.activityCountGraph && (
                <Card sx={{ }}>
                    <CardContent>
                        <Typography variant="h6">Activity Counts</Typography>
                        <Bar data={activityCountsData} />
                    </CardContent>
                </Card>
            )}

            {visibleGraphs.weightLineGraph && (
                <Card sx={{ }}>
                    <CardContent>
                        <Typography variant="h6">Weight</Typography>
                        <Line data={weightData} options={weightOptions} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}