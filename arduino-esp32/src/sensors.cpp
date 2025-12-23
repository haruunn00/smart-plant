#include "sensors.h"
#include "config.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
bool displayInitialized = false;

unsigned long lastDisplayChange = 0;
int currentDisplayPage = 0;
#define DISPLAY_ROTATE_INTERVAL 3000  
#define TOTAL_DISPLAY_PAGES 5


SensorData cachedData;


bool initSensors() {
    analogReadResolution(12);
    
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    pinMode(WATER_LEVEL_PIN, INPUT);
    pinMode(LDR_PIN, INPUT);
    pinMode(TEMP_SENSOR_PIN, INPUT);
    
    Serial.println("✓ Senzori inicijalizirani");
    Serial.println("  - Soil Moisture: GPIO 34");
    Serial.println("  - Water Level:   GPIO 35");
    Serial.println("  - LDR (Light):   GPIO 33");
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

bool initDisplay() {
    Wire.begin(I2C_SDA, I2C_SCL);
    
    if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
        Serial.println("❌ OLED Display nije pronađen!");
        displayInitialized = false;
        return false;
    }
    
    displayInitialized = true;
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("Smart Plant");
    display.println("Starting...");
    display.display();
    
    Serial.println("✓ OLED Display inicijaliziran (I2C SDA:21, SCL:22)");
    return true;
}

SensorData readAllSensors() {
    SensorData data;
    
    data.temperature = readTemperature();
    data.soilMoisture = readSoilMoisture();
    data.waterLevel = readWaterLevel();
    data.lightLevel = readLightLevel();
    data.humidity = generateHumidity();  
    data.timestamp = millis();
    
    return data;
}


int generateHumidity() {
    return random(45, 66);
}

int readSoilMoisture() {
    int raw = analogRead(SOIL_MOISTURE_PIN);
    Serial.print("  [DEBUG] Soil RAW: ");
    Serial.println(raw);
    
    #if SIMULATE_DISCONNECTED_SENSORS
    if (raw <= 10 || raw >= 4090) {
        return random(40, 75); 
    }
    #endif
    
    int percent = map(raw, SOIL_DRY_VALUE, SOIL_WET_VALUE, 0, 100);
    percent = constrain(percent, 0, 100);
    
    return percent;
}

int readWaterLevel() {
    int raw = analogRead(WATER_LEVEL_PIN);
    Serial.print("  [DEBUG] Water RAW: ");
    Serial.println(raw);
    
    #if SIMULATE_DISCONNECTED_SENSORS
    if (raw <= 10 || raw >= 4090) {
        return random(60, 90); 
    }
    #endif
    
    int percent = map(raw, WATER_EMPTY_VALUE, WATER_FULL_VALUE, 0, 100);
    percent = constrain(percent, 0, 100);
    
    return percent;
}

int readLightLevel() {
    int raw = analogRead(LDR_PIN);
    Serial.print("  [DEBUG] Light RAW: ");
    Serial.println(raw);
    
    int percent = map(raw, LDR_DARK_VALUE, LDR_BRIGHT_VALUE, 0, 100);
    percent = constrain(percent, 0, 100);
    
    return percent;
}

float readTemperature() {
    int raw = analogRead(TEMP_SENSOR_PIN);
    Serial.print("  [DEBUG] Temp RAW: ");
    Serial.println(raw);
    
    #if SIMULATE_DISCONNECTED_SENSORS
    if (raw <= 10 || raw >= 4090) {
        return 20.0 + (random(0, 100) / 10.0);  
    }
    #endif
  
    float voltage = raw * (3.3 / 4095.0);
    float tempC = voltage * 100.0; 

    if (tempC > 60.0) tempC = 25.0; 
    if (tempC < -10.0) tempC = 20.0;
    
    return tempC;
    
   
}

bool isSoilDry() {
    return readSoilMoisture() < SOIL_DRY_THRESHOLD;
}

bool isWaterLow() {
    return readWaterLevel() < WATER_MIN_LEVEL;
}

bool isNightTime() {
    return readLightLevel() < NIGHT_THRESHOLD;
}


void setGreenLED(bool state) {
    digitalWrite(GREEN_LED_PIN, state ? HIGH : LOW);
    Serial.print("  [LED] Zelena: ");
    Serial.println(state ? "ON" : "OFF");
}

void setRedLED(bool state) {
    digitalWrite(RED_LED_PIN, state ? HIGH : LOW);
    Serial.print("  [LED] Crvena: ");
    Serial.println(state ? "ON" : "OFF");
}

void blinkLED(int pin, int times, int delayMs) {
    for (int i = 0; i < times; i++) {
        digitalWrite(pin, HIGH);
        delay(delayMs);
        digitalWrite(pin, LOW);
        delay(delayMs);
    }
}

void updateDisplay(const SensorData& data) {
    if (!displayInitialized) return;
    
    cachedData = data;
    
    unsigned long now = millis();
    
    if (now - lastDisplayChange >= DISPLAY_ROTATE_INTERVAL) {
        lastDisplayChange = now;
        currentDisplayPage = (currentDisplayPage + 1) % TOTAL_DISPLAY_PAGES;
    }
    
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    
    display.setCursor(0, 0);
    display.println(" Smart Plant ");
    display.println();
    
    display.setTextSize(2);
    
    switch (currentDisplayPage) {
        case 0: 
            display.setCursor(0, 20);
            display.println("TEMP:");
            display.setCursor(0, 42);
            display.print(cachedData.temperature, 1);
            display.println(" C");
            break;
            
        case 1: 
            display.setCursor(0, 20);
            display.println("SOIL:");
            display.setCursor(0, 42);
            display.print(cachedData.soilMoisture);
            display.println(" %");
            break;
            
        case 2:  
            display.setCursor(0, 20);
            display.println("WATER:");
            display.setCursor(0, 42);
            display.print(cachedData.waterLevel);
            display.println(" %");
            break;
            
        case 3:  
            display.setCursor(0, 20);
            display.println("LIGHT:");
            display.setCursor(0, 42);
            display.print(cachedData.lightLevel);
            display.println(" %");
            break;
            
        case 4: 
            display.setCursor(0, 20);
            display.println("HUMID:");
            display.setCursor(0, 42);
            display.print(cachedData.humidity);
            display.println(" %");
            break;
    }
    
    display.setTextSize(1);
    display.setCursor(100, 56);
    display.print(currentDisplayPage + 1);
    display.print("/");
    display.print(TOTAL_DISPLAY_PAGES);
    
    display.display();
}