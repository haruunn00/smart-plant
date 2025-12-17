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
            "humidity": latest_data.humidity,
            "pressure": latest_data.pressure,
            "soil_moisture": latest_data.soil_moisture,
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
                "humidity": d.humidity,
                "soil_moisture": d.soil_moisture,
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
        # Dobavi najnovije senzorske podatke
        query = db.query(SensorDataDB)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        latest_data = query.order_by(SensorDataDB.timestamp.desc()).first()
        
        sensor_context = ""
        if latest_data:
            sensor_context = f"""
            Trenutni senzorski podaci:
            - Temperatura: {latest_data.temperature}°C
            - Vlažnost zraka: {latest_data.humidity}%
            - Vlažnost tla: {latest_data.soil_moisture}%
            - Razina svjetlosti: {latest_data.light_level} lux
            """
        
        response = ai_service.chat_with_user(request.message, sensor_context)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri chat-u sa AI: {str(e)}")
