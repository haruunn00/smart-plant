# Smart Plant IoT API Documentation

## Overview
REST API za Smart Plant IoT sustav s ESP32, MQTT brokeru i AI preporukama.

Base URL: `http://localhost:8000/api/v1`

## Authentication
Trenutno nema autentifikacije. U produkciji dodati JWT ili OAuth2.

## Endpoints

### Sensors

#### GET /sensors/
Dohvaća senzorske podatke s opcionalnim filterima.

**Query Parameters:**
- `device_id` (optional): Filter po ID-u uređaja
- `limit` (optional, default: 100, max: 1000): Broj rezultata
- `skip` (optional, default: 0): Preskoči prvih N rezultata
- `hours` (optional, default: 24): Broj sati unatrag

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "device_id": "ESP32_SmartPlant",
      "temperature": 23.5,
      "humidity": 55.2,
      "pressure": 1013.25,
      "soil_moisture": 45,
      "light_level": 350.0,
      "timestamp": "2024-01-01T12:00:00"
    }
  ],
  "count": 100
}
```

#### GET /sensors/latest
Dohvaća najnovije senzorske podatke.

**Query Parameters:**
- `device_id` (optional): Filter po ID-u uređaja

**Response:**
```json
{
  "id": 1,
  "device_id": "ESP32_SmartPlant",
  "temperature": 23.5,
  "humidity": 55.2,
  "pressure": 1013.25,
  "soil_moisture": 45,
  "light_level": 350.0,
  "timestamp": "2024-01-01T12:00:00"
}
```

#### GET /sensors/stats
Dohvaća statistiku senzorskih podataka (prosjek, min, max).

**Query Parameters:**
- `device_id` (optional): Filter po ID-u uređaja
- `hours` (optional, default: 24): Broj sati za statistiku

**Response:**
```json
{
  "avg_temperature": 23.5,
  "min_temperature": 18.0,
  "max_temperature": 28.0,
  "avg_humidity": 55.2,
  "avg_soil_moisture": 45,
  "avg_light_level": 350.0,
  "period_hours": 24
}
```

#### POST /sensors/
Kreira novi unos senzorskih podataka.

**Request Body:**
```json
{
  "device_id": "ESP32_SmartPlant",
  "temperature": 23.5,
  "humidity": 55.2,
  "pressure": 1013.25,
  "soil_moisture": 45,
  "light_level": 350.0
}
```

**Response:** Vraća kreirani objekt sa `id` i `timestamp`.

### Control

#### POST /control/pump
Kontrolira pumpu za zalijevanje.

**Request Body:**
```json
{
  "pump": true,
  "device_id": "ESP32_SmartPlant",
  "duration": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pumpa uspješno uključena",
  "pump_state": true
}
```

#### POST /control/auto-water
Automatski zalijeва biljku na temelju vlažnosti tla (u razvoju).

### AI Recommendations

#### POST /ai/recommendation
Dohvaća AI preporuku za održavanje biljke.

**Request Body:**
```json
{
  "device_id": "ESP32_SmartPlant",
  "use_latest": true
}
```

**Response:**
```json
{
  "recommendation": "Tlo je suho s 30% vlažnosti. Preporučujem zalijevanje. Temperatura je optimalna na 23°C. Razina svjetlosti je dobra.",
  "sensor_data": {
    "temperature": 23.5,
    "humidity": 55.2,
    "pressure": 1013.25,
    "soil_moisture": 30,
    "light_level": 350.0
  }
}
```

#### POST /ai/trend-analysis
Analizira trend senzorskih podataka kroz vrijeme.

**Request Body:**
```json
{
  "device_id": "ESP32_SmartPlant",
  "hours": 24
}
```

**Response:**
```json
{
  "analysis": "Trend pokazuje da temperatura ostaje stabilna oko 23°C. Vlažnost tla postupno opada, preporučujem povećanje frekvencije zalijevanja.",
  "data_points": 48
}
```

## Health Check

#### GET /health
Provjera zdravlja API-ja.

**Response:**
```json
{
  "status": "healthy",
  "mqtt_connected": true
}
```

## Error Responses

Svi endpointi mogu vratiti sljedeće HTTP kodove:
- `200`: Uspješan zahtjev
- `400`: Nevažeći zahtjev
- `404`: Resurs nije pronađen
- `500`: Greška na serveru

**Error Response Format:**
```json
{
  "detail": "Opis greške"
}
```

## MQTT Topics

### smartplant/sensors
ESP32 objavljuje senzorske podatke u JSON formatu:
```json
{
  "device_id": "ESP32_SmartPlant",
  "temperature": 23.5,
  "humidity": 55.2,
  "pressure": 1013.25,
  "soil_moisture": 45,
  "light_level": 350.0,
  "timestamp": 123456789
}
```

### smartplant/control
Backend šalje naredbe za kontrolu pumpe:
```json
{
  "pump": true,
  "device_id": "ESP32_SmartPlant"
}
```

## OpenAPI Docs
Interaktivna dokumentacija dostupna na: `http://localhost:8000/docs`
