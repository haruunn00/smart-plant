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

@router.post("/recommendation", response_model=AIRecommendationResponse)
async def get_ai_recommendation(
    request: AIRecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Dohvati AI preporuku za održavanje biljke na temelju senzorskih podataka
    """
    try:
        # Dohvati najnovije podatke
        query = db.query(SensorDataDB)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        latest_data = query.order_by(SensorDataDB.timestamp.desc()).first()
        
        if not latest_data:
            raise HTTPException(status_code=404, detail="Nema dostupnih senzorskih podataka")
        
        # Pripremi podatke za AI
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
    """
    Analiziraj trend senzorskih podataka kroz vrijeme
    """
    try:
        from datetime import datetime, timedelta
        
        # Dohvati podatke za zadani period
        time_threshold = datetime.utcnow() - timedelta(hours=request.hours)
        query = db.query(SensorDataDB).filter(SensorDataDB.timestamp >= time_threshold)
        
        if request.device_id:
            query = query.filter(SensorDataDB.device_id == request.device_id)
        
        data = query.order_by(SensorDataDB.timestamp.asc()).all()
        
        if not data:
            raise HTTPException(status_code=404, detail="Nema dovoljno podataka za analizu")
        
        # Pretvori u listu rječnika
        historical_data = [
            {
                "temperature": d.temperature,
                "humidity": d.humidity,
                "soil_moisture": d.soil_moisture,
                "light_level": d.light_level
            }
            for d in data
        ]
        
        # Analiziraj trend
        analysis = ai_service.analyze_trend(historical_data)
        
        return TrendAnalysisResponse(
            analysis=analysis,
            data_points=len(historical_data)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri analizi trenda: {str(e)}")
