# Bus Bot
A bot that checks bus times in London

If you don't know how to work with the bot framework, I highly recommend you go through this beginners course first: 

https://mva.microsoft.com/en-US/training-courses/getting-started-with-bots-16759?l=2zTAb2HyC_3504668937

## What you need

* Install nodejs: https://nodejs.org/en/
* Install the bot emulator: https://download.botframework.com/bf-v3/tools/emulator/publish.htm

## Running the bot locally

* Inside the folder of your project (the busbot), run the following command to pull down all of the dependencies needed for the project
```
$ npm install
```
* Run this command to start the bot
```
$ node app.js
```
## The TFL API

TFL API calls won't work with the current tfl.api node module. The latest version of the tfl.api (with the stop point api endpoint) can be found here:

https://github.com/liliankasem/tfl.api/tree/stoppoint

You'll need to copy over the stoppoint.js and index.js code manually from the download above into the "node_modules/tfl.api/src" folder that is part of this project (which you will see when you run npm install for the first time). This is because my pull request for the API has not been accepted yet.

## Setting up the LUIS model

If you haven't used LUIS before, read through the documentation first: 

https://www.microsoft.com/cognitive-services/en-us/luis-api/documentation/home

* Go to luis.ai
* Register or sign in to your account
* Click on 'Add New App' and select 'Import Existing Application'
* Upload the 'busbot_luis_model.json' file found in this project
* You then need to start feeding in different phrases 1) labeling the intents 2) highliging the entities you want to extract in each phrase
* Train and publish the model to get the URL needed to run the bot with LUIS, which is this line in of the code:
```
var model = process.env.LUIS_MODEL;
```
