#ifndef CONFIG_H
#define CONFIG_H

// ═══════════════════════════════════════════
// WiFi Konfiguracija
// ═══════════════════════════════════════════
#define WIFI_SSID "hara"
#define WIFI_PASSWORD "12345678"

// ═══════════════════════════════════════════
// MQTT Konfiguracija
// ═══════════════════════════════════════════
#define MQTT_BROKER "192.168.1.100"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "ESP32_SmartPlant"
#define MQTT_TOPIC_SENSOR "smartplant/sensors"
#define MQTT_TOPIC_CONTROL "smartplant/control"

// ═══════════════════════════════════════════
// GPIO PINOVI - TVOJA KONFIGURACIJA
// ═══════════════════════════════════════════
// Senzori (Analogni - ADC1)
#define TEMP_SENSOR_PIN 32        // Senzor temperature (analogni LM35)
#define SOIL_MOISTURE_PIN 34      // Senzor vlažnosti tla
#define WATER_LEVEL_PIN 35        // Senzor količine tečnosti
#define LDR_PIN 36                // Fotootpornik (VP)

// I2C pinovi za OLED displej
#define I2C_SDA 21
#define I2C_SCL 22

// Aktuatori i LED diode (Digitalni OUTPUT)
#define PUMP_PIN 23               // Relej pumpe
#define GREEN_LED_PIN 25          // Zelena LED
#define RED_LED_PIN 26            // Crvena LED

// ═══════════════════════════════════════════
// Kalibracija Senzora - PRILAGODI SVOJIM SENZORIMA! 
// ═══════════════════════════════════════════
#define ADC_MAX_VALUE 4095

// Vlažnost tla (kapacitivni senzor)
#define SOIL_DRY_VALUE 3200       // Raw ADC kada je suvo
#define SOIL_WET_VALUE 1300       // Raw ADC kada je mokro
#define SOIL_DRY_THRESHOLD 30     // % - ispod ovoga je suvo

// Nivo vode (rezistivni ili kapacitivni)
#define WATER_EMPTY_VALUE 3500    // Raw ADC kada je prazan
#define WATER_FULL_VALUE 1000     // Raw ADC kada je pun
#define WATER_MIN_LEVEL 20        // % - minimum za rad pumpe

// Fotootpornik (LDR)
#define LDR_DARK_VALUE 50         // Raw ADC u mraku
#define LDR_BRIGHT_VALUE 3800     // Raw ADC na svetlu
#define NIGHT_THRESHOLD 30        // % - ispod je noć

// Temperatura (LM35: 10mV per °C)
// Ako koristiš drugi senzor (DHT22, DS18B20), promeni u sensors.cpp

// ═══════════════════════════════════════════
// Intervali
// ═══════════════════════════════════════════
#define SENSOR_READ_INTERVAL 5000      // Očitavanje svakih 5 sekundi
#define MQTT_RECONNECT_INTERVAL 5000   // Reconnect interval
#define PUMP_DURATION 5000             // Default trajanje pumpe (5s)

#endif