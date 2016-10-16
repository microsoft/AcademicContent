// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>
#include <Arduino.h>

/* This sample uses the _LL APIs of iothub_client for example purposes.
  That does not mean that HTTP only works with the _LL APIs.
  Simply changing the using the convenience layer (functions not having _LL)
  and removing calls to _DoWork will yield the same results. */
#include "sdk/schemaserializer.h"
#include "AzureIoTHub.h"
#include "iot_logging.h"


static int tempOffset =0;
static int humidityOffset =0; 
int led = 6;           // the PWM pin the LED is attached to
int brightness = 0;    // how bright the LED is
int fadeAmount = 5;    // how many points to fade the LED by
int setAlarm =0; 


static const char* deviceId = "nk_arduino_device_1";
static const char* connectionString = "HostName=[YourHostNameHere].azure-devices.net;DeviceId=nk_arduino_device_1;SharedAccessKey=[Your Secret Keys here]";


// /* .... New Code
// Define the Model

BEGIN_NAMESPACE(Contoso);

DECLARE_STRUCT(SystemProperties,
               ascii_char_ptr, DeviceID,
               _Bool, Enabled
              );

DECLARE_STRUCT(DeviceProperties,
               ascii_char_ptr, DeviceID,
               _Bool, HubEnabledState
              );

DECLARE_MODEL(Thermostat,

              // Event data (temperature, external temperature and humidity)
              WITH_DATA(int, Temperature),
              WITH_DATA(int, ExternalTemperature),
              WITH_DATA(int, Humidity),
              WITH_DATA(ascii_char_ptr, DeviceId),

              // Device Info - This is command metadata + some extra fields
              WITH_DATA(ascii_char_ptr, ObjectType),
              WITH_DATA(_Bool, IsSimulatedDevice),
              WITH_DATA(ascii_char_ptr, Version),
              WITH_DATA(DeviceProperties, DeviceProperties),
              WITH_DATA(ascii_char_ptr_no_quotes, Commands),

              // Commands implemented by the device
              WITH_ACTION(SetAlarm),
              WITH_ACTION(ResetAlarm),
              WITH_ACTION(SetTemperature, int, temperature),
              WITH_ACTION(SetHumidity, int, humidity)
             );

END_NAMESPACE(Contoso);


EXECUTE_COMMAND_RESULT SetAlarm(Thermostat* thermostat)
{
  LogInfo("Received SetAlarm \r\n");
  setAlarm = 1;
  return EXECUTE_COMMAND_SUCCESS;
}

EXECUTE_COMMAND_RESULT ResetAlarm(Thermostat* thermostat)
{
  LogInfo("Received ResetAlarm \r\n");
  setAlarm = 0;
  analogWrite(led, 0);
  return EXECUTE_COMMAND_SUCCESS;
}

EXECUTE_COMMAND_RESULT SetTemperature(Thermostat* thermostat, int temperature)
{
  LogInfo("Received temperature %d\r\n", temperature);
  tempOffset = temperature;
  return EXECUTE_COMMAND_SUCCESS;
}

EXECUTE_COMMAND_RESULT SetHumidity(Thermostat* thermostat, int humidity)
{
  LogInfo("Received humidity %d\r\n", humidity);
  humidityOffset = humidity;
  return EXECUTE_COMMAND_SUCCESS;
}

// Define the Model
DEFINE_ENUM_STRINGS(IOTHUB_CLIENT_CONFIRMATION_RESULT, IOTHUB_CLIENT_CONFIRMATION_RESULT_VALUES)
void sendCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result, void* userContextCallback)
{
  int messageTrackingId = (intptr_t)userContextCallback;
  //LogInfo("Message Id: %d Received.\r\n", messageTrackingId);
  //LogInfo("Result Call Back Called! Result is: %s \r\n", ENUM_TO_STRING(IOTHUB_CLIENT_CONFIRMATION_RESULT, result));
}

static void sendMessage(IOTHUB_CLIENT_LL_HANDLE iotHubClientHandle, const unsigned char* buffer, size_t size)
{
  static unsigned int messageTrackingId;
  IOTHUB_MESSAGE_HANDLE messageHandle = IoTHubMessage_CreateFromByteArray(buffer, size);
  if (messageHandle == NULL)
  {
    LogInfo("unable to create a new IoTHubMessage\r\n");
  }
  else
  {
    if (IoTHubClient_LL_SendEventAsync(iotHubClientHandle, messageHandle, sendCallback, (void*)(uintptr_t)messageTrackingId) != IOTHUB_CLIENT_OK)
    {
      LogInfo("failed to hand over the message to IoTHubClient");
    }
    else
    {
      //LogInfo("IoTHubClient accepted the message for delivery\r\n");
    }
    IoTHubMessage_Destroy(messageHandle);
  }
  free((void*)buffer);
  messageTrackingId++;
}

