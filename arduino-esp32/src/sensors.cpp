#include "sensors.h"
#include "config.h"
#include <Wire.h>

// Globalni objekti senzora
Adafruit_BME280 bme;
BH1750 lightMeter;

// Inicijalizacija svih senzora
bool initSensors() {
    // Postavi I2C pinove
    Wire.begin(I2C_SDA, I2C_SCL);
    
    // Inicijaliziraj BME280
    if (!bme.begin(0x76)) {
        Serial.println("Greška: BME280 nije pronađen!");
        return false;
    }
    
    // Inicijaliziraj BH1750
    if (!lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
        Serial.println("Greška: BH1750 nije pronađen!");
        return false;
    }
    
    // Postavi pin za soil moisture senzor
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    
    Serial.println("Svi senzori uspješno inicijalizirani!");
    return true;
}

// Očitaj sve senzore i vrati strukturu podataka
SensorData readAllSensors() {
    SensorData data;
    
    data.temperature = readTemperature();
    data.humidity = readHumidity();
    data.pressure = readPressure();
    data.soilMoisture = readSoilMoisture();
    data.lightLevel = readLightLevel();
    data.timestamp = millis();
    
    return data;
}

// Očitaj soil moisture senzor (analogna vrijednost)
int readSoilMoisture() {
    int rawValue = analogRead(SOIL_MOISTURE_PIN);
    // Pretvori u postotak (0-100%)
    // Niža vrijednost = suho tlo, viša vrijednost = mokro tlo
    int percentage = map(rawValue, 0, 4095, 0, 100);
    return percentage;
}

// Očitaj temperaturu iz BME280
float readTemperature() {
    return bme.readTemperature();
}

// Očitaj vlažnost zraka iz BME280
float readHumidity() {
    return bme.readHumidity();
}

// Očitaj tlak iz BME280
float readPressure() {
    return bme.readPressure() / 100.0F;  // Pretvori u hPa
}

// Očitaj razinu svjetlosti iz BH1750
float readLightLevel() {
    return lightMeter.readLightLevel();
}

// Provjeri je li tlo suho
bool isSoilDry() {
    int moisture = readSoilMoisture();
    return moisture < 30;  // Manje od 30% vlažnosti
}
