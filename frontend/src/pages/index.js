import React from 'react';
import Dashboard from '../components/Dashboard';
import SensorChart from '../components/SensorChart';
import ControlPanel from '../components/ControlPanel';
import { useSensors } from '../hooks/useSensors';

export default function Home() {
  const { sensors, isLoading, isError } = useSensors(null, 24);

  return (
    <div className="container">
      <header className="header">
        <h1>🌱 Smart Plant IoT System</h1>
        <p>Inteligentno praćenje i održavanje biljaka</p>
      </header>

      <main className="main">
        <Dashboard />
        
        <div className="section">
          <ControlPanel />
        </div>

        {!isLoading && !isError && sensors.length > 0 && (
          <div className="section">
            <h2>Grafički prikaz podataka (24h)</h2>
            <div className="charts-grid">
              <SensorChart
                sensors={sensors}
                dataKey="temperature"
                label="Temperatura (°C)"
                color="rgb(255, 99, 132)"
              />
              <SensorChart
                sensors={sensors}
                dataKey="humidity"
                label="Vlažnost zraka (%)"
                color="rgb(54, 162, 235)"
              />
              <SensorChart
                sensors={sensors}
                dataKey="soil_moisture"
                label="Vlažnost tla (%)"
                color="rgb(75, 192, 192)"
              />
              <SensorChart
                sensors={sensors}
                dataKey="light_level"
                label="Razina svjetlosti (lux)"
                color="rgb(255, 206, 86)"
              />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Smart Plant IoT System © 2024</p>
      </footer>
    </div>
  );
}
