import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Download } from 'lucide-react';

type TimeRange = '24h' | '7d' | '30d';

export function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  // Generate mock historical data
  const generateData = (range: TimeRange) => {
    const points = range === '24h' ? 24 : range === '7d' ? 7 : 30;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const baseTime = new Date();
      if (range === '24h') {
        baseTime.setHours(baseTime.getHours() - (points - i));
      } else if (range === '7d') {
        baseTime.setDate(baseTime.getDate() - (points - i));
      } else {
        baseTime.setDate(baseTime.getDate() - (points - i));
      }

      data.push({
        time: range === '24h' 
          ? baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : baseTime.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        moisture: 35 + Math.random() * 30 + Math.sin(i / 3) * 15,
        temperature: 20 + Math.random() * 5 + Math.cos(i / 2) * 3,
        humidity: 55 + Math.random() * 20,
        light: 40 + Math.random() * 40 + Math.sin(i / 4) * 20,
      });
    }
    return data;
  };

  const data = generateData(timeRange);

  // Calculate statistics
  const stats = {
    avgMoisture: (data.reduce((sum, d) => sum + d.moisture, 0) / data.length).toFixed(1),
    avgTemp: (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1),
    avgHumidity: (data.reduce((sum, d) => sum + d.humidity, 0) / data.length).toFixed(1),
    avgLight: (data.reduce((sum, d) => sum + d.light, 0) / data.length).toFixed(1),
    wateringEvents: Math.floor(Math.random() * 5) + 3,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">Historical data and insights</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700 text-sm">Avg Moisture</p>
          <p className="text-2xl text-blue-800 mt-1">{stats.avgMoisture}%</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-700 text-sm">Avg Temp</p>
          <p className="text-2xl text-orange-800 mt-1">{stats.avgTemp}°C</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-4">
          <p className="text-teal-700 text-sm">Avg Humidity</p>
          <p className="text-2xl text-teal-800 mt-1">{stats.avgHumidity}%</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
          <p className="text-yellow-700 text-sm">Avg Light</p>
          <p className="text-2xl text-yellow-800 mt-1">{stats.avgLight}%</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
          <p className="text-emerald-700 text-sm">Watering Events</p>
          <p className="text-2xl text-emerald-800 mt-1">{stats.wateringEvents}</p>
        </div>
      </div>

      {/* Soil Moisture Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg text-gray-800">Soil Moisture Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
            <YAxis stroke="#888" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey="moisture" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorMoisture)" 
              name="Moisture (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature & Humidity Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg text-gray-800">Temperature & Humidity</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
            <YAxis stroke="#888" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={false}
              name="Temperature (°C)"
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#14b8a6" 
              strokeWidth={2}
              dot={false}
              name="Humidity (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Light Level Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-lg text-gray-800">Light Exposure</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
            <YAxis stroke="#888" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Bar dataKey="light" fill="#eab308" radius={[8, 8, 0, 0]} name="Light Level (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
        <h2 className="text-lg text-gray-800 mb-4">Key Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
            <p className="text-gray-700">Plant has been watered {stats.wateringEvents} times in the selected period</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
            <p className="text-gray-700">Average soil moisture is {stats.avgMoisture}%, which is {parseFloat(stats.avgMoisture) > 50 ? 'optimal' : 'slightly low'}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2" />
            <p className="text-gray-700">Temperature has been stable around {stats.avgTemp}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}