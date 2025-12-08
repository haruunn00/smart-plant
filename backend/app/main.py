from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.services.mqtt_service import mqtt_service
from app.routers import sensors, control, ai

# Konfiguracija logginga
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle eventi za FastAPI aplikaciju"""
    # Startup
    logger.info("Pokretanje Smart Plant API-ja...")
    
    # Inicijaliziraj bazu podataka
    logger.info("Inicijalizacija baze podataka...")
    init_db()
    
    # Pokreni MQTT servis
    logger.info("Pokretanje MQTT servisa...")
    mqtt_service.connect()
    
    logger.info("Smart Plant API uspješno pokrenut!")
    
    yield
    
    # Shutdown
    logger.info("Zaustavljanje Smart Plant API-ja...")
    mqtt_service.disconnect()
    logger.info("Smart Plant API zaustavljen.")

# Kreiraj FastAPI aplikaciju
app = FastAPI(
    title="Smart Plant IoT API",
    description="REST API za Smart Plant IoT sustav s ESP32, MQTT i AI preporukama",
    version="1.0.0",
    lifespan=lifespan
)

# Konfiguriraj CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uključi routere
app.include_router(sensors.router, prefix=settings.api_prefix)
app.include_router(control.router, prefix=settings.api_prefix)
app.include_router(ai.router, prefix=settings.api_prefix)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Smart Plant IoT API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "mqtt_connected": mqtt_service.connected
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
