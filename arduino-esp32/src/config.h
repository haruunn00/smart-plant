#ifndef CONFIG_H
#define CONFIG_H

// WiFi konfiguracija
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"

// MQTT konfiguracija
#define MQTT_BROKER "192.168.1.100"  // Promijenite sa IP adresom vašeg MQTT brokera
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "ESP32_SmartPlant"
#define MQTT_TOPIC_SENSOR "smartplant/sensors"
#define MQTT_TOPIC_CONTROL "smartplant/control"

// Pinovi senzora
#define SOIL_MOISTURE_PIN 34      // Analogni pin za kapacitivni soil moisture senzor
#define PUMP_PIN 25               // Digitalni pin za relej pumpe

// I2C pinovi za BME280 i BH1750
#define I2C_SDA 21
#define I2C_SCL 22

// Intervali očitavanja (u milisekundama)
#define SENSOR_READ_INTERVAL 30000  // 30 sekundi
#define MQTT_RECONNECT_INTERVAL 5000  // 5 sekundi

// Prag vlažnosti tla (0-4095 na ESP32)
#define SOIL_DRY_THRESHOLD 2000
#define SOIL_WET_THRESHOLD 3000

#endif
