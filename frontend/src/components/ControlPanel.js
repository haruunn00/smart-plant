import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function ControlPanel({ deviceId = 'ESP32_SmartPlant' }) {
  const [pumpStatus, setPumpStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const controlPump = async (state) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/control/pump`, {
        pump: state,
        device_id: deviceId,
      });
      
      setPumpStatus(state);
      setMessage(response.data.message || 'Uspješno!');
      
      // Očisti poruku nakon 3 sekunde
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Greška: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getAIRecommendation = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/ai/recommendation`, {
        device_id: deviceId,
        use_latest: true,
      });
      
      setMessage(response.data.recommendation);
    } catch (error) {
      setMessage('Greška: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-panel">
      <h2>Kontrolna ploča</h2>
      
      <div className="control-buttons">
        <button
          onClick={() => controlPump(true)}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Slanje...' : '💧 Uključi pumpu'}
        </button>
        
        <button
          onClick={() => controlPump(false)}
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? 'Slanje...' : '🛑 Isključi pumpu'}
        </button>
        
        <button
          onClick={getAIRecommendation}
          disabled={loading}
          className="btn btn-ai"
        >
          {loading ? 'Generiranje...' : '🤖 AI Preporuka'}
        </button>
      </div>
      
      {pumpStatus !== null && (
        <div className="pump-status">
          Status pumpe: <span className={pumpStatus ? 'on' : 'off'}>
            {pumpStatus ? '🟢 Uključena' : '🔴 Isključena'}
          </span>
        </div>
      )}
      
      {message && (
        <div className="message-box">
          {message}
        </div>
      )}
    </div>
  );
}
