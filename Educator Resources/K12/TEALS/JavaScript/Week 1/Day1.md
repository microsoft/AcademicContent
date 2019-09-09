# Cognitive Hackathon: Week 1 - Teacher's Guide
## Day 1

## Overview

The first day is about exploring what is possible in the world of cognitive computing. The years ahead of us will see astounding growth and change in this area, and the related changes to our culture and commerce are expected to supercede even the Internet. It will be an exciting time ahead and the examples and concepts in this course provide a hint of what is to come. 

## Objectives

Today, demonstrate examples of cognitive computing while introducing the foundational concepts, including machine learning, models, and artificial intelligence. Explore the Azure Cognitive API in all of its facets, with special focus on Computer Vision and Text Analytics.

Here are the demos to begin with:

## Teacher Demos: Cognitive Computing 

Demonstrate these first examples use cognitive Computer Vision capabilities that allow the machine to look at an image and make certain determinations. 

## Teacher Demo: How Old (10 mins)

In this first one, it's to guess peoples' age. Now this can be a fun party trick, like the person at the fair who guesses your age, but this technology could also be used to better estimate demographics of people visiting a particular landmark without needing to collect any other personal information, or analyze the covers of magazines to see what age group is more frequently on the cover of which magazine.

    https://www.how-old.net/

### Teacher Leads Discussion (10 mins)
Discuss what's going on in the How Old cognitive app, for example: 
- Facial Recognition: The app must first find the person, so it needs to know what a face looks like, then it draws a rectangle around the face. 
- Multiple People: Sometimes there's more than one face in the frame (show example) so the app must identify two or more faces. 
- Facial Features: The app analyzes each face, looking for traits that help it guess the age. Which facial features might the app be using to determine age? (It's amazing enough that a computer can tell that it's looking at a person, but even moreso that it knows if they're young or old!)

##  Teacher Demo: What Dog (10 mins)

How about creatures other than humans? Like dogs, for instance. It might be useful for an animal shelter to be able to determine the breed of a dog that was recently brought in to more accurately represent it to folks who are looking to adopt an animal.  What-dog.net does just that:

    https://www.what-dog.net/

### Teacher Leads Discussion: Visual Cognitive Computing (10 mins)
 Explore aspects of visual cognitive computing by how-old.net and what-dog.net apps, their similarities and differences:
* How do you think the what-dog.net knows the species of the dogs in those pictures with such accuracy?
* How might how-old.net be able to guess at ages?
* Facial Recognition: The app must know something about the anatomy of what its looking at, likely finding the dog's face.
* Facial Features: What are the different facial features on a dog that determine breed that you wouldn't use on a human? Things like the shape of the eyes, and the length of the ears and snout. 
* Color: Using pattern recognition to navigate anatomy, the app is  most certainly looking at the color of the dog's fur, and may even identify a tail 

## Teacher Presents: Cognitive Computing Concepts (10 mins)

Cognitive systems use something called machine learning, which allows apps to learn almost like children do, by observing lots and lots of examples. Thousands of dogs are shown to this app, with the species of each dog named to the app, until it compiles an understanding of the traits of each species of dog.  This understanding is stored in a construct called a model.  Cognitive computing is the creation of a model using machine learning then the utilization of that model by the cognitive algorithms to make determinations and recommendations.

Here are the main concepts:

* Cognitive Computing - use of models created by machine learning to identify and qualify images, speech, text, etc. 
* Machine Learning - the creation of models through the analysis of large amounts of data (often called "Big Data")
* Model - data representation of the computer's understanding of a data set using machine learning, used by cognitive computing APIs and apps to conduct analysis and make complex determinations

In this course we'll be using a cognitive API which contains ready-made machine learning models that your applications can consume using REST APIs. Think of it as a shortcut. There's no need to gather the training data, create a learning algorithm, or train the model. Configuring machine learning systems to analyze large swathes of data to build models could take an entire semester. We will focus on APIs with prepared functionality to give you more time to explore the possibilities of cognitive computing.

So what are these cognitive APIs?

## Teacher Presents: Cognitive Computing APIs (10 mins)

There are quite a few features in the cognitive API we're working with:

    https://azure.microsoft.com/en-us/services/cognitive-services/directory/

You can do an online demo these APIs using the "Demo" link next to the APIs.

See the tabs at the top of the window for our Azure Cognitive Services:

* Vision
* Speech
* Language
* Anomaly Detection
* Search

Each of these tabs contains a group of cognitive APIs:

### Vision
Extract information from images to categorize and process visual data. Perform machine-assisted moderation of images to help curate your services.
* Computer Vision
* Video Indexer
* Face 
* Custom Vision
* Content Moderator

### Speech
Translate between speech, text, and other languages as well as identify speakers.
* Speech to Text
* Text to Speech
* Speaker Recognition
* Speech Translation

### Language
Build apps that comprehend text and its grammar, meaning, and emotion.
* Text Analytics
* Bing Spell Check
* Content Moderator (again)
* Translator Text
* QnA Maker
* Language Understanding

### Anomaly Detection
Identify problems in real time.
* Anomaly Detector

### Search
Add search capability for finding and identifying web pages, images, videos, and news.
* Bing Web Search
* Custom Search
* Video Search
* Image Search
* Local Business Search
* Visual Search
* Entity Search
* News Search
* Autosuggest

## Summary
This first workshop covered these topics:
* Cognitive computing demonstrations
* Concepts: cognitive computing, model, machine learning
* Breadth of many types of cognitive computing APIs