#ifndef MQTT_H
#define MQTT_H

#include <WiFi.h>
#include <PubSubClient.h>
#include "sensors.h"

// Inicijalizacija
bool initMQTT();
bool connectMQTT();
void reconnectMQTT();
void mqttLoop();

// Callback
void mqttCallback(char* topic, byte* payload, unsigned int length);

// Objavljivanje
bool publishSensorData(const SensorData& data);

// Kontrola pumpe
void controlPump(bool state);

#endif