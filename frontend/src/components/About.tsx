import { Cpu, Wifi, Database, Globe, Droplets, Thermometer, Zap } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl text-gray-800 mb-6">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
            <div className="p-3 bg-blue-600 rounded-lg w-fit mb-4">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg text-gray-800 mb-3">Hardware Layer</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>ESP32 Microcontroller</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Capacitive Soil Moisture Sensor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>DHT22 Temperature & Humidity Sensor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Photoresistor (Light Sensor)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Mini Water Pump</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Relay Module</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
            <div className="p-3 bg-purple-600 rounded-lg w-fit mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg text-gray-800 mb-3">Backend Layer</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>FastAPI (Python)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>RESTful API Endpoints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>PostgreSQL Database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>SQLAlchemy ORM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>AI Analytics Engine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Real-time Data Processing</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-5">
            <div className="p-3 bg-emerald-600 rounded-lg w-fit mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg text-gray-800 mb-3">Frontend Layer</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>React.js Framework</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>TypeScript</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Tailwind CSS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Recharts for Data Visualization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Real-time Dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Responsive Design</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl text-gray-800 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-100 rounded-lg h-fit">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Automated Watering</h3>
              <p className="text-gray-600 text-sm">
                Automatically activates water pump when soil moisture drops below threshold. 
                Manual override available through web interface.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-orange-100 rounded-lg h-fit">
              <Thermometer className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Environmental Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Continuous tracking of temperature, humidity, and light levels with 
                real-time updates every 3 seconds.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-purple-100 rounded-lg h-fit">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg text-gray-800 mb-2">AI Analytics</h3>
              <p className="text-gray-600 text-sm">
                Intelligent analysis of sensor data to generate personalized care 
                recommendations and predict plant needs.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg h-fit">
              <Wifi className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg text-gray-800 mb-2">Remote Access</h3>
              <p className="text-gray-600 text-sm">
                Monitor and control your plant from anywhere via WiFi connection 
                and web browser interface.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl text-gray-800 mb-6">Data Flow</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Cpu className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-800">ESP32 Sensors</p>
            <p className="text-gray-600 text-sm mt-1">Collect Data</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <Wifi className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-gray-800">WiFi Transfer</p>
            <p className="text-gray-600 text-sm mt-1">Send via HTTP</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <Database className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-gray-800">FastAPI</p>
            <p className="text-gray-600 text-sm mt-1">Process & Store</p>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-gray-800">React UI</p>
            <p className="text-gray-600 text-sm mt-1">Display Data</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl text-gray-800 mb-6">Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-800 mb-3">Sensor Specifications</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 text-gray-600">Soil Moisture Range</td>
                  <td className="py-2 text-gray-800">0-100%</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Temperature Range</td>
                  <td className="py-2 text-gray-800">-40°C to 80°C</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Humidity Range</td>
                  <td className="py-2 text-gray-800">0-100%</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Update Frequency</td>
                  <td className="py-2 text-gray-800">Every 3 seconds</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-gray-800 mb-3">System Requirements</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 text-gray-600">Power Supply</td>
                  <td className="py-2 text-gray-800">5V DC</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">WiFi</td>
                  <td className="py-2 text-gray-800">802.11 b/g/n</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Database</td>
                  <td className="py-2 text-gray-800">PostgreSQL</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Browser Support</td>
                  <td className="py-2 text-gray-800">Modern browsers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl text-gray-800 mb-4">Project Information</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="">Project Type:</span> University-Level IoT System</p>
          <p><span className="">Technologies:</span> ESP32, C++, FastAPI, React, TypeScript, PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}