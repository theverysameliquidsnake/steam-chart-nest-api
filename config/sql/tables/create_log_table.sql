CREATE TABLE log (
    id SERIAL PRIMARY KEY,
    related_to INTEGER,
    level VARCHAR(10),
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);