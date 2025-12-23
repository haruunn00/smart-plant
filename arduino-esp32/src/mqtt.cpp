#include "mqtt.h"
#include "config.h"
#include "sensors.h"
#include <ArduinoJson.h>

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ═══════════════════════════════════════════
// Inicijalizacija MQTT
// ═══════════════════════════════════════════
bool initMQTT() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    mqttClient.setCallback(mqttCallback);
    
    // Postavi pin za pumpu
    pinMode(PUMP_PIN, OUTPUT);
    digitalWrite(PUMP_PIN, HIGH);  // Relay OFF (inverted logic)
    
    Serial.println("✓ MQTT inicijaliziran");
    Serial.print("  Broker: ");
    Serial.print(MQTT_BROKER);
    Serial.print(":");
    Serial.println(MQTT_PORT);
    
    return true;
}

// ═══════════════════════════════════════════
// Povezivanje na MQTT Broker
// ═══════════════════════════════════════════
bool connectMQTT() {
    Serial.print("Povezivanje na MQTT broker.. .");
    
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
        Serial.println(" ✓ povezano!");
        
        // Pretplati se na control topic
        mqttClient.subscribe(MQTT_TOPIC_CONTROL);
        Serial.print("Pretplaćen na:  ");
        Serial.println(MQTT_TOPIC_CONTROL);
        
        // Blink zelena LED kao potvrda
        blinkLED(GREEN_LED_PIN, 2, 200);
        
        return true;
    } else {
        Serial.print(" ✗ greška, rc=");
        Serial.println(mqttClient.state());
        
        // Blink crvena LED kao greška
        blinkLED(RED_LED_PIN, 3, 100);
        
        return false;
    }
}

// ═══════════════════════════════════════════
// Objavljivanje Senzorskih Podataka
// ═══════════════════════════════════════════
bool publishSensorData(const SensorData& data) {
    // Kreiraj JSON dokument
    StaticJsonDocument<256> doc;
    
    doc["device_id"] = MQTT_CLIENT_ID;
    doc["temperature"] = data.temperature;
    doc["soil_moisture"] = data.soilMoisture;
    doc["water_level"] = data.waterLevel;
    doc["light_level"] = data. lightLevel;
    doc["humidity"] = data.humidity;  // Simulirana vlažnost zraka
    doc["timestamp"] = data.timestamp;
    
    // Serijaliziraj u string
    char jsonBuffer[256];
    serializeJson(doc, jsonBuffer);
    
    // Objavi na MQTT topic
    bool success = mqttClient.publish(MQTT_TOPIC_SENSOR, jsonBuffer);
    
    if (success) {
        Serial.println("📤 Podaci poslani:");
        Serial.println(jsonBuffer);
    } else {
        Serial.println("❌ Greška pri slanju podataka!");
    }
    
    return success;
}

// ═══════════════════════════════════════════
// MQTT Callback - Primanje Poruka
// ═══════════════════════════════════════════
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.print("📩 Poruka na topic: ");
    Serial.println(topic);
    
    // Konvertuj payload u string
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';
    
    Serial.print("Sadržaj:  ");
    Serial.println(message);
    
    // Parsiraj JSON
    StaticJsonDocument<128> doc;
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
        Serial.print("JSON greška: ");
        Serial.println(error.c_str());
        return;
    }
    
    // Kontrola pumpe
    if (doc. containsKey("pump")) {
        bool pumpState = doc["pump"];
        controlPump(pumpState);
    }
}

// ═══════════════════════════════════════════
// Kontrola Pumpe
// ═══════════════════════════════════════════
void controlPump(bool state) {
    // Proveri nivo vode pre uključivanja
    if (state && isWaterLow()) {
        Serial.println("❌ NIZAK NIVO VODE - Pumpa se ne može uključiti!");
        blinkLED(RED_LED_PIN, 5, 100);
        return;
    }
    
    digitalWrite(PUMP_PIN, state ?  LOW : HIGH);  // Relay inverted logic
    
    Serial.print("💧 Pumpa: ");
    Serial.println(state ? "UKLJUČENA" : "ISKLJUČENA");
    
    // LED indikacija
    if (state) {
        setGreenLED(true);
    } else {
        setGreenLED(false);
    }
}

// ═══════════════════════════════════════════
// MQTT Loop
// ═══════════════════════════════════════════
void mqttLoop() {
    if (!mqttClient.connected()) {
        reconnectMQTT();
    }
    mqttClient.loop();
}

// ═══════════════════════════════════════════
// Reconnect
// ═══════════════════════════════════════════
void reconnectMQTT() {
    static unsigned long lastAttempt = 0;
    unsigned long now = millis();
    
    if (now - lastAttempt > MQTT_RECONNECT_INTERVAL) {
        lastAttempt = now;
        
        Serial.println("🔄 Pokušaj ponovnog povezivanja...");
        if (connectMQTT()) {
            lastAttempt = 0;
        }
    }
}