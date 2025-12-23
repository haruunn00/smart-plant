#include <Arduino.h>
#include <WiFi.h>
#include "config.h"
#include "sensors.h"
#include "mqtt.h"

unsigned long lastSensorRead = 0;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n\n╔═══════════════════════════════════╗");
    Serial.println("║  Smart Plant IoT System v2.0     ║");
    Serial.println("║  ESP32 DevKit v1                  ║");
    Serial.println("╚═══════════════════════════════════╝\n");
  
    initLEDs();
    
    setRedLED(true);
    setGreenLED(false);
    Serial.println("🔴 Crvena LED ON - Pumpa ugašena pri startu");

    if (!initDisplay()) {
        Serial.println("⚠️ OLED Display nije dostupan - nastavljam bez njega");
    }
    
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
        Serial.println("\n✓ WiFi povezan!");
        Serial.print("IP adresa: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\n❌ WiFi greška!");
        blinkLED(RED_LED_PIN, 10, 200);
        return;
    }
    
    if (!initSensors()) {
        Serial.println("❌ Greška: Senzori!");
        return;
    }
    
    if (!initMQTT()) {
        Serial.println("❌ MQTT greška!");
        return;
    }
    
    connectMQTT();
    
    Serial.println("\n═══════════════════════════════════");
    Serial.println("  ✓ Sistem spreman!");
    Serial.println("  🔴 Crvena LED = Pumpa ugašena");
    Serial.println("  🟢 Zelena LED blinka = Pumpa radi");
    Serial.println("═══════════════════════════════════\n");
    
    setRedLED(true);
    setGreenLED(false);
    
    randomSeed(analogRead(33));  
}

void loop() {
    unsigned long currentMillis = millis();
    
    mqttLoop();

    updatePumpLED();
    
    if (currentMillis - lastSensorRead >= SENSOR_READ_INTERVAL) {
        lastSensorRead = currentMillis;
        
        Serial.println("\n─── Očitavanje senzora ───");
        
        SensorData data = readAllSensors();
        
        // Ispis na Serial
        Serial.print("🌡️  Temperatura:     ");
        Serial.print(data.temperature, 1);
        Serial.println(" °C");
        
        Serial.print("💧 Vlažnost tla:    ");
        Serial.print(data.soilMoisture);
        Serial.println(" %");
        
        Serial.print("🚰 Nivo vode:       ");
        Serial.print(data.waterLevel);
        Serial.println(" %");
        
        Serial.print("💡 Svjetlost (LDR): ");
        Serial.print(data.lightLevel);
        Serial.println(" %");
        
        Serial.print("💨 Vlažnost zraka:  ");
        Serial.print(data.humidity);
        Serial.println(" %");
        
        updateDisplay(data);
        
        if (WiFi.status() == WL_CONNECTED) {
            publishSensorData(data);
        } else {
            Serial.println("⚠️  WiFi nije povezan!");
            WiFi.reconnect();
        }
  
        if (!isPumpRunning()) {
            if (isSoilDry()) {
                Serial.println("⚠️  TLO JE SUVO!");
            }
            
            if (isWaterLow()) {
                Serial.println("⚠️  NIZAK NIVO VODE!");
            }
            
            if (isNightTime()) {
                Serial.println("🌙 Noć je");
            }
            
            setRedLED(true);
            setGreenLED(false);
        }
    }
    
    delay(10); 
}
