from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db, SensorDataDB
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])

class AIRecommendationRequest(BaseModel):
    device_id: Optional[str] = None
    use_latest: bool = True

class AIRecommendationResponse(BaseModel):
    recommendation: str
    sensor_data: dict

class TrendAnalysisRequest(BaseModel):
    device_id: Optional[str] = None
    hours: int = 24

class TrendAnalysisResponse(BaseModel):
    analysis: str
    data_points: int

class ChatRequest(BaseModel):
    message: str
    device_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

@router.post("/recommendation", response_model=AIRecommendationResponse)
async def get_ai_recommendation(
    request: AIRecommendationRequest,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(SensorDataDB)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        latest_data = query.order_by(SensorDataDB.timestamp.desc()).first()
        
        if not latest_data:
            raise HTTPException(status_code=404, detail="Nema dostupnih senzorskih podataka")
        
        sensor_data = {
            "temperature": latest_data.temperature,
            "soil_moisture": latest_data.soil_moisture,
            "water_level": latest_data.water_level,
            "light_level": latest_data.light_level
        }
        
        # Generiraj preporuku
        recommendation = ai_service.get_plant_recommendation(sensor_data)
        
        return AIRecommendationResponse(
            recommendation=recommendation,
            sensor_data=sensor_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri generiranju preporuke: {str(e)}")

@router.post("/trend-analysis", response_model=TrendAnalysisResponse)
async def analyze_trend(
    request: TrendAnalysisRequest,
    db: Session = Depends(get_db)
):
    try:
        from datetime import datetime, timedelta
        time_threshold = datetime.utcnow() - timedelta(hours=request.hours)
        query = db.query(SensorDataDB).filter(SensorDataDB.timestamp >= time_threshold)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        data = query.order_by(SensorDataDB.timestamp.asc()).all()
        
        if not data:
            raise HTTPException(status_code=404, detail="Nema dovoljno podataka za analizu")
        
        historical_data = [
            {
                "temperature": d.temperature,
                "soil_moisture": d.soil_moisture,
                "water_level": d.water_level,
                "light_level": d.light_level
            }
            for d in data
        ]

        analysis = ai_service.analyze_trend(historical_data)
        
        return TrendAnalysisResponse(
            analysis=analysis,
            data_points=len(historical_data)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri analizi trenda: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    try:
        from datetime import datetime, timedelta
        from sqlalchemy import func
        
        # Dobavi najnovije senzorske podatke
        query = db.query(SensorDataDB)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        latest_data = query.order_by(SensorDataDB.timestamp.desc()).first()
        
        # Dobavi statistiku za zadnjih 24 sata
        time_24h_ago = datetime.utcnow() - timedelta(hours=24)
        stats_query = db.query(
            func.avg(SensorDataDB.temperature).label('avg_temp'),
            func.min(SensorDataDB.temperature).label('min_temp'),
            func.max(SensorDataDB.temperature).label('max_temp'),
            func.avg(SensorDataDB.soil_moisture).label('avg_moisture'),
            func.min(SensorDataDB.soil_moisture).label('min_moisture'),
            func.max(SensorDataDB.soil_moisture).label('max_moisture'),
            func.avg(SensorDataDB.humidity).label('avg_humidity'),
            func.avg(SensorDataDB.light_level).label('avg_light'),
            func.count(SensorDataDB.id).label('total_readings')
        ).filter(SensorDataDB.timestamp >= time_24h_ago)
        
        if request.device_id:
            stats_query = stats_query.filter(SensorDataDB.device_id == request.device_id)
        
        stats = stats_query.first()
        
        sensor_context = ""
        if latest_data:
            sensor_context = f"""
TRENUTNI SENZORSKI PODACI (zadnje mjerenje):
- Temperatura: {latest_data.temperature}°C
- Vlažnost tla: {latest_data.soil_moisture}%
- Vlažnost zraka: {latest_data.humidity}%
- Razina vode u spremniku: {latest_data.water_level}%
- Razina svjetlosti: {latest_data.light_level}%
- Vrijeme mjerenja: {latest_data.timestamp}

STATISTIKA ZADNJIH 24 SATA ({stats.total_readings} mjerenja):
- Temperatura: prosječno {stats.avg_temp:.1f}°C (min: {stats.min_temp:.1f}°C, max: {stats.max_temp:.1f}°C)
- Vlažnost tla: prosječno {stats.avg_moisture:.1f}% (min: {stats.min_moisture}%, max: {stats.max_moisture}%)
- Vlažnost zraka: prosječno {stats.avg_humidity:.1f}%
- Razina svjetlosti: prosječno {stats.avg_light:.1f}%

Koristi ove podatke za davanje personaliziranih preporuka korisniku."""
        
        response = ai_service.chat_with_user(request.message, sensor_context)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri chat-u sa AI: {str(e)}")
