# 🌱 Smart Plant IoT System

Kompletni IoT sustav za inteligentno praćenje i održavanje biljaka koristeći ESP32, FastAPI, React, PostgreSQL/TimescaleDB, MQTT broker i OpenAI API za AI preporuke.

![CI Tests](https://github.com/haruunn00/smart-plant/workflows/CI%20Tests/badge.svg)

## 📋 Opis projekta

Smart Plant IoT System je kompletan full-stack IoT projekt koji omogućava:
- 📊 Real-time praćenje senzora (temperatura, vlažnost zraka, vlažnost tla, svjetlost)
- 💧 Automatsku kontrolu zalijevanja preko pumpe
- 🤖 AI preporuke za održavanje biljaka (OpenAI GPT-3.5)
- 📈 Vizualizaciju podataka sa grafovima
- 🔄 MQTT komunikaciju između ESP32 i backend servera
- 💾 Pohranu podataka u TimescaleDB (optimizirano za time-series)

## 🏗️ Arhitektura

```
┌─────────────┐
│   ESP32     │ ──MQTT──> ┌──────────────┐      ┌─────────────┐
│  + Senzori  │           │ MQTT Broker  │      │ PostgreSQL  │
│  + Pumpa    │ <─MQTT─── │ (Mosquitto)  │ <──> │ TimescaleDB │
└─────────────┘           └──────────────┘      └─────────────┘
                                 │                      │
                                 ↓                      ↓
                          ┌──────────────┐       ┌─────────────┐
                          │   FastAPI    │ <───> │  OpenAI API │
                          │   Backend    │       │   (GPT-3.5) │
                          └──────────────┘       └─────────────┘
                                 │
                                 ↓
                          ┌──────────────┐
                          │   React      │
                          │   Frontend   │
                          └──────────────┘
```

## 🚀 Značajke

### ESP32 Firmware
- Wi-Fi povezivanje
- Očitavanje senzora svakih 30 sekundi:
  - BME280: Temperatura, vlažnost, tlak
  - BH1750: Razina svjetlosti
  - Kapacitivni: Vlažnost tla
- MQTT komunikacija (objava podataka, primanje naredbi)
- Kontrola pumpe za zalijevanje

### Backend (FastAPI)
- REST API za upravljanje podacima
- MQTT klijent za primanje podataka s ESP32
- Integracija s OpenAI API-jem
- TimescaleDB za optimiziranu pohranu time-series podataka
- Automatska dokumentacija (Swagger/OpenAPI)

### Frontend (React + Next.js)
- Dashboard s real-time prikazom podataka
- Interaktivni grafovi (Chart.js)
- Kontrolna ploča za upravljanje pumpom
- AI preporuke za održavanje
- Responzivan dizajn

### Database
- PostgreSQL s TimescaleDB ekstenzijom
- Hypertable za učinkovito pohranu time-series podataka
- Indexi za brže upite

## 📦 Instalacija

### Preduvjeti
- Docker & Docker Compose
- PlatformIO (za ESP32 development)
- OpenAI API ključ (opciono, za AI značajke)

### 1. Kloniranje repozitorija
```bash
git clone https://github.com/haruunn00/smart-plant.git
cd smart-plant
```

### 2. Konfiguracija environment varijabli
```bash
cp .env.example .env
# Uredite .env datoteku sa svojim postavkama
```

**Važne postavke u `.env`:**
```env
POSTGRES_PASSWORD=your_secure_password
OPENAI_API_KEY=your_openai_api_key  # Opciono
```

### 3. Pokretanje s Dockerom
```bash
cd docker
docker-compose up -d
```

Servisi će biti dostupni na:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- MQTT Broker: localhost:1883

### 4. Konfiguracija ESP32

1. Instalirajte PlatformIO
2. Otvorite projekt `arduino-esp32/`
3. Uredite `src/config.h`:
   ```cpp
   #define WIFI_SSID "your_wifi_ssid"
   #define WIFI_PASSWORD "your_wifi_password"
   #define MQTT_BROKER "192.168.1.100"  // IP vašeg računala
   ```
4. Upload koda na ESP32:
   ```bash
   cd arduino-esp32
   pio run --target upload
   ```

## 🔧 Hardware setup

### Potrebne komponente:
- ESP32 DevKit
- BME280 sensor (temperatura, vlažnost, tlak)
- BH1750 sensor (svjetlost)
- Kapacitivni soil moisture sensor
- 5V mini vodena pumpa
- 5V relej modul
- Breadboard i žice

Detaljne upute za spajanje: [docs/hardware.md](docs/hardware.md)

## 📖 API Dokumentacija

Detaljnu API dokumentaciju potražite u:
- [docs/api.md](docs/api.md)
- Interaktivna dokumentacija: http://localhost:8000/docs

### Primjeri API poziva:

#### Dohvat najnovijih podataka
```bash
curl http://localhost:8000/api/v1/sensors/latest
```

#### Kontrola pumpe
```bash
curl -X POST http://localhost:8000/api/v1/control/pump \
  -H "Content-Type: application/json" \
  -d '{"pump": true, "device_id": "ESP32_SmartPlant"}'
```

#### AI preporuka
```bash
curl -X POST http://localhost:8000/api/v1/ai/recommendation \
  -H "Content-Type: application/json" \
  -d '{"device_id": "ESP32_SmartPlant", "use_latest": true}'
```

## 🧪 Testiranje

### Backend testovi
```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

### Frontend build
```bash
cd frontend
npm install
npm run build
```

### Docker build test
```bash
docker-compose -f docker/docker-compose.yml build
```

## 📊 Korištenje

1. **Postavljanje hardwarea**: Spojite senzore i pumpu prema shemi u `docs/hardware.md`
2. **Upload firmware**: Uploadajte kod na ESP32 pomoću PlatformIO
3. **Pokrenite servise**: `docker-compose up -d`
4. **Otvorite dashboard**: Posjetite http://localhost:3000
5. **Praćenje podataka**: Podaci se automatski ažuriraju svakih 30 sekundi
6. **Kontrola pumpe**: Koristite kontrolnu ploču za ručno zalijevanje
7. **AI preporuke**: Kliknite "AI Preporuka" za savjete o održavanju

## 🤝 Doprinos

Pull requestovi su dobrodošli! Za veće promjene, molimo prvo otvorite issue.

## 📝 Licenca

MIT License - slobodno koristite i modificirajte projekt.

## 👤 Autor

haruunn00

## 🙏 Acknowledgments

- FastAPI za odličan web framework
- TimescaleDB za time-series optimizaciju
- OpenAI za AI integraciju
- Chart.js za vizualizaciju podataka
- Eclipse Mosquitto za MQTT broker

## 📧 Kontakt

Za pitanja i podršku, otvorite issue na GitHubu.