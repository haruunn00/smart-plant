#ifndef CONFIG_H
#define CONFIG_H

#define WIFI_SSID "hara"
#define WIFI_PASSWORD "12345678"

#define MQTT_BROKER "192.168.1.100"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "ESP32_SmartPlant"
#define MQTT_TOPIC_SENSOR "smartplant/sensors"
#define MQTT_TOPIC_CONTROL "smartplant/control"


#define SOIL_MOISTURE_PIN 34      // Analogni pin za kapacitivni soil moisture senzor
#define PUMP_PIN 25               // Digitalni pin za relej pumpe

// I2C pinovi za BME280 i BH1750
#define I2C_SDA 21
#define I2C_SCL 22

#define SENSOR_READ_INTERVAL 30000 
#define MQTT_RECONNECT_INTERVAL 5000 

#define ADC_MAX_VALUE 4095
#define SOIL_DRY_VALUE 500      // Raw ADC value when dry (calibrate for your sensor)
#define SOIL_WET_VALUE 3500     // Raw ADC value when wet (calibrate for your sensor)
#define SOIL_DRY_THRESHOLD 30   // Percentage threshold for dry soil

#endif
