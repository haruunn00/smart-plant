import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SensorChart({ sensors, dataKey, label, color }) {
  if (!sensors || sensors.length === 0) {
    return <div className="chart-placeholder">Nema dostupnih podataka</div>;
  }

  // Pripremi podatke za grafikon (obrni poredak za kronološki prikaz)
  const sortedSensors = [...sensors].reverse();
  
  // Convert RGB to RGBA for background color
  const backgroundColor = color.includes('rgb(') 
    ? color.replace('rgb(', 'rgba(').replace(')', ', 0.2)')
    : color + '20';
  
  const data = {
    labels: sortedSensors.map((sensor) => {
      const date = new Date(sensor.timestamp);
      return date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [
      {
        label: label,
        data: sortedSensors.map((sensor) => sensor[dataKey]),
        borderColor: color,
        backgroundColor: backgroundColor,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: label,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}
