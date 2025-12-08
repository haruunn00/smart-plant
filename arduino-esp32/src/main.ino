#include <WiFi.h>
#include "config.h"
#include "sensors.h"
#include "mqtt.h"

// Varijable za timing
unsigned long lastSensorRead = 0;

void setup() {
    // Inicijaliziraj serijsku komunikaciju
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n\n=== Smart Plant IoT System ===");
    Serial.println("Inicijalizacija...\n");
    
    // Povezivanje na WiFi
    Serial.print("Povezivanje na WiFi: ");
    Serial.println(WIFI_SSID);
    
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi povezan!");
        Serial.print("IP adresa: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nGreška: Nije moguće spojiti se na WiFi!");
        return;
    }
    
    // Inicijaliziraj senzore
    if (!initSensors()) {
        Serial.println("Greška pri inicijalizaciji senzora!");
        return;
    }
    
    // Inicijaliziraj MQTT
    if (!initMQTT()) {
        Serial.println("Greška pri inicijalizaciji MQTT klijenta!");
        return;
    }
    
    // Poveži se na MQTT broker
    connectMQTT();
    
    Serial.println("\nSistem je spreman!");
}

void loop() {
    unsigned long currentMillis = millis();
    
    // Održavaj MQTT konekciju
    mqttLoop();
    
    // Očitaj senzore svakih 30 sekundi
    if (currentMillis - lastSensorRead >= SENSOR_READ_INTERVAL) {
        lastSensorRead = currentMillis;
        
        Serial.println("\n--- Očitavanje senzora ---");
        
        // Očitaj sve senzore
        SensorData data = readAllSensors();
        
        // Ispiši podatke u serijskom monitoru
        Serial.print("Temperatura: ");
        Serial.print(data.temperature);
        Serial.println(" °C");
        
        Serial.print("Vlažnost zraka: ");
        Serial.print(data.humidity);
        Serial.println(" %");
        
        Serial.print("Tlak: ");
        Serial.print(data.pressure);
        Serial.println(" hPa");
        
        Serial.print("Vlažnost tla: ");
        Serial.print(data.soilMoisture);
        Serial.println(" %");
        
        Serial.print("Razina svjetlosti: ");
        Serial.print(data.lightLevel);
        Serial.println(" lux");
        
        // Objavi podatke na MQTT
        if (WiFi.status() == WL_CONNECTED) {
            publishSensorData(data);
        } else {
            Serial.println("WiFi nije povezan, pokušavam ponovno...");
            WiFi.reconnect();
        }
        
        // Provjeri je li tlo suho i upozori
        if (isSoilDry()) {
            Serial.println("UPOZORENJE: Tlo je suho! Možda je vrijeme za zalijevanje.");
        }
    }
    
    // Malo kašnjenje
    delay(100);
}
