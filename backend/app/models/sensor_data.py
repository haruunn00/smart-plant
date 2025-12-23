from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SensorDataBase(BaseModel):
    device_id: str
    temperature:  float
    soil_moisture: int
    water_level: int
    light_level: int
    humidity: Optional[int] = None 

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