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
    
    // ═══════════════════════════════════════════
    // Inicijalizacija LED dioda
    // ═══════════════════════════════════════════
    initLEDs();
    setRedLED(true);  // Crvena tokom inicijalizacije
    
    // ═══════════════════════════════════════════
    // WiFi Povezivanje
    // ═══════════════════════════════════════════
    Serial.print("Povezivanje na WiFi:  ");
    Serial.println(WIFI_SSID);
    
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi. status() == WL_CONNECTED) {
        Serial.println("\n✓ WiFi povezan!");
        Serial.print("IP adresa: ");
        Serial.println(WiFi.localIP());
        setGreenLED(true);
        setRedLED(false);
    } else {
        Serial.println("\n❌ WiFi greška!");
        setRedLED(true);
        blinkLED(RED_LED_PIN, 10, 200);
        return;
    }
    
    // ═══════════════════════════════════════════
    // Inicijalizacija Senzora
    // ═══════════════════════════════════════════
    if (!initSensors()) {
        Serial.println("❌ Greška:  Senzori!");
        setRedLED(true);
        return;
    }
    
    // ═══════════════════════════════════════════
    // Inicijalizacija MQTT
    // ═══════════════════════════════════════════
    if (!initMQTT()) {
        Serial.println("❌ MQTT greška!");
        return;
    }
    
    connectMQTT();
    
    Serial.println("\n═══════════════════════════════════");
    Serial.println("  ✓ Sistem spreman!");
    Serial.println("═══════════════════════════════════\n");
    
    setRedLED(false);
    blinkLED(GREEN_LED_PIN, 3, 200);
}

void loop() {
    unsigned long currentMillis = millis();
    
    // ═══════════════════════════════════════════
    // MQTT Loop
    // ═══════════════════════════════════════════
    mqttLoop();
    
    // ═══════════════════════════════════════════
    // Očitavanje Senzora
    // ═══════════════════════════════════════════
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
        
        // Objavi podatke preko MQTT
        if (WiFi.status() == WL_CONNECTED) {
            publishSensorData(data);
        } else {
            Serial.println("⚠️  WiFi nije povezan!");
            WiFi.reconnect();
        }
        
        // Upozorenja
        if (isSoilDry()) {
            Serial.println("⚠️  TLO JE SUVO!");
            blinkLED(RED_LED_PIN, 2, 100);
        }
        
        if (isWaterLow()) {
            Serial. println("⚠️  NIZAK NIVO VODE!");
            blinkLED(RED_LED_PIN, 3, 100);
        }
        
        if (isNightTime()) {
            Serial.println("🌙 Noć je");
        }
        
        // LED status
        if (isSoilDry() || isWaterLow()) {
            setRedLED(true);
            setGreenLED(false);
        } else {
            setRedLED(false);
            setGreenLED(true);
        }
    }
    
    delay(100);
}