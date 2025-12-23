#ifndef MQTT_H
#define MQTT_H

#include <WiFi.h>
#include <PubSubClient.h>
#include "sensors.h"

bool initMQTT();
bool connectMQTT();
void reconnectMQTT();
void mqttLoop();

void mqttCallback(char* topic, byte* payload, unsigned int length);

bool publishSensorData(const SensorData& data);

void controlPump(bool state);
void updatePumpLED();
bool isPumpRunning();

#endif