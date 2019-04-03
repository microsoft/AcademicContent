![](media/image1.png)

# Cognitive Services and Bots

Cloud Computing and Big Data are merging into a trend that utilizes both
remote computing and large-scale computation: Cognitive Computing.
Massive data sets of the world around us are compiled every second
(images, videos, audio, and text) and we need to quickly and accurately
sift through that data to reach meaningful conclusions. Microsoft
Cognitive Services implement cognitive computing and employ machine
learning to provide actionable insights using vision, speech, language,
knowledge, and search APIs.

Bots interact with your users naturally wherever they are – from your
website or app to Cortana, Skype, Office 365 mail, Slack, Facebook
Messenger, Skype for Business and more. Cognitive Services enable your
bot to see, hear, interpret and interact in more human ways. Azure Bot
Service provides a foundation for building custom bots to allow humans
to interact with machines in productive ways.

- [Cognitive Services](#cognitive-services)  
   - [Image Processing](#image-processing)  
   - [Face Detection](#face-detection)  
   - [Emotion Detection](#emotion-detection)  
   - [Speech Recognition](#speech-recognition)  
   - [Language](#language)  
   - [Knowledge](#knowledge)  
   - [Search](#search)  
- [Building Bots](#building-bots)  
   - [Bot Framework](#bot-framework)  
   - [Azure Bot Service](#azure-bot-service)


## Cognitive Services

Effective cognitive computing requires easy-to-use service endpoints
consumable by apps with images, audio, and other media and data that
needs to be processed by sophisticated cognitive systems that return
straightforward and usable results. Let your students get their hands on
cognitive algorithms quickly using Microsoft’s Cognitive Services APIs.
There are many entry points into the exploration of cognitive computing.

### Image Processing

The Computer Vision API identifies people and objects with a reported
level of confidence. Individuals are identified, what they look like,
what they are wearing, their age and demographic, what they are doing,
and if they are part of a group. Objects are identified, such as
buildings, houses, natural features such as rivers or mountains, or
household objects such as dinner rolls or flowers, then placed in a
context such as a city, a plate of bread, or a train station. Tags
denote the notable aspects of the image, the most prominent or
identifiable images that help determine what the image is “about”.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/home)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/tutorials/pythontutorial)

### Face Detection

The Face API imbues your apps with the ability to identify a person
using an image of their face. The API compares two images containing
faces and reports on how well they match up. This is accomplished using
proportions of the head, hair color, and facial landmarks such as eyes,
eyebrows, nose, and lips.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/face/overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/face/tutorials/faceapiinjavaforandroidtutorial)

### Emotion Detection

The detection of human emotion based upon facial expression allows
systems to understand how people may be feeling. The Emotion API is
invoked using a simple URL call which uploads your image containing one
or more faces. Cognitive Services processes the image and returns
emotion indices for each face such as anger, contempt, fear, happiness,
and surprise.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/emotion/home)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/emotion/tutorials/pythontutorial)

### Speech Recognition

The Custom Speech API provides a powerful speech recognition system
exposing acoustic models and language models for customization.
Identifying and verifying a particular speaker is a next step in speech
cognition and is provided by the Speaker Recognition API.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-home)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-speech-service/cognitive-services-custom-speech-get-started)

### Language

While speech recognition determines what a person is saying, language
understanding extracts deeper meaning such as topic, sentiment, and
desire. Build custom language models to interpret what a person wants
using the Language Understanding Intelligent Service (LUIS). Learn to
map human utterances in natural language to entities and intents to know
what object or person someone is talking about, how they feel about it,
and what they would like to see happen with it.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/home)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-nodejs-tutorial-build-bot-framework-sample)

### Knowledge

Explore the ability to search complex data using natural language
queries using the Knowledge Exploration Server (KES). Define your own
data schema and populate it with your data. Construct query grammars
used to parse language requests and extract and filter data, then host
your query engine as a service online. Employ natural language
understanding to evaluate queries, offer intelligent recommendations,
query auto-completion, and semantic search.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/kes/overview)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/kes/gettingstarted)

### Search

Although not strictly a cognitive function, the search of web pages,
images, news, and video is often a necessary part of cognitive projects.
The Bing Web Search API provides a search engine which consumes search
query terms and produces JSON search responses.

[Learn More](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/search-the-web)  
[Get Started](https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/csharp-ranking-tutorial)

## Building Bots

A bot is an app that users interact with in a conversational way. Bot
conversations can range from a basic guided dialog with pre-defined
responses to a sophisticated interactive experience that leverages
cognitive computing to determine user desires and sentiments.

### Bot Framework

Building a bot requires a development toolkit and a testing environment.
Get started with the Bot Framework, a platform for building, testing,
and deploying bots. It includes a Bot Builder SDK with support for .NET,
Node.js, and REST. Bot Builder conversations can use simple text or rich
cards that contain text, images, and action buttons. Manage and deploy
your bot with the Bot Framework portal. The portal provides a central
repository for your bots and a way to deploy your bots to a web page.

[Learn More](https://docs.microsoft.com/en-us/bot-framework/azure/azure-bot-service-overview)   
[Get Started](https://docs.microsoft.com/en-us/bot-framework/bot-builder-overview-getstarted)

### Azure Bot Service

Build bots quickly using Azure Bot Service, an online tool for bot
development built upon the Bot Framework. Choose from a range of
templates including a basic interaction, highly structed forms
facilitating particular conversations such as the ordering of a
sandwich, natural language understanding to determine user intent,
proactive alerts to notify users of events, to an FAQ template to answer
users’ most common questions.

Build bots in your browser without the need for a text editor or source
control, or choose the continuous integration option and use your own
source code control such as GitHub, BitBucket, or Visual Studio. After
developing and testing your bot, deploy it to pre-configured channels
such as Skype or Web Chat, as well as Bing, Cortana, Facebook Messenger,
Kik, and Slack.

Azure Bot Service is an implementation of the Bot Framework using Azure
Functions, which allows your bot to run in serverless, scalable
containers.

[Learn More](https://docs.microsoft.com/en-us/bot-framework/azure/azure-bot-service-overview)  
[Get Started](https://docs.microsoft.com/en-us/bot-framework/azure/azure-bot-service-template-basic)  

![](media/image2.png)
