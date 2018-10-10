#include <NTPClient.h>

// Copyright (c) Arduino. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// change the next three lines to use on non-WiFi101 based boards/shields
//#include <WiFi101.h>
//#include <WiFiSSLClient.h>
//#include <WiFiUdp.h>

// for ESP8266
//#include <ESP8266WiFi.h>
//#include <WiFiClientSecure.h>
//#include <WiFiUdp.h>

// for Adafruit WINC1500
#include <Adafruit_WINC1500.h>
#include <Adafruit_WINC1500SSLClient.h>
#include <Adafruit_WINC1500Udp.h>

// for the Adafruit WINC1500 we need to create our own WiFi instance
// // Define the WINC1500 board connections below.
 #define WINC_CS   8
 #define WINC_IRQ  7
 #define WINC_RST  4
 #define WINC_EN   2     // or, tie EN to VCC
// // Setup the WINC1500 connection with the pins above and the default hardware SPI.
 Adafruit_WINC1500 WiFi(WINC_CS, WINC_IRQ, WINC_RST);

// for ESP8266 boards comment the next line
#include <NTPClient.h>
#include <AzureIoTHub.h>
#include "simplesample_http.h"


static const char ssid[] = "[Insert Your Value Here]";
static const char pass[] = "[Insert your Key here]";

// change the next line to use on non-WiFi101 based boards/shields
//WiFiSSLClient sslClient;
//WiFiClientSecure sslClient; // for ESP8266
Adafruit_WINC1500SSLClient sslClient; // for Adafruit WINC1500

AzureIoTHubClient iotHubClient(sslClient);

void setup() {

  
  initSerial();
  initWifi();
  initTime();
  InitLedPin();
  iotHubClient.begin();
}

void loop() {
  simplesample_http_run();
}

void initSerial() {
  //Initialize serial and wait for port to open:
  // For SAMD boards (e.g. MKR1000, Adafruit WINC1500 based)
  Serial.begin(152000);
  
  // Uncomment the next two lines For ESP8266 boards (and comment out the line above)
  // Serial.begin(115200);
  // Serial.setDebugOutput(true);

  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
}

void initWifi() {
  // for the Adafruit WINC1500 we need to enable the chip
  //pinMode(WINC_EN, OUTPUT);
  //digitalWrite(WINC_EN, HIGH);
  pinMode(WINC_EN, INPUT_PULLUP);

  // check for the presence of the shield :
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue:
    while (true);
  }

  // attempt to connect to Wifi network:
  Serial.print("Attempting to connect to SSID: ");
  Serial.println(ssid);

  // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // unsuccessful, retry in 4 seconds
    Serial.print("failed ... ");
    delay(4000);
    Serial.print("retrying ... ");
  }

  Serial.println("Connected to wifi");
}

void initTime() {
  // change the next line to use on non-WiFi101, for ESP8266 boards see comment below
  //WiFiUDP ntpUdp;
  Adafruit_WINC1500UDP ntpUdp; // for Adafruit WINC1500
  NTPClient ntpClient(ntpUdp);

  ntpClient.begin();

  while (!ntpClient.update()) {
    Serial.println("Fetching NTP epoch time failed! Waiting 5 seconds to retry.");
    delay(5000);
  }

  ntpClient.end();

  unsigned long epochTime = ntpClient.getEpochTime();

  Serial.print("Fetched NTP epoch time is: ");
  Serial.println(epochTime);

  iotHubClient.setEpochTime(epochTime);
  
  // For ESP8266 boards comment out the above portion of the function and un-comment
  // the remainder below.
  
  // time_t epochTime;

  // configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  // while (true) {
  //     epochTime = time(NULL);

  //     if (epochTime == 0) {
  //         Serial.println("Fetching NTP epoch time failed! Waiting 2 seconds to retry.");
  //         delay(2000);
  //     } else {
  //         Serial.print("Fetched NTP epoch time is: ");
  //         Serial.println(epochTime);
  //         break;
  //     }
  // }
}
