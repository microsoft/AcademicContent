<a name="HOLTitle"></a>
# Microsoft Language Understanding Intelligent Service (LUIS) #

---

<a name="Overview"></a>
## Overview ##

One of the key challenges in the world of human-computer interactions is training a computer to discern a user's intent from natural-language commands. Suppose that a user types "find news about Microsoft" into a news reader or browser. A person understands this command easily. But implementing the logic for a computer to understand this simple phrase is an exceedingly difficult task, especially when you factor in language and culture and the influence that those have on how we communicate.  

![Human-computer interaction](Images/luis-lab-header.png)
 
Microsoft's [Language Understanding Intelligent Service](https://www.microsoft.com/cognitive-services/en-us/language-understanding-intelligent-service-luis), or LUIS for short, is designed to fill this need, offering a fast and effective way to add language understanding to applications. LUIS lets you create models that take sentences or *utterances* and interpret them by discerning *intents* such as "find news" and extracting *entities* such as "Microsoft". LUIS utilizes interactive machine-learning techniques and benefits from extensive research on language understanding performed by researchers at Microsoft Research and other institutions. And once a LUIS model is built and trained, it is easily deployed as a Web service so bots and other applications can call it to convert commands entered by users into actions.

In this lab, you will create a LUIS application, configure a language-understanding model using both pre-built and custom entities, and define intents. Then you will build a bot that uses the model to respond to natural-language commands such as "find news about Microsoft" or "get the latest soccer news."

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create a LUIS application
- Define intents and entities
- Use pre-built entities and phrase lists
- Train a LUIS model and publish it to an HTTP endpoint
- Create a bot that uses a LUIS model

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- A Microsoft account. If you don't have one, [sign up for free](https://account.microsoft.com/account).
- Microsoft [Visual Studio Code](http://code.visualstudio.com) version 1.7.0 or higher
- Internet Explorer 10 or higher or [Google Chrome](https://www.google.com/chrome/) 

---

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create a LUIS application](#Exercise1)
- [Exercise 2: Configure intents and entities](#Exercise2)
- [Exercise 3: Add pre-built entities and phrase lists](#Exercise3)
- [Exercise 4: Publish the model to an HTTP endpoint](#Exercise4)
- [Exercise 5: Create a bot and connect it to the model](#Exercise5)
- [Exercise 6: Test the bot](#Exercise6)
 
Estimated time to complete this lab: **60** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create a LUIS application ##

The first step in creating an intelligent language model with LUIS is to provision an application in the [LUIS portal](https://www.luis.ai/). In order to use the portal, you must run it in Internet Explorer or Google Chrome. If you do not have one of these browsers available, stop now and [install Chrome](https://www.google.com/chrome/).

1. Open the [LUIS portal](https://www.luis.ai/) in Internet Explorer or Chrome. If you aren't already signed in, click **Sign in or create an account** and sign in with your Microsoft account. If you are prompted to "let this app access your info," review the permissions requested and click **Yes**. Additionally, if you are prompted to provide additional details such as the country you live in and the company you work for, fill in the information and click **Continue**.	

    ![Signing in to LUIS](Images/luis-click-login.png)

    _Signing in to LUIS_
 
1. Click **+ New App**, and then select **New Application**. 

    ![Creating a LUIS application](Images/luis-select-create-new-app.png)

    _Creating a LUIS application_
 
1. In the ensuing dialog, enter "Newsy" (without quotation marks) as the application name and select **Bot** as the usage scenario. Check the **News & Magazines** box and click the **Add App** button. 

    ![Entering information about the application](Images/luis-edit-app-info.png)

    _Entering information about the application_
 
Your LUIS application is now provisioned and you are ready to start configuring it by adding intents and entities.

<a name="Exercise2"></a>
## Exercise 2: Configure intents and entities ##

In the language of LUIS, **intents** represent actions such as "search" or "find," while **entities** describe target for intents. In this exercise, you will create a simple intent for searching the news and an entity to specify the type of news to search for, such as "soccer" or "Microsoft Surface."

1. Click **+** to the right of "Intents" to add an intent.

    ![Adding an intent](Images/luis-click-new-intent-01.png)

    _Adding an intent_
 
1. Enter "SearchNews" (without quotation marks) for the intent name, and type "Find soccer news" (again, without quotation marks) into box below. The latter is an example of an *utterance*, which is a command that triggers an intent. Then click the **Save** button.

    ![Defining an intent](Images/luis-save-new-intent-01.png)

    _Defining an intent_

1. Click **+** to the right of "Entities" to add an entity.

    ![Adding an entity](Images/luis-click-new-entity-01.png)

    _Adding an entity_ 

1. Enter "NewsCategory" as the entity name. Then click the **Save** button.
 
    ![Defining an entity](Images/luis-save-new-entity-01.png)

    _Defining an entity_ 

1. To connect the NewsCategory entity to the SearchNews intent, click the word "soccer" and select **NewsCategory** from the popup menu. Then click the **Submit** button.
 
    ![Connecting an entity to an intent](Images/luis-connect-new-entity-01.png)

    _Connecting an entity to an intent_

	The phrase "Find soccer news" is now associated with the SearchNews intent, and LUIS will understand the word “soccer” as the target of your action. In order for LUIS to train the model successfully, it needs a few more sample utterances.
	
1. Type "Get soccer news" into the box in the "New utterances" panel and click the **arrow**.
 
    ![Adding an utterance](Images/luis-search-utterance-01.png)

    _Adding an utterance_	 

1. Select **SearchNews** from the drop-down list of intents.

    ![Selecting an intent](Images/select-searchnews.png)

    _Selecting an intent_	 

1. Click the word "soccer" and select **NewsCategory** from the popup menu. Then click the **Submit** button.
 
    ![Configuring an utterance](Images/luis-connect-new-entity-02.png)

    _Configuring an utterance_

1. Repeat steps 6 through 8, making certain you select **SearchNews** from the intent drop-down, with the following sample phrases (without quotation marks) to populate your LUIS application with information to properly train the model:

	- "Get motorcycle news"
	- "Find motorcycle news"
	- "Get tornado news"
	- "Find tornado news"

1. Review the utterances you have defined by clicking **Review labels** and selecting **Show all labeled utterances** from the drop-down list. Confirm that all entries are assigned to the SearchNews intent and have a yellow-highlighted entity.
 
    ![Reviewing labeled utterances](Images/luis-review-labels.png)

    _Reviewing labeled utterances_

1. Click **Train** in the lower-left corner of the page. After a few seconds, the message "Last train completed" will appear. 
 
    ![Training a LUIS model](Images/luis-click-train.png)

    _Training a LUIS model_

Your LUIS application is now configured to understand phrases such as "Get soccer news" and to discern that the user wants to search news for the term "soccer." LUIS is smart enough now to know that a phrase such as "Find hockey news" also represents an intent to search news, but for news regarding hockey even though you haven't explicitly trained the model with that term. Your LUIS model is now ready to be configured to support more advanced scenarios, such as identifying terms from a specific list of news categories.

<a name="Exercise3"></a>
## Exercise 3: Add pre-built entities and phrase lists ##

Now that LUIS understands some basic intents and phrases, it's time to make the model even more intelligent by leveraging pre-built entities and phrase lists. Pre-built entities allow a model to know, for example, that words such as "tomorrow" and "September 30" that appear in an entity represent dates and times, or that "20 years old" represents an age. A complete list of the pre-built entities that LUIS supports can be found at https://www.microsoft.com/cognitive-services/en-us/LUIS-api/documentation/Pre-builtEntities. In this exercise, you will add the pre-built *encyclopedia* entity to your intents, and add a phrase list for refining news results by category.

1. Click **+** to the right of "Pre-built Entities" to display a list of pre-built entities.
 
    ![Showing pre-built entities](Images/luis-click-new-preentity-01.png)

    _Showing pre-built entities_ 

1. Scroll down and select **encyclopedia**. Then click the **OK** button. A new pre-built entity named "encyclopedia" will be added to the list.
 
    ![Adding the encyclopedia entity](Images/luis-select-ency-entity.png)

    _Adding the encyclopedia entity_ 

1. Click **+** to the right of "Phrase List Features" to add a new phrase list.
 
    ![Adding a phrase list](Images/luis-click-new-phraselist-01.png)

    _Adding a phrase list_ 

1. Type "NewsCategory" (without quotation marks) for the feature name. Enter the comma-delimited list below, and then click the **Save** button.

	```
	Business,Entertainment,Health,Politics,ScienceAndTechnology,Sports,US,World 
 	```

    ![Saving the phrase list](Images/luis-save-phraselist-info.png)

    _Saving the phrase list_ 

1. Now that you have added an encyclopedia entity and phrase list, it is time to create a couple more intents to help LUIS understand whether a user wants to search news by using an encyclopedia entity such as "Super Bowl" or "World War," or using a more general category such as "Health" or "Politics." Begin by clicking **SearchNews** in the list of intents.
 
    ![Opening the SearchNews intent](Images/luis-select-searchnews.png)

    _Opening the SearchNews intent_ 

1. Click **+ Add Action**. Then click **+ Add Parameter**. Enter "Encyclopedia" as the parameter name and select **encyclopedia** in the drop-down list labeled "Type." Then click the **Save** button.

    ![Adding an action](Images/luis-save-updated-intent-2.png)

    _Adding an action_ 

1. Click **+** to the right of "Intents" to add an intent.
 
    ![Adding another intent](Images/luis-click-new-intent-02.png)

    _Adding another intent_ 

1. Enter "SearchNewsByCategory" for the intent name and "Find Super Bowl news" as an example of a command that triggers the intent. Then click **+ Add Action**, followed by **+ Add Parameter**. Under "Action Parameters," check the **Required** box, enter "NewsCategory" as the parameter name, select **NewsCategory** for both **Type** and **Value**, and enter "Please specify a category" for the prompt. Then click the **Save** button.

    ![Saving the intent](Images/luis-save-intent-info-02.png)

    _Saving the intent_ 
 
1. Notice that the phrase "find super bowl news" is now displayed, with the term "super bowl" highlighted and "SearchNewsByCategory" selected as the intent. LUIS was smart enough to understand the term "super bowl" as an encyclopedia entry. Click the **Submit** button to add this entry to your model. 

    ![Saving the utterance](Images/luis-submit-new-utterance-02.png)

    _Saving the utterance_ 

1. Type "Get Health news" into the new utterances box and click the **arrow**.

    ![Adding an utterance](Images/luis-search-utterance-02.png)

    _Adding an utterance_ 

1.  Select **SearchNewsByCategory** from the drop-down list of intents. Click the word "health" and select **NewsCategory** to connect the two. Then click the **Submit** button.
 
    ![Saving the utterance](Images/luis-submit-new-utterance-03.png)

    _Saving the utterance_ 

1. Click **Train** in the lower-left corner of the page to train the model. 
 
Your LUIS model has now been enhanced with a pre-built entity and a phrase list, and can understand most typical phrases relating to finding news based on various terms. Let's see how LUIS interprets this information and publish the model to make it available for use.

<a name="Exercise4"></a>
## Exercise 4: Publish the model to an HTTP endpoint ##

In this exercise, you will publish the model to an HTTP endpoint so it can be accessed by applications that wish to incorporate language understanding. Before proceeding, be certain that you trained the model in the last step in the previous exercise. If you did not train it, train it now.

1. Click **Publish**.
 
    ![Publishing the model](Images/luis-click-publish.png)

    _Publishing the model_
 
1. Click the **Publish web service** button. 
 
    ![Publishing to an HTTP endpoint](Images/luis-click-publish-to-endpoint.png)

    _Publishing to an HTTP endpoint_

1. After a short delay, the dialog will expand and show an interface for entering queries, calling the HTTP endpoint, and viewing query results. Type "Find Super Bowl news" into the "Query" box and then click the link below to test the query.
 
    ![Testing the query](Images/luis-test-query.png)

    _Testing the query_
	
1. This calls the HTTP endpoint and displays the JSON data that is returned. Observe that LUIS identified "super bowl" as the entity and determined that "SearchNewsByCategory" was the most likely intent:

	```JSON
	{
	  "query": "Find Super Bowl news",
	  "topScoringIntent": {
	    "intent": "SearchNewsByCategory",
	    "score": 0.414106578,
	    "actions": [
	      {
	        "triggered": false,
	        "name": "SearchNewsByCategory",
	        "parameters": [
	          {
	            "name": "NewsCategory",
	            "type": "NewsCategory",
	            "required": true,
	            "value": null
	          }
	        ]
	      }
	    ]
	  },
	  "intents": [
	    {
	      "intent": "SearchNewsByCategory",
	      "score": 0.414106578,
	      "actions": [
	        {
	          "triggered": false,
	          "name": "SearchNewsByCategory",
	          "parameters": [
	            {
	              "name": "NewsCategory",
	              "type": "NewsCategory",
	              "required": true,
	              "value": null
	            }
	          ]
	        }
	      ]
	    },
	    {
	      "intent": "SearchNews",
	      "score": 0.131110832,
	      "actions": [
	        {
	          "triggered": true,
	          "name": "SearchNews",
	          "parameters": [
	            {
	              "name": "Encyclopedia",
	              "type": "encyclopedia",
	              "required": false,
	              "value": null
	            }
	          ]
	        }
	      ]
	    },
	    {
	      "intent": "None",
	      "score": 0.04309769
	    }
	  ],
	  "entities": [
	    {
	      "entity": "super bowl",
	      "type": "builtin.encyclopedia.time.event",
	      "startIndex": 5,
	      "endIndex": 14,
	      "score": 0.9727775
	    }
	  ],
	  "dialog": {
	    "prompt": "Please specify a category",
	    "parameterName": "NewsCategory",
	    "parameterType": "NewsCategory",
	    "contextId": "dc4c0b11-95b1-463f-8251-2b7e59253ee9",
	    "status": "Question"
	  }
	}
	```

1. Click the **X** in the upper-right corner of the dialog to close the dialog.

Now that the model is available over HTTP, you can call it from an application and incorporate the model's intelligence in the application.

<a name="Exercise5"></a>
## Exercise 5: Create a bot and connect it to the model ##

In this exercise, you will use the Microsoft Bot Framework to build a bot and connect it to the LUIS model you built and deployed so the bot can respond to commands such as "Find health news." You will use Visual Studio Code to write the bot. If you haven't installed Visual Studio Code, [please do so](http://code.visualstudio.com) before continuing with this exercise. It's free, and it runs on Windows, Linux, and macOS.

1. Start Visual Studio Code and select **Integrated Terminal** from the **View** menu. A TERMINAL window will appear at the bottom of the workspace.
 
    ![Opening an Integrated Terminal](Images/vs-select-open-terminal.png)

    _Opening an Integrated Terminal_

1. In the TERMINAL window, execute the following commands to create a folder named "Newsy" and make it the current directory:

	```
	md Newsy
	cd Newsy
	```
 
    ![Creating a "Newsy" folder](Images/vs-newsy.png)

    _Creating a "Newsy" folder_

1. Execute the following command in the TERMINAL window to launch a new instance of Visual Studio Code from the Newsy directory. You can then close the old instance of Visual Studio Code.

	```
	code .
	```

1. In the new instance of Visual Studio Code, click the **New File** icon to create a new file in the "Newsy" folder, and name the file **app.js**.

    ![Adding a file to the project](Images/vs-click-add-new-file.png)

    _Adding a file to the project_

1. Enter the following line of JavaScript code into **app.js**. Then save the file.

	```JavaScript
	console.log("Welcome to Newsy!");
	```

1. Select **Integrated Terminal** from the **View** menu again to open an integrated terminal. 
 
1. In the TERMINAL window, execute the following command to install the Microsoft Bot Builder SDK:

	```
	npm install --save botbuilder
	```	

1. Now execute this command to install the packages needed to leverage REST-based messaging routes in your code:

	```
	npm install --save restify
	```	 

1. Execute the following command to run the application. Confirm that "Welcome to Newsy!" appears in the TERMINAL window:

	```
	node app.js
	```	

1.	Click the **Debug** button in the ribbon on the left. Then click the **green arrow** at top and select **Node.js** from the drop-down list. This adds a new configuration file named **launch.json** to your project. When a message appears asking you to set up the launch configuration file for this project, click the **Close** button.
	
    ![Adding a launch file to the project](Images/vs-creating-launch-file.png)

    _Adding a launch file to the project_	

1. Add the following line to **launch.json**, inserting it between the "program" property and the "cwd" property as shown below. Then save the file.

	```JSON
	"console": "integratedTerminal",
	```
	
    ![Configuring the integrated terminal as the debugging console](Images/vs-edit-launch.png)

    _Configuring the integrated terminal as the debugging console_	

1. Return to **app.js** and replace the contents of the file with the following code:

	```JavaScript
	var builder = require('botbuilder');
	var https = require('https');
	var querystring = require('querystring');
	
	var connector = new builder.ConsoleConnector().listen();
	var bot = new builder.UniversalBot(connector);
	
	var luisAppId = "LUIS_APP_ID";
	var luisSubscriptionKey = "LUIS_SUBSCRIPTION_ID";
	
	bot.dialog('/', [
	    function (session) {
	        if (session.userData.intent == null) {
	            builder.Prompts.text(session, "Welcome to Newsy! Try typing something like 'Find health news'.");
	        }
	        else {
	            builder.Prompts.text(session, "Try typing something like 'Find health news'.");
	        }
	    },
	    function (session, results) {
	        session.userData.searchQuery = results.response;
	        var searchQuery = querystring.escape(session.userData.searchQuery);
	        var searchQueryString = "";
	
	        processLuisResults(session, searchQuery, searchQueryString);
	    }
	]);
	
	var processLuisResults = (function (session, searchQuery, searchQueryString) {
	    //CALL LUIS APPLICATION
	    var optionsLuisGet = {
	        host: 'api.projectoxford.ai',
	        port: 443,
	        path: '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisSubscriptionKey + '&q=' + searchQuery + '&verbose=true',
	        method: 'GET'
	    };
	
	    var reqGet = https.request(optionsLuisGet, function (res) {
	        res.on('data', function (luisResults) {
	
	            var luisResult = JSON.parse(luisResults.toString());
	            session.userData.intent = luisResult.intents[0].intent.toString();
	
	            if (luisResult.topScoringIntent.intent == "None") {
	                session.send("I'm not quite sure what you mean by '" + session.userData.searchQuery.toUpperCase() + "'");
	            }
	            else {
	
	                if (luisResult.topScoringIntent.actions[0].parameters[0].value != null) {
	                    session.userData.entity=luisResult.topScoringIntent.actions[0].parameters[0].value[0].entity;
	                }
	                else {
	                    session.userData.entity = luisResult.entities[0].entity.toString()
	                }               
	
	                switch (session.userData.intent) {
	                    case "FindNews":
	                        searchQueryString = 'searchQuery=' + querystring.escape(session.userData.entity);
	                        break;
	                    case "FindNewsByCategory":
	                        searchQueryString = 'category=' + querystring.escape(session.userData.entity);
	                        break;
	                    default:
	                        searchQueryString = 'searchQuery=' + querystring.escape(session.userData.entity);
	                        break;
	                }
	
	                session.send("Here's some news about " + session.userData.entity.toUpperCase() + " for you:");
	
	                //SEND DERIVED LUIS INTENT OVER TO BING SEARCH
	                showNewsResults(session, searchQueryString);
	            }
	        });
	    });
	
	    reqGet.end();
	    reqGet.on('error', function (e) {
	        session.send(e.toString());
	    });
	    //END CALL LUIS APPLICATION
	});
	
	var showNewsResults = (function (session, searchQueryString) {
	    //CALL BING NEWS SEARCH
	    var optionsSearch = {
	        host: 'traininglabservices.azurewebsites.net',
	        port: 443,
	        path: '/api/News?' + searchQueryString,
	        method: 'GET'
	    };
	
	    var reqGet = https.request(optionsSearch, function (res) {
	        res.on('data', function (newsResults) {
	
	            var newsResult = JSON.parse(newsResults.toString());
	
	            for (var result in newsResult) {
	                val = newsResult[result];
	                var title = val.Title;
	                var description = val.Description;
	
	                session.send(title + "\r\n" + description);
	            }
	        });
	    });
	
	    reqGet.end();
	    reqGet.on('error', function (e) {
	        session.send(e.toString());
	    });
	    //END BING NEWS SEARCH   
	});
	```	
 
	> Take a moment to review the code and observe how it uses the Microsoft Bot Framework Bot Builder to prompt the user, and how it places calls to the HTTP endpoint created in Exercise 4 to access your LUIS model. 

1. Before you can test the bot, you need to update your code with the app ID and subcription ID of your LUIS model. These values can be retrieved from LUIS portal. [Return to the portal](https://www.luis.ai/) in your browser and open the Newsy application you created in [Exercise 1](#Exercise1) if it isn't already open.

1. Click **App Settings**.
 
    ![Opening App Settings](Images/luis-click-app-settings.png)

    _Opening App Settings_
 
1. Copy the app ID to clipboard. Then click the **X** in the upper-right corner to close the dialog.
 
    ![Copying the app ID](Images/luis-select-app-id.png)

    _Copying the app ID_
 
1. Return to **app.js** in Visual Studio Code and replace *LUIS_APP_ID* on line 8 with the app ID that is on the clipboard.
 
1. Return to the LUIS portal and click your name to the right of the gear icon.
 
    ![Accessing LUIS account settings](Images/luis-click-settings.png)

    _Accessing LUIS account settings_

1. Click **Subscription Keys**. Then copy the programmatic API Key to the clipboard. This is your  LUIS subscription ID.
 
    ![Copying the subscription Id](Images/luis-subscription-settings.png)

    _Copying the subscription Id_
 
1. Return to **app.js** in Visual Studio Code and replace *LUIS_SUBSCRIPTION_ID* on line 9 with the app ID that is on the clipboard. Then save the file.
 
That's it! Your bot is now built, connected to LUIS, and ready to test.

<a name="Exercise6"></a>
## Exercise 6: Test the bot ##

The motivation for creating a bot is to have it carry on conversations with users. LUIS makes those conversations feel much more natural. In this exercise, you will run the bot you implemented in the previous exercise and see Language Understanding Intelligent Service at work.

1. In Visual Studio Code's TERMINAL window, execute the following command to start the bot:

	```
	node app.js
	```

1. Type "Hello" to "wake up" the bot. Then press **Enter** and wait for the bot to respond.
 
    ![Waking up the bot](Images/vs-starting-convo.png)

    _Waking up the bot_

1. Type "find soccer news" and press **Enter**. Wait for the bot to respond. After a brief pause while the bot calls out to your LUIS model, up to five relevant news articles will appear.
 
    ![Communicating with the bot](Images/vs-start-search.png)

    _Communicating with the bot_

1. Type "Hello" again and press **Enter**. Then type "find some great news about Microsoft" and press **Enter** again. What does the bot return this time? 

Feel free to try other commands such as "get the latest political news" and continue to converse with the bot. It understands a relatively narrow range of commands, but for those commands that it does understand, it almost seems to know what you're saying. Of course, you could expand the bot's vocabulary by adding to the LUIS model that you built. The only limit is how much time you're willing to spend refining and enhancing the model.

<a name="Summary"></a>
## Summary ##

In this hands-on lab you learned how to:

- Create a LUIS application
- Define intents and entities
- Use pre-built entities and phrase lists
- Train a LUIS model and publish it to an HTTP endpoint
- Create a bot that uses a LUIS model

There is much more that you can do to leverage the power of the Microsoft Language Understanding Intelligent Services in your code. For starters, try experimenting with other LUIS features such as [intent dialogs](https://docs.botframework.com/en-us/node/builder/chat/IntentDialog/#navtitle) and adding more pre-built entities to your model. For additional background on LUIS and examples of how to use it, refer to https://docs.botframework.com/en-us/node/builder/guides/understanding-natural-language/.

----

Copyright 2016 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.