from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.mqtt_service import mqtt_service
from app.config import settings

router = APIRouter(prefix="/control", tags=["control"])

class PumpControlRequest(BaseModel):
    pump: bool
    device_id: str = "ESP32_SmartPlant"
    duration: int = 5 

class PumpControlResponse(BaseModel):
    success: bool
    message: str
    pump_state: bool

@router.post("/pump", response_model=PumpControlResponse)
async def control_pump(request: PumpControlRequest):
    try:
        message = {
            "pump": request.pump,
            "device_id": request.device_id
        }
        
        success = mqtt_service.publish(settings.mqtt_topic_control, message)
        
        if success:
            state_text = "uključena" if request.pump else "isključena"
            return PumpControlResponse(
                success=True,
                message=f"Pumpa uspješno {state_text}",
                pump_state=request.pump
            )
        else:
            raise HTTPException(status_code=500, detail="Greška pri slanju naredbe")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška: {str(e)}")

@router.post("/auto-water")
async def auto_water(device_id: str = "ESP32_SmartPlant"):
    try:
        # TODO: Dohvati najnovije podatke o vlažnosti tla
        # TODO: Ako je tlo suho, uključi pumpu na određeno vrijeme
        
        return {
            "success": True,
            "message": "Automatsko zalijevanje u razvoju"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška: {str(e)}")
