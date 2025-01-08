import { faker } from '@faker-js/faker';

export const generateAllMockData = () => {
    const runningData = generateRunningData(15);
    const pickleData = generatePickleData(15);
    const badmintonData = generateBadmintonData(15);
    const hikingData = generateHikingData(15);
    const jumpingData = generateJumpingData(15);
    const otherData = generateOtherData(15);
    const weightData = generateWeightData(15);

    return [...runningData, ...pickleData, ...badmintonData, ...hikingData, ...jumpingData, ...otherData, ...weightData];
};

export const generateRunningData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `running-${faker.string.uuid()}`,
        type: 'Running',
        distance: parseFloat((Math.random() * 10).toFixed(2)), // Miles
        elevation: null,
        weight: null,
        tod: null,
        level: null,
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generatePickleData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `pickle-${faker.string.uuid()}`,
        type: 'Pickleball',
        distance: null,
        elevation: null,
        weight: null,
        tod: null,
        level: parseFloat((Math.random() * (3.0) + 2.0).toFixed(1)),
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generateBadmintonData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `badminton-${faker.string.uuid()}`,
        type: 'Badminton',
        distance: null,
        elevation: null,
        weight: null,
        tod: null,
        level: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)],
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generateHikingData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `hiking-${faker.string.uuid()}`,
        type: 'Hiking',
        distance: parseFloat((Math.random() * 10).toFixed(2)),
        elevation: Math.floor(Math.random() * 1000),
        weight: null,
        tod: null,
        level: '',
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generateJumpingData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `jump-${faker.string.uuid()}`,
        type: 'Jump Roping',
        distance: parseFloat((Math.random() * 10).toFixed(2)),
        elevation: Math.floor(Math.random() * 1000),
        weight: null,
        tod: null,
        level: '',
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generateOtherData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `other-${faker.string.uuid()}`,
        type: 'Other',
        distance: null,
        elevation: null,
        weight: null,
        tod: null,
        level: '',
        count: null,
        time: Math.floor(Math.random() * 120) + 10, // Minutes
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: Math.floor(Math.random() * 500) + 100, // Calories
        notes: faker.lorem.sentence(),
    }));
};

export const generateWeightData = (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `weight-${faker.string.uuid()}`,
        type: 'Weight',
        distance: null,
        elevation: null,
        weight: parseFloat((Math.random() * 50 + 100).toFixed(2)), // Pounds
        tod: ['Morning', 'Afternoon', 'Night'][Math.floor(Math.random() * 3)],
        level: null,
        count: null,
        time: null,
        date: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }).toISOString(),
        calories: null,
        notes: faker.lorem.sentence(),
    }));
};