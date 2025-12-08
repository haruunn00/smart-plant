#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include <Adafruit_BME280.h>
#include <BH1750.h>

// Struktura za senzorske podatke
struct SensorData {
    float temperature;
    float humidity;
    float pressure;
    int soilMoisture;
    float lightLevel;
    unsigned long timestamp;
};

// Inicijalizacija senzora
bool initSensors();

// Očitavanje svih senzora
SensorData readAllSensors();

// Očitavanje pojedinačnih senzora
int readSoilMoisture();
float readTemperature();
float readHumidity();
float readPressure();
float readLightLevel();

// Provjera je li tlo suho
bool isSoilDry();

#endif
