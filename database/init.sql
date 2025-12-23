-- ═══════════════════════════════════════════
-- Smart Plant Database Schema
-- TimescaleDB Extension
-- ═══════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ═══════════════════════════════════════════
-- Users Table
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════
-- Devices Table
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════
-- Sensor Data Table - AŽURIRANO
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    temperature FLOAT,
    soil_moisture INTEGER,
    water_level INTEGER,        -- Senzor količine tečnosti
    light_level INTEGER,        -- LDR fotootpornik
    humidity INTEGER,           -- Vlažnost zraka (simulirana)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ═══════════════════════════════════════════
-- TimescaleDB Hypertable
-- ═══════════════════════════════════════════
SELECT create_hypertable('sensor_data', 'timestamp', if_not_exists => TRUE);

-- ═══════════════════════════════════════════
-- Indexes za Performanse
-- ═══════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_sensor_data_device_id ON sensor_data(device_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC);

-- ═══════════════════════════════════════════
-- Seed Data - Default ESP32 Device
-- ═══════════════════════════════════════════
INSERT INTO devices (device_id, name, location) 
VALUES ('ESP32_SmartPlant', 'Smart Plant Main', 'Living Room')
ON CONFLICT (device_id) DO NOTHING;

-- ═══════════════════════════════════════════
-- View za Najnovije Podatke
-- ═══════════════════════════════════════════
CREATE OR REPLACE VIEW latest_sensor_data AS
SELECT DISTINCT ON (device_id) 
    device_id,
    temperature,
    soil_moisture,
    water_level,        -- ✅ NOVO
    light_level,
    timestamp
FROM sensor_data
ORDER BY device_id, timestamp DESC;

-- ═══════════════════════════════════════════
-- Permissions
-- ═══════════════════════════════════════════
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smartplant;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smartplant;

-- ═══════════════════════════════════════════
-- Comments
-- ═══════════════════════════════════════════
COMMENT ON TABLE sensor_data IS 'TimescaleDB hypertable for sensor data storage - Updated for new sensors';
COMMENT ON TABLE devices IS 'ESP32 device management table';
COMMENT ON TABLE users IS 'System users table';
COMMENT ON COLUMN sensor_data.water_level IS 'Water reservoir level (0-100%)';
COMMENT ON COLUMN sensor_data.light_level IS 'Light level from LDR photoresistor (0-100%)';