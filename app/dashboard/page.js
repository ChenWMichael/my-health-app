'use client';
import { React, useState, useEffect } from 'react';
import { Card, CardContent, Typography, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, TimeScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-luxon';


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, TimeScale, Title, Tooltip, Legend);

const timeframes = ['1D', '7D', '1M', '6M', 'YTD', '1Y', '5Y', '10Y', 'All']

export default function Dashboard() {
    const [fitnessData, setFitnessData] = useState([]);
    const [visibleGraphs, setVisibleGraphs] = useState({
        caloriesGraph: { visible: true, filters: { activityType: 'All' } },
        activityCountGraph: { visible: true, filters: { activityType: 'All' } },
        weightLineGraph: { visible: true, filters: { timeOfDay: 'All' } },
    });

    const [timeframe, setTimeframe] = useState('1Y');

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await fetch('/api/fitness-data');
            const data = await response.json();
            setFitnessData(data);
        }, 200);
    
        return () => clearInterval(interval);
    }, []);

    const toggleGraph = (graphKey) => {
        setVisibleGraphs((prev) => ({
            ...prev,
            [graphKey]: {
                ...prev[graphKey],
                visible: !prev[graphKey].visible,
            },
        }));
    };

    const updateGraphFilter = (graphKey, filterKey, value) => {
        setVisibleGraphs((prev) => ({
            ...prev,
            [graphKey]: {
                ...prev[graphKey],
                filters: {
                    [filterKey] : value,
                },
            },
        }));
    };

    const filterDataByTimeframe = (data, timeframe) => {
        if (!Array.isArray(data)) {
            return [];
        }
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
            case 'All':
                startDate = new Date(0);
                break;
            default:
                startDate = new Date(0); // Default to the earliest possible date
        }
    
        return data.filter((entry) => new Date(entry.date) >= startDate);
    }

    const calculateAnnualStats = (data) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentYearData = Array.isArray(data)
            ? data.filter((entry) => {
                const entryYear = new Date(entry.date).getFullYear();
                return entryYear === currentYear;
            })
            : [];
        const startOfYear = new Date(currentYear, 0, 1);
        const daysElapsed = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24));

        const totalCalories = currentYearData.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        const avgCalories = (totalCalories / daysElapsed).toFixed(1);

        const weightEntries = currentYearData.filter((entry) => entry.type === 'Weight');
        const averageWeight =
            weightEntries.reduce((sum, entry) => sum + entry.weight, 0) /
            (weightEntries.length || 1);

        const lowestWeight = Math.min(...weightEntries.map((entry) => entry.weight));

        const sortedWeightEntries = weightEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstWeightEntry = sortedWeightEntries.length > 0 ? sortedWeightEntries[0] : null;
        const lastWeightEntry = sortedWeightEntries.length > 0 ? sortedWeightEntries[sortedWeightEntries.length-1] : null;

        const deltaWeight = lastWeightEntry && firstWeightEntry
            ? (lastWeightEntry.weight - firstWeightEntry.weight).toFixed(1)
            : null;

        const popularActivity = currentYearData.reduce((acc, entry) => {
            if (entry.type === 'Weight') return acc;
            acc[entry.type] = (acc[entry.type] || 0) + 1;
            return acc;
        }, {});

        const mostPopularActivity = Object.entries(popularActivity).reduce((maxEntry, currentEntry) => {
            return currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry;
        }, ['', -Infinity]);

        const ranMap = currentYearData.filter((entry) => entry.type === 'Running');
        const totalDistanceRan = ranMap.reduce((sum, entry) => sum + (entry.distance || 0), 0);

        return {
            currentYear,
            avgCalories,
            averageWeight: averageWeight.toFixed(1),
            deltaWeight,
            lowestWeight: lowestWeight.toFixed(1),
            mostPopularActivity,
            totalDistanceRan,
        };
    }

    const formatActivityName = (activityName) => {
        const nameMappings = {
            JumpRope: 'Jump Rope',
        };
        return nameMappings[activityName] || activityName;
    };

    const AnnualStats = ({ data }) => {
        const { 
            currentYear, 
            avgCalories, 
            averageWeight, 
            deltaWeight,
            lowestWeight,
            mostPopularActivity,
            totalDistanceRan,
        } = calculateAnnualStats(data);
        return (
            <div style={{ marginTop: '5px' }}>
            <Typography variant="h5" align="center" gutterBottom>
                {currentYear} Summary
            </Typography>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center', justifyContent: 'center' }}>
                    <Card sx={{ display: 'flex', alignItems: 'center', height: '65px'}}>
                        <CardContent sx={{ textAlign: 'center'}}>
                            <Typography>Average Weight</Typography>
                            <Typography variant="h5">{averageWeight} lbs</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', alignItems: 'center', height: '65px'}}>
                        <CardContent>
                            <Typography variant="h6">∆ Weight</Typography>
                            <Typography variant="h5">
                                {deltaWeight ? `${deltaWeight > 0 ? '+' : ''}${deltaWeight} lbs` : 'N/A'}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', alignItems: 'center', height: '65px'}}>
                        <CardContent>
                            <Typography variant="h6">Lowest Weight</Typography>
                            <Typography variant="h5">{lowestWeight} lbs</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', alignItems: 'center', height: '65px'}}>
                        <CardContent sx={{ textAlign: 'center'}}>
                            <Typography>Most Popular Activity</Typography>
                            <Typography variant="h5">{formatActivityName(mostPopularActivity[0])}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', alignItems: 'center', height: '65px'}}>
                        <CardContent sx={{ textAlign: 'center'}}>
                            <Typography>Average Calories Burned / Day</Typography>
                            <Typography variant="h5">{avgCalories}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ display: 'flex', alignItems: 'center', height: '65px'}}>
                        <CardContent sx={{ textAlign: 'center'}}>
                            <Typography>Total Distance Ran</Typography>
                            <Typography variant="h5">{totalDistanceRan}</Typography>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    // console.log('Fitness Data:', fitnessData);
    const filteredFitnessData = filterDataByTimeframe(fitnessData, timeframe);

    const analyzeCalories = () => {
        const { activityType } = visibleGraphs.caloriesGraph.filters;
        const filteredData =
            activityType === 'All'
                ? filteredFitnessData
                : filteredFitnessData.filter((entry) => entry.type === activityType);
        return filteredData.reduce((acc, entry) => {
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
        const timeOfDayFilter = visibleGraphs.weightLineGraph.filters.timeOfDay;
    
        const filteredData = filteredFitnessData
            .filter((entry) => entry.type === 'Weight')
            .filter((entry) => timeOfDayFilter === 'All' || entry.time_of_day === timeOfDayFilter.toLowerCase())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    
        return filteredData;
    };

    const calculateTrendline = (data) => {
        if (data.length < 2) return [];
    
        const x = data.map((entry) => new Date(entry.date).getTime());
        const y = data.map((entry) => entry.weight);
    
        const xMin = Math.min(...x);
        const normalizedX = x.map((xi) => xi - xMin);
    
        const n = normalizedX.length;
        const xSum = normalizedX.reduce((sum, xi) => sum + xi, 0);
        const ySum = y.reduce((sum, yi) => sum + yi, 0);
        const xySum = normalizedX.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const xSquaredSum = normalizedX.reduce((sum, xi) => sum + xi * xi, 0);
    
        const m = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
        const b = (ySum - m * xSum) / n;
    
        return normalizedX.map((xi, i) => ({
            x: new Date(xi + xMin).toISOString().split('T')[0], // Match `weightData` format
            y: m * xi + b,
        }));
    };

    const weightAnalysis = analyzeWeight();
    // console.log('Weight Analysis:', weightAnalysis);
    const trendline = calculateTrendline(weightAnalysis);

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
            },
            {
                label: 'Trend Line',
                data: trendline,
                borderColor: 'rgba(255, 99, 132, 0.8)', // Trendline color
                borderWidth: 2,
                pointRadius: 0, // No points on the trendline
                fill: false,
            },
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
        <div style = {{ marginTop: '10px' }} >
            <AnnualStats data={fitnessData} />
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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                {Object.entries(visibleGraphs).map(([graphKey, { visible, filters }]) => (
                    <div key={graphKey}>
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
                                    caloriesGraph: 'Calories Burned by Activity',
                                    activityCountGraph: 'Count of Activities',
                                    weightLineGraph: 'Weight',
                                }[graphKey]
                            }
                        />
                        {visible && graphKey === 'caloriesGraph' && (
                            <FormControl sx={{ width: '200px', marginLeft: '10px' }}>
                                <InputLabel id="calories-activity-label">Activity Type</InputLabel>
                                <Select
                                    labelId="calories-activity-label"
                                    value={filters.activityType}
                                    onChange={(e) =>
                                        updateGraphFilter(graphKey, 'activityType', e.target.value)
                                    }
                                    label='Activity Type'
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Badminton">Badminton</MenuItem>
                                    <MenuItem value="Hiking">Hiking</MenuItem>
                                    <MenuItem value="Jump Rope">Jump Rope</MenuItem>
                                    <MenuItem value="Pickleball">Pickleball</MenuItem>
                                    <MenuItem value="Running">Running</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {visible && graphKey === 'weightLineGraph' && (
                            <FormControl sx={{ width: '200px', marginLeft: '10px' }}>
                                <InputLabel id="weight-time-label">Time of Day</InputLabel>
                                <Select
                                    labelId="weight-time-label"
                                    value={filters.timeOfDay}
                                    onChange={(e) =>
                                        updateGraphFilter(graphKey, 'timeOfDay', e.target.value)
                                    }
                                    label='Time of Day'
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Morning">Morning</MenuItem>
                                    <MenuItem value="Afternoon">Afternoon</MenuItem>
                                    <MenuItem value="Night">Night</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </div>
                ))}
            </div>

            {visibleGraphs.caloriesGraph.visible && (
                <Card sx={{ }}>
                    <CardContent>
                        <Typography variant="h6">Calories Burned</Typography>
                        <Bar data={caloriesBarData} />
                    </CardContent>
                </Card>
            )}

            {visibleGraphs.activityCountGraph.visible && (
                <Card sx={{ }}>
                    <CardContent>
                        <Typography variant="h6">Activity Counts</Typography>
                        <Bar data={activityCountsData} />
                    </CardContent>
                </Card>
            )}

            {visibleGraphs.weightLineGraph.visible && (
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