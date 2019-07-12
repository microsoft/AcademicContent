#!/usr/bin/env python3
# Import necessary libraries
import urllib
import urllib.request
import json 
import math

# Prompt for inputs
url = input("What is your Web Service URL? ")
api_key = input("What is your Web Service Key? ")
region = input("What Region to predict on? Example: Europe, Africa, Asia: ")
group = input("What Group does the region belong to? Example: other, africa, oecd: ")
fertility = input("What is the fertility rate? ")
pctUrban = input("What percentage of the region is Urban? ")
gdp = float(input("What is the GDP for the Region? "))

# Convert GDP to log10
loggdp = math.log10(gdp)

# Data to submit to service
data =  {

        "Inputs": {

                "input1":
                {
                    "ColumnNames": ["region", "group", "fertility", "lifeExpF", "pctUrban", "Log10(ppgdp)"],
                    "Values": [ [ region, group, fertility, "0", pctUrban, loggdp ]]
                },        },
            "GlobalParameters": {
}
    }

# Convert the json to a format to submit to the service
body = str.encode(json.dumps(data))
# Create the header auth
headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}
# Create the request
req = urllib.request.Request(url, body, headers) 

# Output the response or error
try:
    response = urllib.request.urlopen(req)
    result = json.loads(response.read())
    print(result['Results']['output1']['value']['Values'][0][0]) 
except urllib.error.HTTPError as error:
    print("The request failed with status code: " + str(error.code))

    # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
    print(error.info())

    print(json.loads(error.read()))