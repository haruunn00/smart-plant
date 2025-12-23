#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>

struct SensorData {
    float temperature;     
    int soilMoisture;       
    int waterLevel;         
    int lightLevel;         
    int humidity;          
    unsigned long timestamp;
};

bool initSensors();
void initLEDs();
bool initDisplay();

SensorData readAllSensors();
int readSoilMoisture();
int readWaterLevel();
int readLightLevel();
float readTemperature();
int generateHumidity();  

bool isSoilDry();
bool isWaterLow();
bool isNightTime();

void setGreenLED(bool state);
void setRedLED(bool state);
void blinkLED(int pin, int times, int delayMs);

void updateDisplay(const SensorData& data);

#endif