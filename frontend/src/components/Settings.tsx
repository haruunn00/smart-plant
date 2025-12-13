import { useState } from 'react';
import { Save, Bell, Droplets, Thermometer, Sun, Wifi, RefreshCw, Database } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    // Thresholds
    moistureMin: 30,
    moistureMax: 70,
    tempMin: 18,
    tempMax: 28,
    lightMin: 30,
    
    // Watering
    wateringDuration: 5,
    autoWatering: true,
    
    // Notifications
    notifications: true,
    emailAlerts: false,
    
    // System
    updateInterval: 3,
    dataRetention: 30,
    
    // WiFi
    wifiSSID: 'SmartPlant_Network',
    apiEndpoint: 'https://api.smartplant.local',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    // In a real application, this would send settings to the backend
    console.log('Saving settings:', settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        moistureMin: 30,
        moistureMax: 70,
        tempMin: 18,
        tempMax: 28,
        lightMin: 30,
        wateringDuration: 5,
        autoWatering: true,
        notifications: true,
        emailAlerts: false,
        updateInterval: 3,
        dataRetention: 30,
        wifiSSID: 'SmartPlant_Network',
        apiEndpoint: 'https://api.smartplant.local',
      });
      setIsSaved(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl text-gray-800">Settings</h1>
          <p className="text-gray-600 text-sm mt-1">Configure your Smart Plant system</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Sensor Thresholds */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl text-gray-800">Sensor Thresholds</h2>
        </div>

        <div className="space-y-6">
          {/* Soil Moisture */}
          <div>
            <label className="text-gray-700 mb-2 block">
              Soil Moisture Range (%)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm mb-1 block">Minimum</label>
                <input
                  type="number"
                  value={settings.moistureMin}
                  onChange={(e) => handleChange('moistureMin', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm mb-1 block">Maximum</label>
                <input
                  type="number"
                  value={settings.moistureMax}
                  onChange={(e) => handleChange('moistureMax', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Watering will trigger when moisture falls below minimum
            </p>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-gray-700 mb-2 block flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-600" />
              Temperature Range (°C)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm mb-1 block">Minimum</label>
                <input
                  type="number"
                  value={settings.tempMin}
                  onChange={(e) => handleChange('tempMin', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm mb-1 block">Maximum</label>
                <input
                  type="number"
                  value={settings.tempMax}
                  onChange={(e) => handleChange('tempMax', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Alerts will be triggered outside this range
            </p>
          </div>

          {/* Light Level */}
          <div>
            <label className="text-gray-700 mb-2 block flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-600" />
              Minimum Light Level (%)
            </label>
            <input
              type="number"
              value={settings.lightMin}
              onChange={(e) => handleChange('lightMin', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="0"
              max="100"
            />
            <p className="text-gray-500 text-sm mt-2">
              Alert when light level falls below this value
            </p>
          </div>
        </div>
      </div>

      {/* Watering Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Droplets className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl text-gray-800">Watering Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-gray-700 mb-2 block">
              Watering Duration (seconds)
            </label>
            <input
              type="number"
              value={settings.wateringDuration}
              onChange={(e) => handleChange('wateringDuration', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="1"
              max="60"
            />
            <p className="text-gray-500 text-sm mt-2">
              How long the pump runs during each watering cycle
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-800">Automatic Watering</p>
              <p className="text-gray-600 text-sm">Enable automatic watering based on soil moisture</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoWatering}
                onChange={(e) => handleChange('autoWatering', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-xl text-gray-800">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-800">Browser Notifications</p>
              <p className="text-gray-600 text-sm">Receive alerts in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-800">Email Alerts</p>
              <p className="text-gray-600 text-sm">Receive critical alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Database className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-xl text-gray-800">System Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-gray-700 mb-2 block">
              Data Update Interval (seconds)
            </label>
            <select
              value={settings.updateInterval}
              onChange={(e) => handleChange('updateInterval', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>1 second</option>
              <option value={3}>3 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
            </select>
            <p className="text-gray-500 text-sm mt-2">
              How often sensor data is collected and sent
            </p>
          </div>

          <div>
            <label className="text-gray-700 mb-2 block">
              Data Retention Period (days)
            </label>
            <input
              type="number"
              value={settings.dataRetention}
              onChange={(e) => handleChange('dataRetention', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="7"
              max="365"
            />
            <p className="text-gray-500 text-sm mt-2">
              How long to keep historical data in the database
            </p>
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wifi className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl text-gray-800">Network Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-gray-700 mb-2 block">
              WiFi SSID
            </label>
            <input
              type="text"
              value={settings.wifiSSID}
              onChange={(e) => handleChange('wifiSSID', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Network name"
            />
          </div>

          <div>
            <label className="text-gray-700 mb-2 block">
              API Endpoint
            </label>
            <input
              type="text"
              value={settings.apiEndpoint}
              onChange={(e) => handleChange('apiEndpoint', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://api.smartplant.local"
            />
            <p className="text-gray-500 text-sm mt-2">
              Backend API server address
            </p>
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl text-gray-800 mb-4">Device Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-600">Device ID:</span>
            <span className="text-gray-800">ESP32-001</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-600">Firmware Version:</span>
            <span className="text-gray-800">v1.2.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-600">IP Address:</span>
            <span className="text-gray-800">192.168.1.100</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-gray-600">MAC Address:</span>
            <span className="text-gray-800">AA:BB:CC:DD:EE:FF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
