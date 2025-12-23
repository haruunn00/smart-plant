import logging
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)

GITHUB_MODELS_ENDPOINT = "https://models.inference.ai.azure.com"

class AIService:
    def __init__(self):
        self.client = OpenAI(
            base_url=GITHUB_MODELS_ENDPOINT,
            api_key=settings.github_token
        )
        self.model = settings.github_model
        
    def get_plant_recommendation(self, sensor_data: dict) -> str:
        try:
            prompt = f"""
            As a plant care expert, analyze the following sensor data and provide recommendations:
            
            Temperature: {sensor_data.get('temperature', 'N/A')}°C
            Soil Moisture: {sensor_data.get('soil_moisture', 'N/A')}%
            Air Humidity: {sensor_data.get('humidity', 'N/A')}%
            Water Tank Level: {sensor_data.get('water_level', 'N/A')}%
            Light Level: {sensor_data.get('light_level', 'N/A')}%
            
            Provide specific advice for:
            1. Should the plant be watered?
            2. Is the temperature optimal?
            3. Is the air humidity good?
            4. Is the water tank level sufficient?
            5. Is the light level appropriate?
            
            Answer in English, briefly and clearly.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert in plant maintenance and IoT systems."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.7
            )
            
            recommendation = response.choices[0].message.content.strip()
            logger.info("AI recommendation successfully generated via GitHub Models")
            return recommendation
            
        except Exception as e:
            logger.error(f"Greška pri generiranju AI preporuke: {e}")
            return f"Error: {str(e)[:100]}. Check GITHUB_TOKEN in .env file."
    
    def analyze_trend(self, historical_data: list) -> str:
        try:
            if not historical_data:
                return "Not enough data for trend analysis."
  
            avg_temp = sum(d.get('temperature', 0) for d in historical_data) / len(historical_data)
            avg_moisture = sum(d.get('soil_moisture', 0) for d in historical_data) / len(historical_data)
            avg_humidity = sum(d.get('humidity', 0) or 0 for d in historical_data) / len(historical_data)
            avg_light = sum(d.get('light_level', 0) for d in historical_data) / len(historical_data)
            
            prompt = f"""
            Analyze the trend from {len(historical_data)} measurements:
            
            Average temperature: {avg_temp:.1f}°C
            Average soil moisture: {avg_moisture:.1f}%
            Average air humidity: {avg_humidity:.1f}%
            Average light level: {avg_light:.1f}%
            
            Provide a brief trend analysis and recommendations for improvement.
            Answer in English.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a data analyst specialized in IoT and plant maintenance."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            analysis = response.choices[0].message.content.strip()
            logger.info("Trend analysis successfully generated via GitHub Models")
            return analysis
            
        except Exception as e:
            logger.error(f"Error in trend analysis: {e}")
            return f"Error: {str(e)[:100]}"
    
    def chat_with_user(self, user_message: str, sensor_context: str = "") -> str:
        try:
            system_prompt = f"""You are an AI assistant specialized EXCLUSIVELY in smart plant maintenance and IoT systems for plant monitoring.

IMPORTANT: Answer ONLY questions related to:
- Plant care (watering, temperature, light, humidity, fertilization)
- Sensor data analysis
- Plant problems and their solutions
- Recommendations for optimal growing conditions
- Smart Plant application functionalities

DO NOT answer questions not related to plants, IoT monitoring, or this application. If the user asks a question outside these topics, politely redirect them back to topics related to plant care.

{sensor_context}

Answer in English, be friendly, helpful, and base your advice on real sensor data when available."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=400,
                temperature=0.7
            )
            
            chat_response = response.choices[0].message.content.strip()
            logger.info("AI chat response successfully generated via GitHub Models")
            return chat_response
            
        except Exception as e:
            logger.error(f"Error in AI chat: {e}")
            if "401" in str(e) or "unauthorized" in str(e).lower():
                return "GitHub token is not valid. Please check GITHUB_TOKEN in .env file."
            elif "rate" in str(e).lower():
                return "Request limit exceeded. Please wait a few seconds and try again."
            else:
                return f"Sorry, an error occurred: {str(e)[:100]}"

ai_service = AIService()
