import { useState, useEffect } from 'react';
import { Droplets, Thermometer, Sun, Activity, Power, AlertCircle } from 'lucide-react';

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lightLevel: number;
  pumpActive: boolean;
  lastUpdate: Date;
}

export function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 45,
    temperature: 22.5,
    humidity: 65,
    lightLevel: 72,
    pumpActive: false,
    lastUpdate: new Date(),
  });

  const [isWatering, setIsWatering] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        temperature: Math.max(18, Math.min(30, prev.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        lightLevel: Math.max(0, Math.min(100, prev.lightLevel + (Math.random() - 0.5) * 5)),
        lastUpdate: new Date(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleWaterPlant = async () => {
    setIsWatering(true);
    setSensorData(prev => ({ ...prev, pumpActive: true }));
    
    // Simulate watering duration
    setTimeout(() => {
      setIsWatering(false);
      setSensorData(prev => ({ 
        ...prev, 
        pumpActive: false,
        soilMoisture: Math.min(100, prev.soilMoisture + 15)
      }));
    }, 5000);
  };

  const getStatusColor = (value: number, type: string) => {
    if (type === 'moisture') {
      if (value < 30) return 'text-red-600';
      if (value < 50) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'temperature') {
      if (value < 18 || value > 28) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-green-600';
  };

  const getSensorStatus = () => {
    if (sensorData.soilMoisture < 30) {
      return { message: 'Low soil moisture - watering recommended', color: 'bg-red-50 border-red-200 text-red-800' };
    }
    if (sensorData.temperature > 28) {
      return { message: 'Temperature is high - consider moving to cooler location', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' };
    }
    if (sensorData.lightLevel < 30) {
      return { message: 'Low light levels - plant may need more sunlight', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' };
    }
    return { message: 'All systems optimal - plant is healthy!', color: 'bg-green-50 border-green-200 text-green-800' };
  };

  const status = getSensorStatus();

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${status.color}`}>
        <AlertCircle className="w-5 h-5 mt-0.5" />
        <div>
          <p>{status.message}</p>
          <p className="text-sm opacity-75 mt-1">
            Last update: {sensorData.lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Soil Moisture */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-2xl ${getStatusColor(sensorData.soilMoisture, 'moisture')}`}>
              {sensorData.soilMoisture.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Soil Moisture</h3>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-500"
              style={{ width: `${sensorData.soilMoisture}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Thermometer className="w-6 h-6 text-orange-600" />
            </div>
            <span className={`text-2xl ${getStatusColor(sensorData.temperature, 'temperature')}`}>
              {sensorData.temperature.toFixed(1)}°C
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Temperature</h3>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-500"
              style={{ width: `${(sensorData.temperature / 40) * 100}%` }}
            />
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-50 rounded-lg">
              <Activity className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-2xl text-green-600">
              {sensorData.humidity.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Air Humidity</h3>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-400 to-teal-600 h-full transition-all duration-500"
              style={{ width: `${sensorData.humidity}%` }}
            />
          </div>
        </div>

        {/* Light Level */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl text-green-600">
              {sensorData.lightLevel.toFixed(0)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm">Light Level</h3>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-500"
              style={{ width: `${sensorData.lightLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl text-gray-800 mb-4">Manual Controls</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${sensorData.pumpActive ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <Power className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-800">Water Pump</p>
              <p className="text-sm text-gray-600">
                Status: {sensorData.pumpActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          <button
            onClick={handleWaterPlant}
            disabled={isWatering}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
              isWatering
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            <Droplets className="w-5 h-5" />
            {isWatering ? 'Watering...' : 'Water Plant'}
          </button>
        </div>
        {isWatering && (
          <div className="mt-4 bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="text-blue-800 text-sm">Watering in progress... Pump will run for 5 seconds</p>
          </div>
        )}
      </div>

      {/* Live Data Feed */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl text-gray-800 mb-4">Live Sensor Feed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">ESP32 Status</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-600">Connected</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">WiFi Signal</p>
            <p className="text-gray-800 mt-2">Strong</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">Data Rate</p>
            <p className="text-gray-800 mt-2">3s</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">Uptime</p>
            <p className="text-gray-800 mt-2">24h 32m</p>
          </div>
        </div>
      </div>
    </div>
  );
}