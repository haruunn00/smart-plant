import React from 'react';
import { useLatestSensor, useSensorStats } from '../hooks/useSensors';

export default function Dashboard({ deviceId = null }) {
  const { sensor, isLoading: sensorLoading, isError: sensorError } = useLatestSensor(deviceId);
  const { stats, isLoading: statsLoading } = useSensorStats(deviceId, 24);

  if (sensorLoading) {
    return <div className="loading">Učitavanje podataka...</div>;
  }

  if (sensorError) {
    return <div className="error">Greška pri učitavanju podataka</div>;
  }

  if (!sensor) {
    return <div className="no-data">Nema dostupnih podataka</div>;
  }

  const getStatusClass = (value, min, max) => {
    if (value < min) return 'status-low';
    if (value > max) return 'status-high';
    return 'status-good';
  };

  return (
    <div className="dashboard">
      <h1>Smart Plant Dashboard</h1>
      
      <div className="sensor-grid">
        <div className="sensor-card">
          <div className="sensor-icon">🌡️</div>
          <div className="sensor-label">Temperatura</div>
          <div className={`sensor-value ${getStatusClass(sensor.temperature, 18, 28)}`}>
            {sensor.temperature.toFixed(1)}°C
          </div>
          {stats && (
            <div className="sensor-stats">
              Prosjek: {stats.avg_temperature?.toFixed(1)}°C
            </div>
          )}
        </div>

        <div className="sensor-card">
          <div className="sensor-icon">💧</div>
          <div className="sensor-label">Vlažnost zraka</div>
          <div className={`sensor-value ${getStatusClass(sensor.humidity, 40, 70)}`}>
            {sensor.humidity.toFixed(1)}%
          </div>
          {stats && (
            <div className="sensor-stats">
              Prosjek: {stats.avg_humidity?.toFixed(1)}%
            </div>
          )}
        </div>

        <div className="sensor-card">
          <div className="sensor-icon">🌱</div>
          <div className="sensor-label">Vlažnost tla</div>
          <div className={`sensor-value ${getStatusClass(sensor.soil_moisture, 30, 70)}`}>
            {sensor.soil_moisture}%
          </div>
          {stats && (
            <div className="sensor-stats">
              Prosjek: {stats.avg_soil_moisture?.toFixed(0)}%
            </div>
          )}
        </div>

        <div className="sensor-card">
          <div className="sensor-icon">☀️</div>
          <div className="sensor-label">Svjetlost</div>
          <div className={`sensor-value ${getStatusClass(sensor.light_level, 200, 1000)}`}>
            {sensor.light_level.toFixed(0)} lux
          </div>
          {stats && (
            <div className="sensor-stats">
              Prosjek: {stats.avg_light_level?.toFixed(0)} lux
            </div>
          )}
        </div>

        <div className="sensor-card">
          <div className="sensor-icon">🌀</div>
          <div className="sensor-label">Tlak</div>
          <div className="sensor-value">
            {sensor.pressure.toFixed(1)} hPa
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-icon">🕐</div>
          <div className="sensor-label">Posljednje ažuriranje</div>
          <div className="sensor-value sensor-time">
            {new Date(sensor.timestamp).toLocaleString('hr-HR')}
          </div>
        </div>
      </div>
    </div>
  );
}
