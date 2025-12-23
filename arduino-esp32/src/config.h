#ifndef CONFIG_H
#define CONFIG_H


#define WIFI_SSID "hara"
#define WIFI_PASSWORD "12345678"


#define MQTT_BROKER "192.168.0.105"
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "ESP32_SmartPlant"
#define MQTT_TOPIC_SENSOR "smartplant/sensors"
#define MQTT_TOPIC_CONTROL "smartplant/control"


#define TEMP_SENSOR_PIN 32        
#define SOIL_MOISTURE_PIN 34      
#define WATER_LEVEL_PIN 35       
#define LDR_PIN 33              

#define I2C_SDA 21
#define I2C_SCL 22

#define PUMP_PIN 27               
#define GREEN_LED_PIN 25          
#define RED_LED_PIN 26           

#define ADC_MAX_VALUE 4095

#define SOIL_DRY_VALUE 2500     
#define SOIL_WET_VALUE 1000       
#define SOIL_DRY_THRESHOLD 30     


#define WATER_EMPTY_VALUE 3000    
#define WATER_FULL_VALUE 500     
#define WATER_MIN_LEVEL 20        

#define LDR_DARK_VALUE 50         
#define LDR_BRIGHT_VALUE 3800     
#define NIGHT_THRESHOLD 30       


#define SIMULATE_DISCONNECTED_SENSORS true   

#define SENSOR_READ_INTERVAL 10000      
#define MQTT_RECONNECT_INTERVAL 5000   
#define PUMP_DURATION 5000             

#endif