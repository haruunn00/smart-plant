from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://smartplant:password@db:5432/smartplant_db"
    
    # MQTT
    mqtt_broker: str = "mqtt"
    mqtt_port: int = 1883
    mqtt_topic_sensor: str = "smartplant/sensors"
    mqtt_topic_control: str = "smartplant/control"
    
    # OpenAI
    openai_api_key: str = ""
    
    # API
    api_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
