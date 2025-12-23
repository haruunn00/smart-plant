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
            raise HTTPException(status_code=404, detail="No available sensor data")
        
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
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")

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
            raise HTTPException(status_code=404, detail="Not enough data for analysis")
        
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
        raise HTTPException(status_code=500, detail=f"Error analyzing trend: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    try:
        from datetime import datetime, timedelta
        from sqlalchemy import func
        
        query = db.query(SensorDataDB)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        latest_data = query.order_by(SensorDataDB.timestamp.desc()).first()
 
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
CURRENT SENSOR DATA (latest measurement):
- Temperature: {latest_data.temperature}°C
- Soil Moisture: {latest_data.soil_moisture}%
- Air Humidity: {latest_data.humidity}%
- Water Tank Level: {latest_data.water_level}%
- Light Level: {latest_data.light_level}%
- Measurement Time: {latest_data.timestamp}

STATISTICS FOR LAST 24 HOURS ({stats.total_readings} measurements):
- Temperature: average {stats.avg_temp:.1f}°C (min: {stats.min_temp:.1f}°C, max: {stats.max_temp:.1f}°C)
- Soil Moisture: average {stats.avg_moisture:.1f}% (min: {stats.min_moisture}%, max: {stats.max_moisture}%)
- Air Humidity: average {stats.avg_humidity:.1f}%
- Light Level: average {stats.avg_light:.1f}%

Use this data to provide personalized recommendations to the user."""
        
        response = ai_service.chat_with_user(request.message, sensor_context)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in AI chat: {str(e)}")
