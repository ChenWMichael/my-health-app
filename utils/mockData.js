import { faker } from '@faker-js/faker';

export const generateAllMockData = () => {
    const runningData = generateRunningData(15);
    const weightData = generateWeightData(15);

    return [...runningData, ...weightData];
};

export const generateRunningData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `running-${faker.datatype.uuid()}`,
        type: 'Running',
        distance: parseFloat((Math.random() * 10).toFixed(2)), // Miles
        elevation: null,
        weight: null,
        tod: null,
        level: null,
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between('2024-01-01', '2024-12-31').toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generatePickleData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `pickle-${faker.datatype.uuid()}`,
        type: 'Pickleball',
        distance: parseFloat((Math.random() * 10).toFixed(2)), // Miles
        elevation: null,
        weight: null,
        tod: null,
        level: null,
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between('2024-01-01', '2024-12-31').toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generateWeightData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `weight-${faker.datatype.uuid()}`,
        type: 'Weight',
        distance: null,
        elevation: null,
        weight: parseFloat((Math.random() * 50 + 100).toFixed(2)), // Pounds
        tod: ['Morning', 'Afternoon', 'Night'][Math.floor(Math.random() * 3)],
        level: null,
        count: null,
        time: null,
        date: faker.date.between('2024-01-01', '2024-12-31').toISOString(),
        calories: null,
        notes: faker.lorem.sentence(),
    }));
};