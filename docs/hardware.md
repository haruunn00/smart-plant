# Hardware Setup - Smart Plant IoT System

## Komponente

### ESP32 DevKit
- Glavni mikrokontroler sa WiFi i Bluetooth
- 38 pinova
- Napon: 3.3V logika, napajanje 5V preko USB

### Senzori

#### 1. Capacitive Soil Moisture Sensor v1.2
- **Opis**: Kapacitivni senzor za mjerenje vlažnosti tla
- **Napon**: 3.3V - 5V
- **Izlaz**: Analogni signal (0-3.3V)
- **Prednosti**: Otporan na koroziju, preciznije od rezistivnih senzora

**Pinovi:**
- VCC → 3.3V (ESP32)
- GND → GND (ESP32)
- AOUT → GPIO34 (ESP32) - Analogni pin

#### 2. BME280 Temperature, Humidity, Pressure Sensor
- **Opis**: Digitalni senzor za temperaturu, vlažnost i tlak zraka
- **Napon**: 3.3V
- **Komunikacija**: I2C
- **I2C Adresa**: 0x76 ili 0x77

**Pinovi:**
- VCC → 3.3V (ESP32)
- GND → GND (ESP32)
- SCL → GPIO22 (ESP32) - I2C Clock
- SDA → GPIO21 (ESP32) - I2C Data

#### 3. BH1750 Light Sensor
- **Opis**: Digitalni senzor za mjerenje razine svjetlosti
- **Napon**: 3.3V - 5V
- **Komunikacija**: I2C
- **Raspon**: 1-65535 lux
- **I2C Adresa**: 0x23 ili 0x5C

**Pinovi:**
- VCC → 3.3V (ESP32)
- GND → GND (ESP32)
- SCL → GPIO22 (ESP32) - I2C Clock (dijeli sa BME280)
- SDA → GPIO21 (ESP32) - I2C Data (dijeli sa BME280)

### Aktuatori

#### Vodena pumpa sa relejnim modulom
- **Pumpa**: 5V DC mini vodena pumpa
- **Relej modul**: 5V 1-channel relay
- **Kontrola**: GPIO25 (ESP32)

**Pinovi Releja:**
- VCC → 5V (ESP32)
- GND → GND (ESP32)
- IN → GPIO25 (ESP32) - Kontrolni signal

**Pumpa konekcija:**
- Pumpa+ → 5V napajanje (vanjski izvor)
- Pumpa- → Relej NO (Normally Open)
- Relej COM → GND napajanja

## Shema Spajanja

```
ESP32 DevKit
┌─────────────────────┐
│                     │
│  3.3V ──────────────┼──┬──┬──┬─── VCC (BME280)
│                     │  │  │  │
│                     │  │  │  └─── VCC (BH1750)
│                     │  │  │
│                     │  │  └────── VCC (Soil Sensor)
│                     │  │
│  GND ───────────────┼──┴──┴──┴─── GND (All Sensors)
│                     │
│  GPIO34 (ADC) ──────┼─────────── AOUT (Soil Sensor)
│                     │
│  GPIO21 (SDA) ──────┼──┬──────── SDA (BME280)
│                     │  │
│                     │  └──────── SDA (BH1750)
│                     │
│  GPIO22 (SCL) ──────┼──┬──────── SCL (BME280)
│                     │  │
│                     │  └──────── SCL (BH1750)
│                     │
│  GPIO25 ────────────┼─────────── IN (Relay Module)
│                     │
│  5V ────────────────┼─────────── VCC (Relay Module)
│                     │
└─────────────────────┘

Relay Module        Water Pump
┌──────────┐       ┌─────────┐
│ VCC  IN  │       │   +     │
│ GND  COM ├───────┤   -     │
│     NO   │       └─────────┘
└──────────┘
      │
      └──── External 5V Power Supply
```

## Montaža

### Korak 1: Priprema
1. Provjerite da je ESP32 neoštećen
2. Pripremite sve senzore i kablove
3. Pripremite breadboard ili perfboard za montažu

### Korak 2: Spajanje I2C senzora
1. Spojite BME280 na I2C pinove (GPIO21, GPIO22)
2. Spojite BH1750 na iste I2C pinove (mogu dijeliti sabirnicu)
3. Provjerite I2C adrese senzora (različite adrese potrebne)

### Korak 3: Spajanje Soil Moisture senzora
1. Umetnite senzor u zemlju biljke (2-4cm dubine)
2. Spojite AOUT na GPIO34 (analogni pin)
3. Napajanje na 3.3V

### Korak 4: Spajanje releja i pumpe
1. Spojite relej na GPIO25
2. **VAŽNO**: Koristite vanjski izvor napajanja za pumpu (ne ESP32)
3. Spojite pumpu kroz relej modul

### Korak 5: Testiranje
1. Upload sketch na ESP32
2. Otvorite Serial Monitor (115200 baud)
3. Provjerite očitavanja senzora
4. Testirajte kontrolu pumpe

## Napajanje

### Opcija 1: USB napajanje (Development)
- ESP32 napajan preko USB porta
- Pumpa mora imati vanjski izvor

### Opcija 2: Vanjsko napajanje (Production)
- 5V 2A adapter
- Reguliraj 3.3V za ESP32 ako je potrebno
- Zasebno napajanje za pumpu

## Kalibracija

### Soil Moisture Sensor
1. Suho tlo: Očitaj vrijednost (npr. 500)
2. Mokro tlo: Očitaj vrijednost (npr. 3500)
3. Ažuriraj `SOIL_DRY_THRESHOLD` i `SOIL_WET_THRESHOLD` u `config.h`

### BME280
- Obično ne zahtijeva kalibraciju
- Usporedi sa drugim termometrom za provjeru

### BH1750
- Testirati u različitim uvjetima osvjetljenja
- 0 lux = potpuni mrak
- 400-1000 lux = optimalno za biljke

## Mjere predostrožnosti

⚠️ **VAŽNO:**
1. Ne priklјučujte pumpu direktno na ESP32 - koristite relej
2. Vodite računa o naponu - ESP32 je 3.3V logika
3. Kapacitivni soil sensor ne stavljajte u vodu
4. Redovito provjeravajte kablove za vlagu
5. Zaštitite elektroniku od prskanja vode

## Troubleshooting

### Problem: BME280 nije pronađen
- **Rješenje**: Provjerite I2C adresu (0x76 ili 0x77)
- Koristite I2C scanner za detekciju adrese

### Problem: Soil sensor pokazuje konstantnu vrijednost
- **Rješenje**: Provjerite je li senzor pravilno umetnut u zemlju
- Provjerite analogni pin

### Problem: Pumpa ne radi
- **Rješenje**: Provjerite napajanje pumpe (vanjski izvor)
- Provjerite relej konekcije
- Testirajte relej sa LED diodoma

### Problem: WiFi se ne povezuje
- **Rješenje**: Ažurirajte SSID i password u `config.h`
- Provjerite jačinu WiFi signala
- ESP32 podržava samo 2.4GHz WiFi

## Reference

- [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- [BME280 Datasheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf)
- [BH1750 Datasheet](https://www.mouser.com/datasheet/2/348/bh1750fvi-e-186247.pdf)
