# Match Game Event Intro
This is an overview of the steps required during our Microsoft Match Game Events.

These instructions are displayed in a more easily readable form on the aigaming website at:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;https://help.aigaming.com/microsoft-events-1/microsoft-match-game-events-info

Go to the link abnove for the most readable format of these instructions. The copy below can be used if you have issues following the above link.

## Join the Support Discord Server
Be sure to join the Discord! https://discord.gg/x2UtkRhy

## Microsoft Match Game Event Introduction
Our short welcome video will introduce you to the event and how to get started.

[![Match Game Intro](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-intro-to-match-game.png)](https://youtu.be/sbTiWuqiyWg)


### What you need to do
The following short list of items summarises the next actions you need to take to start developing your game playing bot and to enter your bot into the event's tournament:

  1. Sign up for an account on the [AIGaming.com](https://www.aigaming.com) site.
  1. Get an API Key for the Microsoft Computer Vision API.
      1. Sign up for a [Microsoft Azure for Student Account](http://aka.ms/azure4student) account by following these instructions.
      2. Follow the instructions here to Create a Computer Vision API key.
  1. Watch at least the next two videos below on this page
      1. [Introduction to coding your game playing bot](#Introduction-to-coding-your-game-playing-bot)
      2. [How to enter your code into a tournament](#How-to-enter-your-code-into-a-tournament)
  1. After you have made some progress in developing your code, make sure it is submitted to the event's tournament. Having your code run in the tournament is the only way that we measure your participation in the event.
​

You should now have everything you need to get started. Watch the other videos below for more specific information.

**REMEMBER**: The event culminates in a tournament. You must enter your code file into the tournament before it starts in order to be included (as explained in the section [How to enter your code into a tournament](#How-to-enter-your-code-into-a-tournament)).

**OUR TIP**: Submit your code file in the tournament well in advance. You can still work on the code and change it after it has been submitted to the tournament, just make sure you are confident that the code runs without errors at the tournament start time.

# Getting A Computer Vision API Key from the Microsoft Azure Portal
You need to have a Microsoft Azure account in order to create a Computer Vision API key. If you haven't got a Microsoft Azure account, speak to someone who is running the AI Gaming event for details of how you can create one.

Sign into the [Azure Portal](#https://portal.azure.com/). Click on 'Create a resource' as highlighted in the screen below

![Create a new resource on the Azure Portal](https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/assets%2F-LRsQXBq88TMLWiwiHPx%2F-LVE29u8ABGVEtNO-8iW%2F-LVE5cDGvdaLeOENAoIi%2Fwiwsignup3.png?alt=media&token=a177bb69-8a94-46de-8b7c-99c888d5741e)

You'll need to create a Computer Vision API key under the AI + Cognitive Services section

![Create a Computer Vision API resource](https://3642638053-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-LRsQXBq88TMLWiwiHPx%2F-LVE29u8ABGVEtNO-8iW%2F-LVE5nD-d1n2xJqKMYHF%2Fwiwsignup4.png?alt=media&token=d78d46e1-89ef-4aff-8e37-e125dba16ef4)

This will display a new window to allow you to create the service:

![Options to create the Computer Vision API Service](https://3642638053-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-LRsQXBq88TMLWiwiHPx%2F-LVE29u8ABGVEtNO-8iW%2F-LVE6DO6_b6F7r3-sHau%2Fwiwsignup2.png?alt=media&token=34d45263-b59e-468d-a53f-37a72d21695e)

Make sure you choose the same options displayed in the image above and explained below:
  * Name - Enter the name of your service as it will appear on the Azure dashboard e.g. 'Vision_api'.
  * Subscription - Select 'Azure for Students' or 'Free Trial'.
  * Location - Select 'West Europe'.
  * Pricing tier - Select free 'S1 (10 calls per second)
  * Resource group - Select the existing group e.g. 'Group_test'.
  * Pin to dashboard - Tick to place an icon the dashboard for the service.

Once you have clicked 'Create' it will create the API service and after a few moments you will be directed to the screen as shown below:

![Getting the API Service keys](https://3642638053-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-LRsQXBq88TMLWiwiHPx%2F-LVE29u8ABGVEtNO-8iW%2F-LVE6Sd-v2A_AXiR9z4t%2Fwiwsignup8.png?alt=media&token=e33f1a39-a817-4ca6-8730-5cbb06122e5b)

Then click on 'Keys' in the section 'Grab your keys' and you will be redirected to the window as shown below:

![Copy the API Service key](https://3642638053-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/assets%2F-LRsQXBq88TMLWiwiHPx%2F-LVE29u8ABGVEtNO-8iW%2F-LVE6WMM_wh_VCMPHPSE%2Fwiwsignup9.png?alt=media&token=f9c607d0-ed31-482d-9722-4d286ac34ee6)

**IMPORTANT**: Take a note of 'Key 1' as you will need this when creating your bot (note in the picture above part of the key is blanked out for security reasons).

## Using the API Keys in our Demo Code
The API keys you created through the above process can now be used in the demo code supplied in our Online Code Editor. Wherever you need an API key, we will have highlighted the place that you need to insert it as seen in the following example:

```python
headers_vision = {'Ocp-Apim-Subscription-Key': 'YOUR-MICROSOFT-COMPUTER-VISION-API-KEY-HERE'}
```

If you want to use any of the other Microsoft API calls you will need to go through a similar process of selecting and creating the services.

When creating the service for some of the API calls be mindful of the location you select - if you choose something other than Western Europe your response times will be severely impacted and you will need to tailor the URLs when calling the APIs from your code. In the examples below you can see that all our demo code API URLs expect API keys to be from the West Europe location:

```python
ocr_vision_api_url = 'https://westeurope.api.cognitive.microsoft.com/vision/v1.0/ocr'
```

# More Information

There are more videos to show you how to compete in the event and how to modify the Template code.

## Introduction to coding your game playing bot
Learn exactly where you need to add your code to develop your game playing bot. What information you will receive, and what information you need to return in order to play the game.

[![Intro to coding your game playing bot](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-into-to-coding-bot.png)](https://youtu.be/iSvZtMchaFU)

## How to enter your code into a tournament
Entering your code into a tournament lets you find out how good your game playing bot is. Each event will have at least one tournament and the video below gives you a quick overview of how to make sure your code is registered to play.

[![How to enter code into a tournament](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-code-into-tournament.png)](https://youtu.be/dPzvYL-ArDc)

## Introduction to the editor and running games
The Online Code Editor is where you spend most of your time as you write the code for your automated game playing bot. It's also where you run the code to play the games. Find out all about the Online Code Editor and how to play games in this video

[![Introduction to the editor and running games](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-intro-to-oce.png)](https://youtu.be/2w_LlN8QzaM)

## How to Implement Landmark Matching
We give you template code that can already analyse images and identify which animal is in them using the Computer Vision API. The first step to playing the Match Game better is to update the code to identify and match landmarks in images.

The template code has comments to guide you in achieving this, but this video provides step by step instructions. If you follow the steps in the video, your code should be able to recognise both animals and landmarks and play a vastly improved game.

[![How to Implement Landmark Matching](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-implement-landmark-matching.png)](https://youtu.be/HyK2USLZpR0)

## How to implement Word or Text matching
There are three types of image included in the tiles used in the Match Game - animals, landmarks and words. Once your code is successfully recognising animals and landmarks, you can use the additional Cognitive Services Computer Vision API, OCR (optical character recognition) to read the word on tiles which do not appear to have an animal or landmark present. This video explains how to implement OCR in your code and begin to recognise and match word type tiles.  This will also give you the skills you need to implement the advanced strategy of reading the types of tiles from their backs and making your guesses more accurate as a result.

[![How to implement Word or Text matching](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-implement-text-recognition.png](https://youtu.be/4YOxttyx5v8)

## Creating a Computer Vision API key and reviewing the API response
The Microsoft Cognitive Services Computer Vision Analyze API returns extensive information on the image that was analysed.  This video shows how this information can be displayed within the Online Code Editor (OCE) and therefore the relevant components required to play the game can be extracted.  Column three of the OCE is used to display the result returned and we explain how this can be interpreted into Python code in your solution to access the relevant parts of the data.

[![Creating a Computer Vision API key and reviewing the API response](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-create-computer-vision-key.png)](https://youtu.be/UNe8RRspgGY)

## How to Navigate JSON Objects Using Python Dictionaries
JSON objects are widely used to transfer data to and from API services.  They are human readable text strings which adhere to a formal syntax which means they are also readable in software.  JSON objects can be easily manipulated in Python code by converting them to or from dictionary objects.  This video introduces the format of JSON objects, demonstrates how to convert them to and from Python dictionary objects, and gives examples of how to work with dictionaries in your code.

[![How to Navigate JSON Objects Using Python Dictionaries](https://aigaming.blob.core.windows.net/help-matchgame-markdown-msbuild/youtube-json-intro.png)](https://youtu.be/sttnvU2wFvI)

## Best steps to improve your code
We recommend tackling the following steps in order as the best approach to improving your code:
  1. Implement Landmark matching.
  1. Implement text recognition and word matching
  1. Read the tile backs to match tiles from the same category
  1. Check if you can match tiles in the bonus category
  1. Wait before matching any tiles to match tiles in consecutive Bonus Categories.

