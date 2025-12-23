#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>

// ═══════════════════════════════════════════
// Struktura za Senzorske Podatke
// ═══════════════════════════════════════════
struct SensorData {
    float temperature;      // Temperatura u °C
    int soilMoisture;       // Vlažnost tla u %
    int waterLevel;         // Nivo vode u %
    int lightLevel;         // Razina svjetlosti u %
    int humidity;           // Vlažnost zraka u % (simulirana)
    unsigned long timestamp;
};

// ═══════════════════════════════════════════
// Funkcije za Inicijalizaciju
// ═══════════════════════════════════════════
bool initSensors();
void initLEDs();

// ═══════════════════════════════════════════
// Funkcije za Očitavanje Senzora
// ═══════════════════════════════════════════
SensorData readAllSensors();
int readSoilMoisture();
int readWaterLevel();
int readLightLevel();
float readTemperature();
int generateHumidity();    // Simulirana vlažnost zraka

// ═══════════════════════════════════════════
// Pomoćne Funkcije
// ═══════════════════════════════════════════
bool isSoilDry();
bool isWaterLow();
bool isNightTime();

// ═══════════════════════════════════════════
// LED Kontrola
// ═══════════════════════════════════════════
void setGreenLED(bool state);
void setRedLED(bool state);
void blinkLED(int pin, int times, int delayMs);

#endif