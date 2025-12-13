import paho.mqtt.client as mqtt
import json
import logging
from app.config import settings
from app.database import SessionLocal, SensorDataDB

logger = logging.getLogger(__name__)

class MQTTService:
    def __init__(self):
        try:
            self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
        except AttributeError:
            self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.connected = False
        
    def on_connect(self, client, userdata, flags, rc):
        """Callback kada se klijent spoji na broker"""
        if rc == 0:
            logger.info("Povezan na MQTT broker")
            self.connected = True
            client.subscribe(settings.mqtt_topic_sensor)
            logger.info(f"Pretplaćen na topic: {settings.mqtt_topic_sensor}")
        else:
            logger.error(f"Greška pri spajanju na MQTT broker, kod: {rc}")
            
    def on_message(self, client, userdata, msg):
        """Callback kada stigne nova poruka"""
        try:
            payload = json.loads(msg.payload.decode())
            logger.info(f"Primljena poruka: {payload}")
            
            self.save_to_database(payload)
            
        except json.JSONDecodeError as e:
            logger.error(f"Greška pri parsiranju JSON-a: {e}")
        except Exception as e:
            logger.error(f"Greška pri procesiranju poruke: {e}")
            
    def save_to_database(self, data: dict):
        """Spremi senzorske podatke u bazu"""
        db = SessionLocal()
        try:
            sensor_data = SensorDataDB(
                device_id=data.get("device_id"),
                temperature=data.get("temperature"),
                humidity=data.get("humidity"),
                pressure=data.get("pressure"),
                soil_moisture=data.get("soil_moisture"),
                light_level=data.get("light_level")
            )
            db.add(sensor_data)
            db.commit()
            logger.info("Podaci uspješno spremljeni u bazu")
        except Exception as e:
            logger.error(f"Greška pri spremanju u bazu: {e}")
            db.rollback()
        finally:
            db.close()
            
    def connect(self):
        """Poveži se na MQTT broker"""
        try:
            self.client.connect(settings.mqtt_broker, settings.mqtt_port, 60)
            self.client.loop_start()
            logger.info("MQTT klijent pokrenut")
        except Exception as e:
            logger.error(f"Greška pri pokretanju MQTT klijenta: {e}")
            
    def publish(self, topic: str, message: dict):
        """Objavi poruku na MQTT topic"""
        try:
            payload = json.dumps(message)
            self.client.publish(topic, payload)
            logger.info(f"Poslana poruka na {topic}: {message}")
            return True
        except Exception as e:
            logger.error(f"Greška pri slanju poruke: {e}")
            return False
            
    def disconnect(self):
        """Odspoji se od MQTT brokera"""
        self.client.loop_stop()
        self.client.disconnect()
        logger.info("MQTT klijent zaustavljen")

mqtt_service = MQTTService()
