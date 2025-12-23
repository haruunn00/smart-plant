#include "sensors.h"
#include "config.h"

// ═══════════════════════════════════════════
// Inicijalizacija Senzora
// ═══════════════════════════════════════════
bool initSensors() {
    // Postavi analognu rezoluciju na 12-bit (0-4095)
    analogReadResolution(12);
    
    // Postavi pinove kao INPUT
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    pinMode(WATER_LEVEL_PIN, INPUT);
    pinMode(LDR_PIN, INPUT);
    pinMode(TEMP_SENSOR_PIN, INPUT);
    
    Serial.println("✓ Senzori inicijalizirani");
    Serial.println("  - Soil Moisture: GPIO 34");
    Serial.println("  - Water Level:    GPIO 35");
    Serial.println("  - LDR (Light):   GPIO 36 (VP)");
    Serial.println("  - Temperature:   GPIO 32");
    
    return true;
}

void initLEDs() {
    pinMode(GREEN_LED_PIN, OUTPUT);
    pinMode(RED_LED_PIN, OUTPUT);
    digitalWrite(GREEN_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, LOW);
    Serial.println("✓ LED diode inicijalizirane (GPIO 25, 26)");
}

// ═══════════════════════════════════════════
// Očitavanje Svih Senzora
// ═══════════════════════════════════════════
SensorData readAllSensors() {
    SensorData data;
    
    data.temperature = readTemperature();
    data.soilMoisture = readSoilMoisture();
    data.waterLevel = readWaterLevel();
    data.lightLevel = readLightLevel();
    data.humidity = generateHumidity();  // Simulirana vlažnost zraka
    data.timestamp = millis();
    
    return data;
}

// ═══════════════════════════════════════════
// Simulirana Vlažnost Zraka
// Normalne vrijednosti za sobne biljke: 40-70%
// ═══════════════════════════════════════════
int generateHumidity() {
    // Generira vrijednost između 45-65% (optimalno za većinu biljaka)
    return random(45, 66);
}

// ═══════════════════════════════════════════
// Soil Moisture Sensor (Kapacitivni)
// ═══════════════════════════════════════════
int readSoilMoisture() {
    int raw = analogRead(SOIL_MOISTURE_PIN);
    
    // Konvertuj u procenat
    // Napomena: Kapacitivni senzor - niža vrednost = mokro, viša = suvo
    int percent = map(raw, SOIL_DRY_VALUE, SOIL_WET_VALUE, 0, 100);
    percent = constrain(percent, 0, 100);
    
    return percent;
}

// ═══════════════════════════════════════════
// Water Level Sensor
// ═══════════════════════════════════════════
int readWaterLevel() {
    int raw = analogRead(WATER_LEVEL_PIN);
    
    // Konvertuj u procenat (0% = prazan, 100% = pun)
    int percent = map(raw, WATER_EMPTY_VALUE, WATER_FULL_VALUE, 0, 100);
    percent = constrain(percent, 0, 100);
    
    return percent;
}

// ═══════════════════════════════════════════
// Fotootpornik (LDR)
// ═══════════════════════════════════════════
int readLightLevel() {
    int raw = analogRead(LDR_PIN);
    
    // Konvertuj u procenat (0% = mrak, 100% = svetlo)
    int percent = map(raw, LDR_DARK_VALUE, LDR_BRIGHT_VALUE, 0, 100);
    percent = constrain(percent, 0, 100);
    
    return percent;
}

// ═══════════════════════════════════════════
// Temperature Sensor
// ═══════════════════════════════════════════
float readTemperature() {
    // Za LM35 analogni senzor
    int raw = analogRead(TEMP_SENSOR_PIN);
    float voltage = raw * (3.3 / 4095.0);
    float tempC = voltage * 100.0;  // LM35: 10mV po °C
    
    return tempC;
    
    /* 
     * Ako koristiš DHT22:
     * 
     * #include <DHT.h>
     * DHT dht(TEMP_SENSOR_PIN, DHT22);
     * 
     * void setup() {
     *   dht.begin();
     * }
     * 
     * float readTemperature() {
     *   return dht.readTemperature();
     * }
     */
    
    /* 
     * Ako koristiš DS18B20:
     * 
     * #include <OneWire. h>
     * #include <DallasTemperature.h>
     * 
     * OneWire oneWire(TEMP_SENSOR_PIN);
     * DallasTemperature sensors(&oneWire);
     * 
     * void setup() {
     *   sensors.begin();
     * }
     * 
     * float readTemperature() {
     *   sensors.requestTemperatures();
     *   return sensors.getTempCByIndex(0);
     * }
     */
}

// ═══════════════════════════════════════════
// Pomoćne Funkcije
// ═══════════════════════════════════════════
bool isSoilDry() {
    return readSoilMoisture() < SOIL_DRY_THRESHOLD;
}

bool isWaterLow() {
    return readWaterLevel() < WATER_MIN_LEVEL;
}

bool isNightTime() {
    return readLightLevel() < NIGHT_THRESHOLD;
}

// ═══════════════════════════════════════════
// LED Kontrola
// ═══════════════════════════════════════════
void setGreenLED(bool state) {
    digitalWrite(GREEN_LED_PIN, state ?  HIGH : LOW);
}

void setRedLED(bool state) {
    digitalWrite(RED_LED_PIN, state ? HIGH : LOW);
}

void blinkLED(int pin, int times, int delayMs) {
    for (int i = 0; i < times; i++) {
        digitalWrite(pin, HIGH);
        delay(delayMs);
        digitalWrite(pin, LOW);
        delay(delayMs);
    }
}