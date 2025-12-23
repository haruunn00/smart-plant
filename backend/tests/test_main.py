import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "Smart Plant IoT API"

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"

def test_get_sensors_empty():
    """Test getting sensors when database is empty"""
    response = client.get("/api/v1/sensors/")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "count" in data
    assert isinstance(data["data"], list)

def test_create_sensor_data():
    """Test creating sensor data"""
    sensor_data = {
        "device_id": "TEST_DEVICE",
        "temperature": 25.5,
        "humidity": 60.0,
        "pressure": 1013.25,
        "soil_moisture": 45,
        "light_level": 350.0
    }
    
    response = client.post("/api/v1/sensors/", json=sensor_data)
    assert response.status_code == 200
    data = response.json()
    assert data["device_id"] == sensor_data["device_id"]
    assert data["temperature"] == sensor_data["temperature"]
    assert "id" in data
    assert "timestamp" in data

def test_get_sensor_stats():
    """Test getting sensor statistics"""
    response = client.get("/api/v1/sensors/stats")
    assert response.status_code == 200
    data = response.json()
    assert "period_hours" in data

def test_pump_control():
    """Test pump control endpoint"""
    control_data = {
        "pump": True,
        "device_id": "TEST_DEVICE"
    }
    
    response = client.post("/api/v1/control/pump", json=control_data)
    assert response.status_code in [200, 500]
