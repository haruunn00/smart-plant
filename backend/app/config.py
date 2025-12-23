from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://user:password@db:5432/dbname"
    
    mqtt_broker: str = "mqtt"
    mqtt_port: int = 1883
    mqtt_topic_sensor: str = "smartplant/sensors"
    mqtt_topic_control: str = "smartplant/control"
  
    github_token: str = ""
    github_model: str = "gpt-4o-mini" 
    
    api_prefix: str = "/api"
    
    cors_origins: list = ["http://localhost:3000", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore" 

settings = Settings()
