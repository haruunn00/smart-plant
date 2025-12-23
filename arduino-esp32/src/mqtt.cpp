#include "mqtt.h"
#include "config.h"
#include "sensors.h"
#include <ArduinoJson.h>

WiFiClient espClient;
PubSubClient mqttClient(espClient);

bool pumpRunning = false;
unsigned long pumpStartTime = 0;
unsigned long lastPumpBlink = 0;
bool pumpLedState = false;

bool initMQTT() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setCallback(mqttCallback);
    
    pinMode(PUMP_PIN, OUTPUT);
    digitalWrite(PUMP_PIN, HIGH);  
    
    Serial.println("✓ MQTT inicijaliziran");
    Serial.println("✓ Pumpa inicijalno UGAŠENA (GPIO 27)");
    Serial.print("  Broker: ");
    Serial.print(MQTT_BROKER);
    Serial.print(":");
    Serial.println(MQTT_PORT);
    
    return true;
}

bool connectMQTT() {
    Serial.print("Povezivanje na MQTT broker.. .");
    
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
        Serial.println(" ✓ povezano!");
        
        mqttClient.subscribe(MQTT_TOPIC_CONTROL);
        Serial.print("Pretplaćen na:  ");
        Serial.println(MQTT_TOPIC_CONTROL);
        
        blinkLED(GREEN_LED_PIN, 2, 200);
        
        return true;
    } else {
        Serial.print(" ✗ greška, rc=");
        Serial.println(mqttClient.state());

        blinkLED(RED_LED_PIN, 3, 100);
        
        return false;
    }
}

bool publishSensorData(const SensorData& data) {
    StaticJsonDocument<256> doc;
    
    doc["device_id"] = MQTT_CLIENT_ID;
    doc["temperature"] = data.temperature;
    doc["soil_moisture"] = data.soilMoisture;
    doc["water_level"] = data.waterLevel;
    doc["light_level"] = data. lightLevel;
    doc["humidity"] = data.humidity; 
    doc["timestamp"] = data.timestamp;
    
    char jsonBuffer[256];
    serializeJson(doc, jsonBuffer);
    
    bool success = mqttClient.publish(MQTT_TOPIC_SENSOR, jsonBuffer);
    
    if (success) {
        Serial.println("📤 Podaci poslani:");
        Serial.println(jsonBuffer);
    } else {
        Serial.println("❌ Greška pri slanju podataka!");
    }
    
    return success;
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.print("📩 Poruka na topic: ");
    Serial.println(topic);
    
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';
    
    Serial.print("Sadržaj:  ");
    Serial.println(message);
    
    StaticJsonDocument<128> doc;
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
        Serial.print("JSON greška: ");
        Serial.println(error.c_str());
        return;
    }

    if (doc. containsKey("pump")) {
        bool pumpState = doc["pump"];
        controlPump(pumpState);
    }
}

void controlPump(bool state) {
    if (state && isWaterLow()) {
        Serial.println("❌ NIZAK NIVO VODE - Pumpa se ne može uključiti!");
        blinkLED(RED_LED_PIN, 5, 100);
        return;
    }
    
    if (state) {
        digitalWrite(PUMP_PIN, LOW);  
        pumpRunning = true;
        pumpStartTime = millis();
        
        Serial.println("💧 Pumpa: UKLJUČENA");
        Serial.println("💡 Zelena LED blinka...");
        
        setRedLED(false);
    } else {
        
        digitalWrite(PUMP_PIN, HIGH);
        pumpRunning = false;
        
        Serial.println("💧 Pumpa: ISKLJUČENA");
        Serial.println("💡 Crvena LED svijetli");
        
        setGreenLED(false);
        setRedLED(true);
    }
}

void updatePumpLED() {
    if (pumpRunning) {
        unsigned long now = millis();
        
        if (now - pumpStartTime >= PUMP_DURATION) {
            Serial.println("Vrijeme proslo  - gasim pumpu");
            controlPump(false);
            return;
        }
        
        if (now - lastPumpBlink >= 250) { 
            lastPumpBlink = now;
            pumpLedState = !pumpLedState;
            digitalWrite(GREEN_LED_PIN, pumpLedState ? HIGH : LOW);
        }
    }
}


bool isPumpRunning() {
    return pumpRunning;
}


void mqttLoop() {
    if (!mqttClient.connected()) {
        reconnectMQTT();
    }
    mqttClient.loop();
}


void reconnectMQTT() {
    static unsigned long lastAttempt = 0;
    unsigned long now = millis();
    
    if (now - lastAttempt > MQTT_RECONNECT_INTERVAL) {
        lastAttempt = now;
        
        Serial.println("Pokušaj ponovnog povezivanja...");
        if (connectMQTT()) {
            lastAttempt = 0;
        }
    }
}