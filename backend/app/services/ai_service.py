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
            if "insufficient_quota" in str(e).lower():
                return "OpenAI API quota je iscrpljen. Molimo provjerite svoj OpenAI račun i dodajte kredite."
            else:
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
            if "insufficient_quota" in str(e).lower():
                return "OpenAI API quota je iscrpljen. Molimo provjerite svoj OpenAI račun i dodajte kredite."
            else:
                return "Trenutno nije moguće analizirati trend. Molimo pokušajte kasnije."
    
    def chat_with_user(self, user_message: str, sensor_context: str = "") -> str:
        try:
            system_prompt = f"""Ti si AI asistent specijaliziran ISKLJUČIVO za pametno održavanje biljaka i IoT sustave za monitoring biljaka. 

VAŽNO: Odgovaraj SAMO na pitanja vezana za:
- Brigu o biljkama (zalivanje, temperatura, svjetlost, vlažnost, đubrenje)
- Analizu senzorskih podataka
- Problemi sa biljkama i njihovo rješavanje
- Preporuke za optimalne uvjete rasta
- Funkcionalnosti Smart Plant aplikacije

NE odgovaraj na pitanja koja nisu vezana za biljke, IoT monitoring ili ovu aplikaciju. Ako korisnik postavi pitanje izvan ovih tema, ljubazno ga usmjeri nazad na teme vezane za brigu o biljkama.

{sensor_context}

Odgovaraj na hrvatskom jeziku, budi prijateljski, koristan i temelji svoje savjete na realnim senzorskim podacima kada su dostupni."""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            chat_response = response.choices[0].message.content.strip()
            logger.info("AI chat odgovor uspješno generiran")
            return chat_response
            
        except Exception as e:
            logger.error(f"Greška pri chat-u sa AI: {e}")
            if "insufficient_quota" in str(e).lower():
                return "OpenAI API quota je iscrpljen. Molimo provjerite svoj OpenAI račun i dodajte kredite, ili koristite drugi API ključ."
            elif "connection" in str(e).lower():
                return "Nema internet konekcije za OpenAI API. Molimo provjerite mrežnu vezu."
            else:
                return "Žao mi je, trenutno ne mogu odgovoriti zbog tehničkih problema. Molimo pokušajte kasnije."

ai_service = AIService()
