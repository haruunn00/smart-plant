CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    temperature FLOAT,
    soil_moisture INTEGER,
    water_level INTEGER,        
    light_level INTEGER,       
    humidity INTEGER,           
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

SELECT create_hypertable('sensor_data', 'timestamp', if_not_exists => TRUE);


CREATE INDEX IF NOT EXISTS idx_sensor_data_device_id ON sensor_data(device_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC);


INSERT INTO devices (device_id, name, location) 
VALUES ('ESP32_SmartPlant', 'Smart Plant Main', 'Living Room')
ON CONFLICT (device_id) DO NOTHING;


CREATE OR REPLACE VIEW latest_sensor_data AS
SELECT DISTINCT ON (device_id) 
    device_id,
    temperature,
    soil_moisture,
    water_level,    
    light_level,
    timestamp
FROM sensor_data
ORDER BY device_id, timestamp DESC;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smartplant;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smartplant;


COMMENT ON TABLE sensor_data IS 'TimescaleDB hypertable for sensor data storage - Updated for new sensors';
COMMENT ON TABLE devices IS 'ESP32 device management table';
COMMENT ON TABLE users IS 'System users table';
COMMENT ON COLUMN sensor_data.water_level IS 'Water reservoir level (0-100%)';
COMMENT ON COLUMN sensor_data.light_level IS 'Light level from LDR photoresistor (0-100%)';