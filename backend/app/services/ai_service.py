import openai
import logging
from app.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        from openai import OpenAI
        self.client = OpenAI(api_key=settings.openai_api_key)
        
    def get_plant_recommendation(self, sensor_data: dict) -> str:
        try:
            prompt = f"""
            Kao stručnjak za održavanje biljaka, analiziraj sljedeće podatke senzora i daj preporuku:
            
            Temperatura: {sensor_data.get('temperature', 'N/A')}°C
            Vlažnost zraka: {sensor_data.get('humidity', 'N/A')}%
            Tlak: {sensor_data.get('pressure', 'N/A')} hPa
            Vlažnost tla: {sensor_data.get('soil_moisture', 'N/A')}%
            Razina svjetlosti: {sensor_data.get('light_level', 'N/A')} lux
            
            Daj konkretne savjete za:
            1. Treba li zalijevati biljku?
            2. Je li temperatura optimalna?
            3. Je li vlažnost zraka dobra?
            4. Je li razina svjetlosti odgovarajuća?
            
            Odgovori na hrvatskom jeziku, kratko i jasno.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Ti si stručnjak za održavanje biljaka i IoT sustave."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            recommendation = response.choices[0].message.content.strip()
            logger.info("AI preporuka uspješno generirana")
            return recommendation
            
        except Exception as e:
            logger.error(f"Greška pri generiranju AI preporuke: {e}")
            return "Trenutno nije moguće generirati preporuku. Molimo pokušajte kasnije."
    
    def analyze_trend(self, historical_data: list) -> str:
        try:
            if not historical_data:
                return "Nema dovoljno podataka za analizu trenda."
  
            summary = f"Analizirano {len(historical_data)} mjerenja:\n"
            
            avg_temp = sum(d.get('temperature', 0) for d in historical_data) / len(historical_data)
            avg_moisture = sum(d.get('soil_moisture', 0) for d in historical_data) / len(historical_data)
            
            prompt = f"""
            Analiziraj trend podataka sa {len(historical_data)} mjerenja:
            
            Prosječna temperatura: {avg_temp:.1f}°C
            Prosječna vlažnost tla: {avg_moisture:.1f}%
            
            Daj kratku analizu trenda i preporuke za poboljšanje.
            Odgovori na hrvatskom jeziku.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Ti si data analyst specijaliziran za IoT i održavanje biljaka."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            analysis = response.choices[0].message.content.strip()
            logger.info("Analiza trenda uspješno generirana")
            return analysis
            
        except Exception as e:
            logger.error(f"Greška pri analizi trenda: {e}")
            return "Trenutno nije moguće analizirati trend. Molimo pokušajte kasnije."

ai_service = AIService()
