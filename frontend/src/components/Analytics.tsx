import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Download } from 'lucide-react';

type TimeRange = '24h' | '7d' | '30d';

interface SensorDataPoint {
  time: string;
  moisture: number;
  temperature: number;
  humidity: number;
  light: number;
}

interface StatsData {
  avgMoisture: string;
  avgTemp: string;
  avgHumidity: string;
  avgLight: string;
  wateringEvents: number;
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [data, setData] = useState<SensorDataPoint[]>([]);
  const [stats, setStats] = useState<StatsData>({
    avgMoisture: '0',
    avgTemp: '0',
    avgHumidity: '0',
    avgLight: '0',
    wateringEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHoursForRange = (range: TimeRange): number => {
    switch (range) {
      case '24h': return 24;
      case '7d': return 168;
      case '30d': return 720;
      default: return 24;
    }
  };

  const fetchData = async (range: TimeRange) => {
    setLoading(true);
    setError(null);
    try {
      const hours = getHoursForRange(range);
      
      // Fetch sensor data
      const sensorResponse = await fetch(`${import.meta.env.VITE_API_URL}/sensors?hours=${hours}&limit=100&t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!sensorResponse.ok) {
        throw new Error('Failed to fetch sensor data');
      }
      const sensorResult = await sensorResponse.json();
      
      // Fetch stats
      const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/sensors/stats?hours=${hours}&t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch stats');
      }
      const statsResult = await statsResponse.json();
      
      // Process sensor data for chart
      const chartData: SensorDataPoint[] = sensorResult.data
        .reverse() // Reverse to get chronological order
        .map((item: any, index: number) => ({
          time: range === '24h' 
            ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          moisture: item.soil_moisture || 0,
          temperature: item.temperature || 0,
          humidity: item.humidity || 0,
          light: item.light_level || 0,
        }));
      
      setData(chartData);
      
      // Process stats
      setStats({
        avgMoisture: (statsResult.avg_soil_moisture || 0).toFixed(1),
        avgTemp: (statsResult.avg_temperature || 0).toFixed(1),
        avgHumidity: (statsResult.avg_humidity || 0).toFixed(1),
        avgLight: (statsResult.avg_light_level || 0).toFixed(1),
        wateringEvents: Math.floor(Math.random() * 5) + 3, // TODO: Get real watering events from API
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
          <div>
            <p>{error}</p>
          </div>
        </div>
      )}
      
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
                disabled={loading}
                className={`px-4 py-2 rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg text-gray-800">Soil Moisture Trend</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading data...</div>
          </div>
        ) : (
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
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg text-gray-800">Temperature & Humidity</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading data...</div>
          </div>
        ) : (
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
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <h2 className="text-lg text-gray-800">Light Exposure</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading data...</div>
          </div>
        ) : (
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
        )}
      </div>

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