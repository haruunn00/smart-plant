#include "mqtt.h"
#include "config.h"
#include <ArduinoJson.h>

// Globalni MQTT klijent
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Inicijalizacija MQTT klijenta
bool initMQTT() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setCallback(mqttCallback);
    
    // Postavi pin za pumpu
    pinMode(PUMP_PIN, OUTPUT);
    digitalWrite(PUMP_PIN, LOW);
    
    return true;
}

// Povezivanje na MQTT broker
bool connectMQTT() {
    Serial.print("Povezivanje na MQTT broker...");
    
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
        Serial.println(" povezano!");
        
        // Pretplati se na control topic
        mqttClient.subscribe(MQTT_TOPIC_CONTROL);
        Serial.print("Pretplaćen na topic: ");
        Serial.println(MQTT_TOPIC_CONTROL);
        
        return true;
    } else {
        Serial.print(" nije uspjelo, rc=");
        Serial.println(mqttClient.state());
        return false;
    }
}

// Objavljivanje senzorskih podataka u JSON formatu
bool publishSensorData(const SensorData& data) {
    // Kreiraj JSON dokument
    StaticJsonDocument<256> doc;
    
    doc["device_id"] = MQTT_CLIENT_ID;
    doc["temperature"] = data.temperature;
    doc["humidity"] = data.humidity;
    doc["pressure"] = data.pressure;
    doc["soil_moisture"] = data.soilMoisture;
    doc["light_level"] = data.lightLevel;
    doc["timestamp"] = data.timestamp;
    
    // Serijaliziraj JSON
    char jsonBuffer[256];
    serializeJson(doc, jsonBuffer);
    
    // Objavi na MQTT topic
    bool success = mqttClient.publish(MQTT_TOPIC_SENSOR, jsonBuffer);
    
    if (success) {
        Serial.println("Podaci poslani na MQTT:");
        Serial.println(jsonBuffer);
    } else {
        Serial.println("Greška pri slanju podataka na MQTT!");
    }
    
    return success;
}

// Callback funkcija za primanje MQTT poruka
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Poruka primljena na topic: ");
    Serial.println(topic);
    
    // Pretvori payload u string
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';
    
    Serial.print("Poruka: ");
    Serial.println(message);
    
    // Parsiraj JSON
    StaticJsonDocument<128> doc;
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
        Serial.print("JSON parsing failed: ");
        Serial.println(error.c_str());
        return;
    }
    
    // Kontrola pumpe
    if (doc.containsKey("pump")) {
        bool pumpState = doc["pump"];
        controlPump(pumpState);
    }
}

// Loop funkcija za održavanje MQTT konekcije
void mqttLoop() {
    if (!mqttClient.connected()) {
        reconnectMQTT();
    }
    mqttClient.loop();
}

// Pokušaj ponovnog povezivanja na MQTT
void reconnectMQTT() {
    static unsigned long lastReconnectAttempt = 0;
    unsigned long now = millis();
    
    if (now - lastReconnectAttempt > MQTT_RECONNECT_INTERVAL) {
        lastReconnectAttempt = now;
        
        Serial.println("Pokušaj ponovnog povezivanja na MQTT...");
        if (connectMQTT()) {
            lastReconnectAttempt = 0;
        }
    }
}

// Kontrola pumpe
void controlPump(bool state) {
    digitalWrite(PUMP_PIN, state ? HIGH : LOW);
    Serial.print("Pumpa ");
    Serial.println(state ? "UKLJUČENA" : "ISKLJUČENA");
}
