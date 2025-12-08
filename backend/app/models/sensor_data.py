from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SensorDataBase(BaseModel):
    device_id: str
    temperature: float
    humidity: float
    pressure: float
    soil_moisture: int
    light_level: float

class SensorDataCreate(SensorDataBase):
    pass

class SensorData(SensorDataBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

class SensorDataResponse(BaseModel):
    data: list[SensorData]
    count: int