/*this function "links" IoTHub to the serialization library*/
static IOTHUBMESSAGE_DISPOSITION_RESULT IoTHubMessage(IOTHUB_MESSAGE_HANDLE message, void* userContextCallback)
{
  IOTHUBMESSAGE_DISPOSITION_RESULT result;
  const unsigned char* buffer;
  size_t size;
  if (IoTHubMessage_GetByteArray(message, &buffer, &size) != IOTHUB_MESSAGE_OK)
  {
    LogInfo("unable to IoTHubMessage_GetByteArray\r\n");
    result = EXECUTE_COMMAND_ERROR;
  }
  else
  {
    /*buffer is not zero terminated*/
    char* temp = malloc(size + 1);
    if (temp == NULL)
    {
      LogInfo("failed to malloc\r\n");
      result = EXECUTE_COMMAND_ERROR;
    }
    else
    {
      memcpy(temp, buffer, size);
      temp[size] = '\0';
      EXECUTE_COMMAND_RESULT executeCommandResult = EXECUTE_COMMAND(userContextCallback, temp);
      result =
        (executeCommandResult == EXECUTE_COMMAND_ERROR) ? IOTHUBMESSAGE_ABANDONED :
        (executeCommandResult == EXECUTE_COMMAND_SUCCESS) ? IOTHUBMESSAGE_ACCEPTED :
        IOTHUBMESSAGE_REJECTED;
      free(temp);
    }
  }
  return result;
}

void InitLedPin()
{
  // declare pin 6 to be an output:
  pinMode(led, OUTPUT);
}

void simplesample_http_run(void)
{
  LogInfo("simplesample_http_run...\r\n");
  // why do initBme() in each and every loop!!!
  initBme();

  if (serializer_init(NULL) != SERIALIZER_OK)
  {
    LogInfo("Failed on serializer_init\r\n");
  }
  else
  {
    IOTHUB_CLIENT_LL_HANDLE iotHubClientHandle = IoTHubClient_LL_CreateFromConnectionString(connectionString, HTTP_Protocol);
    srand((unsigned int)time(NULL));
    // int avgWindSpeed = 10;

    if (iotHubClientHandle == NULL)
    {
      LogInfo("Failed on IoTHubClient_LL_CreateFromConnectionString\r\n");
    }
    else
    {
      unsigned int minimumPollingTime = 9; /*because it can poll "after 9 seconds" polls will happen effectively at ~10 seconds*/
      if (IoTHubClient_LL_SetOption(iotHubClientHandle, "MinimumPollingTime", &minimumPollingTime) != IOTHUB_CLIENT_OK)
      {
        LogInfo("failure to set option \"MinimumPollingTime\"\r\n");
      }

#ifdef MBED_BUILD_TIMESTAMP
      // For mbed add the certificate information
      if (IoTHubClient_LL_SetOption(iotHubClientHandle, "TrustedCerts", certificates) != IOTHUB_CLIENT_OK)
      {
        LogInfo("failure to set option \"TrustedCerts\"\r\n");
      }
#endif // MBED_BUILD_TIMESTAMP

      Thermostat* thermostat = CREATE_MODEL_INSTANCE(Contoso, Thermostat);
      if (thermostat == NULL)
      {
        LogInfo("Failed on CREATE_MODEL_INSTANCE\r\n");
      }
      else
      {
        if (IoTHubClient_LL_SetMessageCallback(iotHubClientHandle, IoTHubMessage, thermostat) != IOTHUB_CLIENT_OK)
        {
          LogInfo("unable to IoTHubClient_SetMessageCallback\r\n");
        }
        else
        {

          // Send the Commands Metadata Message, this is done only once as there is a While(1) loop next
          sendCommandsMetaData(thermostat, iotHubClientHandle);//
          
          thermostat->DeviceId = (char*)deviceId;
          int sendCycle = 10;
          int currentCycle = 0;
          while (1)
          {
            if (currentCycle >= sendCycle)
            {
              float Temp;
              float Humi;
              getNextSample(&Temp, &Humi);
              thermostat->Temperature = (int)round(Temp) + tempOffset ;
              thermostat->ExternalTemperature = 55 + (rand() % 5 + 2);
              thermostat->Humidity = (int)round(Humi) + humidityOffset;
              currentCycle = 0;
              unsigned char*buffer;
              size_t bufferSize;

              LogInfo("Sending sensor value Temperature = %d, Humidity = %d\r\n", thermostat->Temperature, thermostat->Humidity);

              if (SERIALIZE(&buffer, &bufferSize, thermostat->DeviceId, thermostat->Temperature, thermostat->Humidity, thermostat->ExternalTemperature) != IOT_AGENT_OK)
              {
                LogInfo("Failed sending sensor value\r\n");
              }
              else
              {

                IOTHUB_MESSAGE_HANDLE messageHandle = IoTHubMessage_CreateFromByteArray(buffer, bufferSize);
                if (messageHandle == NULL)
                {
                  LogInfo("unable to create a new IoTHubMessage\r\n");
                }
                else
                {
                  if (IoTHubClient_LL_SendEventAsync(iotHubClientHandle, messageHandle, sendCallback, (void*)1) != IOTHUB_CLIENT_OK)
                  {
                    LogInfo("failed to hand over the message to IoTHubClient");
                  }
                  else
                  {
                    LogInfo("IoTHubClient accepted the message for delivery\r\n");
                  }

                  IoTHubMessage_Destroy(messageHandle);
                }
                free(buffer);
              } // if (SERIALIZE
            }// if (currentCycle >= sendCycle)
            IoTHubClient_LL_DoWork(iotHubClientHandle);
            SetAlarmLed();
            ThreadAPI_Sleep(100);
            currentCycle++;
          }// while (1)
        }// if else if (IoTHubClient_LL_SetMessageCallback
      }
      DESTROY_MODEL_INSTANCE(thermostat);
    }
    IoTHubClient_LL_Destroy(iotHubClientHandle);
  }
  serializer_deinit();
}

