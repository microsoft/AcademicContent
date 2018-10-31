# Adafruit Feather Azure IOT Suite

The aim of this mini project is for the Adafruit Feather to communicate with to the Microsoft Azure IoT Hub. Adafruit Feather should be able to send telemetry messages and also respond to commands sent to it by the IoT hub. The Adafruit Feather component used in this project is from the Microsoft Azure IoT Starter Kits 

# Get Started with Microsoft Azure IoT Starter Kit - Adafruit Feather M0 WiFi (Arduino-compatible)
This tutorial describes the process of taking your Feather M0 WiFi kit, and using it to develop a temperature, humidity and pressure reader that can communicate with the cloud using the  Microsoft Azure IoT SDK. 

**Don't have a kit yet?:** Click [here](http://azure.com/iotstarterkits)

# Running a Simple Remote Monitoring Solution on Feather M0 WiFi (Arduino-compatible)

###Required Software

- Arduino IDE, version 1.6.8. from www.arduino.cc (Earlier versions will not work with the AzureIoT library)
- Sensor interface library from Adafruit: https://github.com/adafruit/Adafruit_BME280_Library/archive/master.zip

###Required Hardware

- Adafruit Feather M0 WiFi kit
  - A microB USB cable
  - A desktop or laptop computer which can run **Arduino IDE 1.6.8**

##Please follow the Tutorial 
Tutorial-Azure IOT Suite with Ardunino.docx

##Setting up via IOTSuite and Individual Azure components 
See the following tutorial https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/10/16/creating-an-end-to-end-iot-solution-using-the-microsoft-azure-iot-starter-kit-w-adafruit-feather-m0-wifi-and-microsoft-azure/


#Next steps

Please visit our [Azure IoT Dev Center](https://azure.microsoft.com/en-us/develop/iot/) for more samples and documentation on Azure IoT.

##Stopping Provisioned Services

- In the [Microsoft Azure Portal](https://portal.azure.com/)
    - Click on "All Resources"
    - For each Stream Analytics and Web App resource:
        - Click on the resource and click the "Stop" button in the new blade that appears
    - For each IoT Hub resource:
        - Click on the resource and click the "Devices" button in the new blade that appears
        - Click on each device in the list and click the "Disable" button that appears in the new blade at the bottom
