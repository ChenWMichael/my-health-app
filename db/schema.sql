DROP TABLE IF EXISTS fitness_data;

CREATE TABLE fitness_data (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    distance REAL,
    elevation REAL,
    weight REAL,
    time_of_day TEXT,
    level TEXT,
    count INTEGER,
    time INTEGER,
    calories INTEGER,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fitness_type_date ON fitness_data (type, date);