void SetAlarmLed() {
  if (setAlarm)
  {
    // set the brightness of pin led:
    analogWrite(led, brightness);
  
    // change the brightness for next time through the loop:
    // brightness = brightness + fadeAmount;
  
    // reverse the direction of the fading at the ends of the fade:
    if (brightness == 0)
    {
      brightness= 255; //high
    }
    else
    {
       brightness= 0; //low
    }

    // wait for 10 milliseconds to see the dimming effect
    delay(10);
  }
}


void sendCommandsMetaData(Thermostat* thermostat, IOTHUB_CLIENT_LL_HANDLE iotHubClientHandle)
{
  
  /* send the device info upon startup so that the cloud app knows
    what commands are available and the fact that the device is up */

  LogInfo("sendCommandsMetaData....\r\n");
  thermostat->ObjectType = "DeviceInfo";
  thermostat->IsSimulatedDevice = false;
  thermostat->Version = "1.0";
  thermostat->DeviceProperties.HubEnabledState = true;
  thermostat->DeviceProperties.DeviceID = (char*)deviceId;

  STRING_HANDLE commandsMetadata;
  commandsMetadata = STRING_new();
  if (commandsMetadata == NULL)
  {
    LogInfo("Failed on creating string for commands metadata\r\n");
  }
  else
  {
    /* Serialize the commands metadata as a JSON string before sending */

    if (SchemaSerializer_SerializeCommandMetadata(GET_MODEL_HANDLE(Contoso, Thermostat), commandsMetadata) != SCHEMA_SERIALIZER_OK)
    {
      LogInfo("Failed serializing commands metadata\r\n");
    }
    else
    {
      unsigned char* buffer;
      size_t bufferSize;
      thermostat->Commands = (char*)STRING_c_str(commandsMetadata);

      // Here is the actual send of the Device Info
      if (SERIALIZE(&buffer, &bufferSize, thermostat->ObjectType, thermostat->Version, thermostat->IsSimulatedDevice, thermostat->DeviceProperties, thermostat->Commands) != IOT_AGENT_OK)
      {
        LogInfo("Failed serializing\r\n");
      }
      else
      {
        LogInfo("Buffer content = %s", buffer);
        sendMessage(iotHubClientHandle, buffer, bufferSize);
      }
    }
    STRING_delete(commandsMetadata);
  }
}

