BEGIN TRANSACTION;
CREATE TABLE fitness_data (
    id SERIAL PRIMARY KEY,
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
INSERT INTO fitness_data VALUES(1,'Weight',NULL,NULL,165.0,'night',NULL,NULL,NULL,NULL,'2025-01-14','','2025-01-15 06:17:29');
INSERT INTO fitness_data VALUES(2,'Weight',NULL,NULL,163.0,'morning',NULL,NULL,NULL,NULL,'2025-01-15','','2025-01-15 20:32:40');
INSERT INTO fitness_data VALUES(3,'Jump Rope',NULL,NULL,NULL,NULL,NULL,1800,NULL,150,'2025-01-14','','2025-01-15 20:39:07');
CREATE INDEX idx_fitness_type_date ON fitness_data (type, date);
COMMIT;
