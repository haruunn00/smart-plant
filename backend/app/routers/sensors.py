from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_db, SensorDataDB
from app.models.sensor_data import SensorData, SensorDataCreate, SensorDataResponse

router = APIRouter(prefix="/sensors", tags=["sensors"])

@router.post("/", response_model=SensorData)
async def create_sensor_data(sensor_data: SensorDataCreate, db: Session = Depends(get_db)):
    """
    Stvori novi unos senzorskih podataka
    """
    try:
        db_sensor_data = SensorDataDB(**sensor_data.dict())
        db.add(db_sensor_data)
        db.commit()
        db.refresh(db_sensor_data)
        return db_sensor_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Greška pri spremanju podataka: {str(e)}")

@router.get("/", response_model=SensorDataResponse)
async def get_sensor_data(
    device_id: Optional[str] = None,
    limit: int = Query(default=100, le=1000),
    skip: int = 0,
    hours: Optional[int] = Query(default=24, description="Broj sati unazad"),
    db: Session = Depends(get_db)
):
    """
    Dohvati senzorske podatke s opcionalnim filterima
    """
    try:
        query = db.query(SensorDataDB)
        
        if device_id:
            query = query.filter(SensorDataDB.device_id == device_id)
    
        if hours:
            time_threshold = datetime.utcnow() - timedelta(hours=hours)
            query = query.filter(SensorDataDB.timestamp >= time_threshold)
        
        query = query.order_by(SensorDataDB.timestamp.desc())
        
        total_count = query.count()
        
        data = query.offset(skip).limit(limit).all()
        
        return SensorDataResponse(data=data, count=total_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri dohvaćanju podataka: {str(e)}")

@router.get("/latest", response_model=SensorData)
async def get_latest_sensor_data(
    device_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Dohvati najnovije senzorske podatke
    """
    try:
        query = db.query(SensorDataDB)
        
        if device_id:
            query = query.filter(SensorDataDB.device_id == device_id)
        
        latest = query.order_by(SensorDataDB.timestamp.desc()).first()
        
        if not latest:
            raise HTTPException(status_code=404, detail="Nema dostupnih podataka")
        
        return latest
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri dohvaćanju podataka: {str(e)}")

@router.get("/stats")
async def get_sensor_stats(
    device_id: Optional[str] = None,
    hours: int = Query(default=24, description="Broj sati za statistiku"),
    db: Session = Depends(get_db)
):
    """
    Dohvati statistiku senzorskih podataka (prosjek, min, max)
    """
    try:
        from sqlalchemy import func
        
        query = db.query(
            func.avg(SensorDataDB.temperature).label("avg_temperature"),
            func.min(SensorDataDB.temperature).label("min_temperature"),
            func.max(SensorDataDB.temperature).label("max_temperature"),
            func.avg(SensorDataDB.humidity).label("avg_humidity"),
            func.avg(SensorDataDB.soil_moisture).label("avg_soil_moisture"),
            func.avg(SensorDataDB.light_level).label("avg_light_level"),
        )
        
        if device_id:
            query = query.filter(SensorDataDB.device_id == device_id)
        
        time_threshold = datetime.utcnow() - timedelta(hours=hours)
        query = query.filter(SensorDataDB.timestamp >= time_threshold)
        
        stats = query.first()
        
        return {
            "avg_temperature": round(stats.avg_temperature, 2) if stats.avg_temperature else None,
            "min_temperature": round(stats.min_temperature, 2) if stats.min_temperature else None,
            "max_temperature": round(stats.max_temperature, 2) if stats.max_temperature else None,
            "avg_humidity": round(stats.avg_humidity, 2) if stats.avg_humidity else None,
            "avg_soil_moisture": round(stats.avg_soil_moisture, 2) if stats.avg_soil_moisture else None,
            "avg_light_level": round(stats.avg_light_level, 2) if stats.avg_light_level else None,
            "period_hours": hours
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri izračunu statistike: {str(e)}")
