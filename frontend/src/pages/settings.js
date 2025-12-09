import React, { useState } from 'react';

export default function Settings() {
  const [deviceId, setDeviceId] = useState('ESP32_SmartPlant');
  const [wifiSsid, setWifiSsid] = useState('');
  const [mqttBroker, setMqttBroker] = useState('');

  const handleSave = () => {
    // Settings would be saved here (currently just a placeholder)
    alert('Postavke spremljene! (funkcionalnost u razvoju)');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>⚙️ Postavke</h1>
        <p>Konfigurirajte svoj Smart Plant sustav</p>
      </header>

      <main className="main">
        <div className="settings-section">
          <h2>Postavke uređaja</h2>
          
          <div className="form-group">
            <label htmlFor="deviceId">ID Uređaja:</label>
            <input
              type="text"
              id="deviceId"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wifiSsid">WiFi SSID:</label>
            <input
              type="text"
              id="wifiSsid"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Unesite WiFi SSID"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mqttBroker">MQTT Broker:</label>
            <input
              type="text"
              id="mqttBroker"
              value={mqttBroker}
              onChange={(e) => setMqttBroker(e.target.value)}
              placeholder="Unesite adresu MQTT brokera"
              className="form-input"
            />
          </div>

          <button onClick={handleSave} className="btn btn-primary">
            Spremi postavke
          </button>
        </div>

        <div className="settings-section">
          <h2>O sustavu</h2>
          <p><strong>Verzija:</strong> 1.0.0</p>
          <p><strong>Backend API:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</p>
          <p><strong>Framework:</strong> Next.js + FastAPI</p>
        </div>

        <div className="settings-section">
          <h2>Korisne veze</h2>
          <ul>
            <li><a href="/">← Povratak na Dashboard</a></li>
            <li><a href="/docs/api.md" target="_blank">API Dokumentacija</a></li>
            <li><a href="/docs/hardware.md" target="_blank">Hardware vodiči</a></li>
          </ul>
        </div>
      </main>

      <footer className="footer">
        <p>Smart Plant IoT System © 2024</p>
      </footer>
    </div>
  );
}
