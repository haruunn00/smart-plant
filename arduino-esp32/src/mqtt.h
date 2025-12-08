#ifndef MQTT_H
#define MQTT_H

#include <Arduino.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include "sensors.h"

// Inicijalizacija MQTT klijenta
bool initMQTT();

// Povezivanje na MQTT broker
bool connectMQTT();

// Objavljivanje senzorskih podataka
bool publishSensorData(const SensorData& data);

// Callback funkcija za primanje poruka
void mqttCallback(char* topic, byte* payload, unsigned int length);

// Loop funkcija za održavanje MQTT konekcije
void mqttLoop();

// Provjera konekcije i pokušaj ponovnog povezivanja
void reconnectMQTT();

// Kontrola pumpe
void controlPump(bool state);

#endif
