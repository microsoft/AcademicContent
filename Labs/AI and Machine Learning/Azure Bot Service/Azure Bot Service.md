<a name="HOLTitle"></a>
# Building a Chat Bot with the Azure Bot Service #

Software bots are everywhere. You probably interact with them every day without realizing it. Bots, especially chat and messenger bots, are changing the way we interact with businesses, communities, and even each other. Thanks to light-speed advances in artificial intelligence (AI) and the ready availability of AI services, bots are not only becoming more advanced and personalized, but also more accessible to developers. 

Regardless of the target language or platform, developers building bots face a variety of challenges. Bots must be able process input and output intelligently. Bots need to be responsive, scalable, and extensible. They need to work cross-platform, and they need to interact with users in a conversational manner and in the language that the user chooses.

The [Azure Bot Service](https://azure.microsoft.com/services/bot-service/?WT.mc_id=academiccontent-github-cxa), combined with [Microsoft QnA Maker](https://www.qnamaker.ai/), provide the tools developers need to build and publish intelligent bots that interact naturally with users using a range of services. In this lab, you will create a bot using the Azure Bot Service and connect it to a knowledge base built with QnA Maker. Then you will interact with the bot using Skype — one of many popular services with which bots built with the Azure Bot Service can integrate.

![](Images/bot-service.png)

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create an Azure Web App Bot to host a bot
- Create a knowledge base, populate it with data, and connect it to a bot
- Implement bots in code and debug the bots that you build
- Publish bots and use continuous integration to keep them up to date
- Debug bots locally using Visual Studio Code and the Microsoft Bot Framework Emulator
- Plug a bot into Skype and interact with it there

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](https://aka.ms/WATK-FreeTrial).
- [Visual Studio Code](http://code.visualstudio.com?WT.mc_id=academiccontent-github-cxa) 
- [Git](https://git-scm.com) for Windows, macOS, or Linux
- The [Microsoft Bot Framework Emulator](https://emulator.botframework.com/)
- [Node.js](https://nodejs.org)
- [Skype](https://www.skype.com/en/download-skype/skype-for-computer/)

<a name="Cost"></a>
### Cost ###

![](Images/cost-2.png)

The cost of this lab is **moderate**. For an overview of cost ratings, refer to [Explanation of Costs](../../Costs.md).

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create an Azure Web App Bot](#Exercise1)
- [Exercise 2: Create a knowledge base with Microsoft QnA Maker](#Exercise2)
- [Exercise 3: Deploy a bot with Visual Studio Code](#Exercise3)
- [Exercise 4: Debug the bot locally](#Exercise4)
- [Exercise 5: Connect the bot to the knowledge base](#Exercise5)
- [Exercise 6: Test the bot with Skype](#Exercise6)
- [Exercise 7: Delete the resource group](#Exercise7)
 
Estimated time to complete this lab: **45** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create an Azure Web App Bot ##

The first step in creating a bot is to provide a location for the bot to be hosted in Azure. [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/?WT.mc_id=academiccontent-github-cxa) are perfect for hosting bot applications, and the Azure Bot Service is designed to provision them for you. In this exercise, you will use the Azure portal to provision an Azure Web App Bot.

1. Open the [Azure Portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa) in your browser. If you are asked to sign in, do so using your Microsoft account.

1. Click **+ Create a resource**, followed by **AI + Machine Learning** and then **Web App Bot**.
 
    ![Creating a new Azure Web App Bot](Images/new-bot-service.png)

    _Creating a new Azure Web App Bot_
  
1. Enter a name such as "qa-factbot" into the **App name** box. *This name must be unique within Azure, so make sure a green check mark appears next to it.* Select **Create new** under **Resource group** and enter the resource-group name "factbot-rg." Select the location nearest you and select the free **F0** pricing tier. Then click **Bot template**.

	![Configuring the Azure Web App Bot](Images/portal-start-bot-creation.png)

	_Configuring the Azure Web App Bot_

1. Select **Node.js** as the SDK language and **Question and Answer** as the template type. Then click **Select** at the bottom of the blade.   
  
	![Selecting the language and template](Images/portal-select-template.png)

	_Selecting the language and template_

1. Now click **App service plan/Location** followed by **Create New** and create an app service plan named "qa-factbot-service-plan" or something similar in the same region that you selected in Step 3. Once that's done, click **Create** at the bottom of the "Web App Bot" blade to start the deployment. 

1. Click **Resource groups** in the ribbon on the left side of the portal. Then click **factbot-rg** to open the resource group created for the Azure Web App Bot. Wait until "Deploying" changes to "Succeeded" at the top of the blade indicating that the Azure Web App Bot was successfully deployed. Deployment generally requires two minutes or less. Periodically click **Refresh** at the top of the blade to refresh the deployment status.

    ![Successful deployment](Images/deployment-succeeded.png)

    _Successful deployment_
  
Behind the scenes, a lot happened when the Azure Web App Bot was deployed. A bot was created and registered, an [Azure Web App](https://azure.microsoft.com/services/app-service/web/?WT.mc_id=academiccontent-github-cxa) was created to host it, and the bot was configured to work with [Microsoft QnA Maker](https://www.qnamaker.ai/). The next step is to use QnA Maker to create a knowledge base of questions and answers to infuse the bot with intelligence.

<a name="Exercise2"></a>
## Exercise 2: Create a knowledge base with Microsoft QnA Maker ##

[Microsoft QnA Maker](https://www.qnamaker.ai/) is part of [Azure Cognitive Services](https://www.microsoft.com/cognitive-services/?WT.mc_id=academiccontent-github-cxa), which is a suite of services and APIs for building intelligent apps backed by AI and machine learning. Rather than code a bot to anticipate every question a user might ask and provide a response, you can connect it to a knowledge base of questions and answers created with QnA Maker. A common usage scenario is to create a knowledge base from a FAQ so the bot can answer domain-specific questions such as "How do I find my Windows product key" or "Where can I download Visual Studio Code?"

In this exercise, you will use QnA Maker to create a knowledge base containing questions such as "What NFL teams have won the most Super Bowls" and "What is the largest city in the world?" Then you will deploy the knowledge base in an Azure Web app so it can be accessed via an HTTPS endpoint.

1. Open the [Microsoft QnA Maker portal](https://www.qnamaker.ai/) in your browser and sign in with your Microsoft account if you aren't already signed in. Then click **Create a knowledge base** in the menu bar at the top of the page.
 
    ![Creating a knowledge base](Images/qna-new-kb.png)

    _Creating a knowledge base_

1. Click **Create a QnA service**.

    ![Creating a QnA service](Images/create-kb-1.png)

    _Creating a QnA service_

1. Enter a name such as "qa-factbot-kb" into the **Name** box. This name must be unique within Azure, so make sure a green check mark appears next to it *and* in the **App name** box further down the blade. Select **Use existing** under **Resource group** and select the "factbot-rg" resource group that you created when you deployed the Azure Web App Bot in [Exercise 1](#Exercise1). Select **F0** and **F** as the pricing tiers. (Both are free tiers that are ideal for experimenting with bots.) Select the location nearest you in both location drop-downs, and then click the **Create** button at the bottom of the blade.

    ![Creating a QnA service](Images/new-qna-maker-service.png)

    _Creating a QnA service_

1. Click **Resource groups** in the ribbon on the left side of the portal and open the "factbot-rg" resource group. Wait until "Deploying" changes to "Succeeded" at the top of the blade indicating that the QnA service and the resources associated with it were successfully deployed. Once more, you can click **Refresh** at the top of the blade to refresh the deployment status.

    ![Successful deployment](Images/resource-group-master-2.png)

    _Successful deployment_

1. Return to the [Create a knowledge base](https://www.qnamaker.ai/Create) page in the QnA Maker portal. Under **Azure QnA service**, select the QnA service whose name you specified in Step 3. Then assign the knowledge base a name such as "Factbot Knowledge Base."

    ![Naming the knowledge base](Images/create-kb-2-3.png)

    _Naming the knowledge base_

1. You can enter questions and answers into a QnA Maker knowledge base manually, or you can import them from online FAQs or local files. Supported formats include tab-delimited text files, Microsoft Word documents, Excel spreadsheets, and PDF files.

	To demonstrate, [click here](https://topcs.blob.core.windows.net/public/bots-resources.zip) to download a zip file containing a text file named **Factbot.tsv**, and copy the file to your computer. Then scroll down in the QnA Maker portal, click **+ Add file**, and select **Factbot.tsv**. This file contains 20 questions and answers in tab-delimited format.

    ![Populating the knowledge base](Images/create-kb-4.png)

    _Populating the knowledge base_

1. Click **Create your KB** at the bottom of the page and wait for the knowledge base to be created. It should take less than a minute.

    ![Creating the knowledge base](Images/create-kb-5.png)

    _Creating the knowledge base_

1. Confirm that the questions and answers imported from **Factbot.tsv** appear in the knowledge base. Then click **Save and train** and wait for training to complete.

    ![Training the knowledge base](Images/save-and-train.png)

    _Training the knowledge base_

1. Click the **Test** button to the right of the **Save and train** button. Type "Hi" into the message box and press **Enter**. Confirm that the response is "Welcome to the QnA Factbot," as shown below.

    ![Testing the knowledge base](Images/test-kb.png)

    _Testing the knowledge base_

1. Type "What book has sold the most copies?" into the message box and press **Enter**. What is the response?

1. Click the **Test** button again to collapse the Test panel. Then click **Publish** in the menu at the top of the page, and click the **Publish** button at the bottom of the page to publish the knowledge base. *Publishing* makes the knowledge base available at an HTTPS endpoint.

    ![Publishing the knowledge base](Images/publish-kb.png)

    _Publishing the knowledge base_ 

Wait for the publication process to complete and confirm that you are told the QnA service has been deployed. With the knowledge base now hosted in an Azure Web App of its own, the next step is to deploy a bot that can use it.

<a name="Exercise3"></a>
## Exercise 3: Deploy a bot with Visual Studio Code ##

When you created an Azure Web App Bot in [Exercise 1](#Exercise1), an Azure Web App was deployed to host it. But the bot does require some code, and it still needs to be deployed to the Azure Web app. Fortunately, the code was generated for you by the Azure Bot Service. In this exercise, you will use Visual Studio Code to place the code in a local Git repository and publish the bot to Azure by pushing changes from the local repository to a remote repository connected to the Azure Web App that hosts the bot — a process known as [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration).

1. If [Git](https://git-scm.com/) isn't installed on your PC, go to https://git-scm.com/downloads and install the Git client for your operating system. Git is a free and open-source distributed version-control system, and it integrates seamlessly into Visual Studio Code. If you aren't sure whether Git is installed, open a Command Prompt or terminal window and execute the following command:

	```	
	git --version
	```

	If a version number is displayed, then the Git client is installed.

1. If Node.js isn't installed on your PC, go to https://nodejs.org/ and install the latest LTS version. You can determine whether Node is installed by opening a Command Prompt or terminal window and typing the following command:

	```
	node --version
	```

	If Node is installed, the version number will be displayed.

1. If Visual Studio Code isn't installed on your PC, go to https://code.visualstudio.com/ and install it now.

1. Create a folder named "Factbot" in the location of your choice on your hard disk to hold the bot's source code.

1. Return to the Azure Portal and open the "factbot-rg" resource group. Then click the Web App Bot you created in [Exercise 1](#Exercise1).

    ![Opening the Web App Bot](Images/open-web-app-bot.png)

    _Opening the Web App Bot_

1. Click **Build** in the menu on the left, and then click **Download zip file** to prepare a zip file containing the bot's source code. Once the zip file is prepared, click the **Download zip file** button to download it. When the download is complete, copy the contents of the zip file to the "Factbot" folder that you created in Step 4.

    ![Downloading the source code](Images/download-source.png)

    _Downloading the source code_
  
1. Still on the "Build" blade, click **Configure continuous deployment**. Click **Setup** at the top of the ensuing blade, followed by **Choose Source**. Then select **Local Git Repository** as the deployment source and click **OK**. 
 
    ![Specifying a local Git repository as the deployment source](Images/portal-set-local-git.png)

    _Specifying a local Git repository as the deployment source_  

1. Close the "Deployments" blade and click **All App service settings** in the menu on the left.

1. Click **Deployment credentials**, and then enter a user name and password. You will probably have to enter a user name other than "FactbotAdministrator" because the name must be unique within Azure. Then click **Save** and close the blade.

    ![Entering deployment credentials](Images/portal-enter-ci-creds.png)

    _Entering deployment credentials_  

1. Start Visual Studio Code and use the **File** > **Open Folder...** command to open the "Factbot" folder that you copied the bot's source code to in Step 6.

1. Click the **Source Control** button in the activity bar on the left side of Visual Studio Code, and click the **Initialize Repository** icon at the top. Then click the **Intialize Repository** button in the ensuing dialog.

    ![Initializing a local Git repository](Images/vs-init-git-repo.png)

    _Initializing a local Git repository_  

1. Type "First commit." into the message box, and then click the check mark to commit your changes.

    ![Committing changes to the local repository](Images/vs-first-git-commit.png)

    _Committing changes to the local repository_  

1. Select **Integrated Terminal** from Visual Studio Code's **View** menu to open an integrated terminal. Then execute the following command in the integrated terminal, replacing BOT_NAME in two places with the bot name you entered in Exercise 1, Step 3.

	```
	git remote add qna-factbot https://BOT_NAME.scm.azurewebsites.net:443/BOT_NAME.git
	```

1. Click the ellipsis (the three dots) at the top of the SOURCE CONTROL panel and select **Publish Branch** from the menu to push the bot code from the local repository to Azure. If prompted for credentials, enter the user name and password you specified in Step 9 of this exercise.

Your bot has been published to Azure. But before you test it there, let's run it locally and learn how to debug it in Visual Studio Code.

<a name="Exercise4"></a>
## Exercise 4: Debug the bot locally ##

As with any application code that you write, changes to bot code need to be tested and debugged locally before being deployed to production. To help debug bots, Microsoft offers the [Bot Framework Emulator](https://emulator.botframework.com/). In this exercise, you will learn how to use Visual Studio Code and the emulator to debug your bots.

1. If you haven't installed the Microsoft Bot Framework Emulator, take a moment to do so now. You can download it from https://emulator.botframework.com/. Versions are available for Windows, macOS, and Linux.

1. Execute the following command in Visual Studio Code's integrated terminal to install [Restify](http://restify.com/), a popular Node package for building and consuming RESTful Web services:

	```
	npm install restify
	```

1. Repeat this step for the following commands to install the [Microsoft Bot Framework Bot Builder SDK for Node.js](https://docs.microsoft.com/bot-framework/nodejs/bot-builder-nodejs-quickstart?WT.mc_id=academiccontent-github-cxa):

	```
	npm install botbuilder
	npm install botbuilder-azure
	npm install botbuilder-cognitiveservices
	```

1. Click the **Explorer** button in Visual Studio Code's activity bar. Then select **app.js** to open it in the code editor. This file contains the code that drives the bot — code that was generated by the Azure Bot Service and downloaded from the Azure portal.

    ![Opening app.js](Images/vs-select-index-js.png)

    _Opening app.js_ 

1. Replace the contents of **app.js** with the following code. Then save the file:

	```JavaScript
	"use strict";
	var builder = require("botbuilder");
	var botbuilder_azure = require("botbuilder-azure");
	
	var useEmulator = true; 
	var userName = ""; 
	var yearsCoding = ""; 
	var selectedLanguage = "";
	
	var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
	    appId: process.env.MicrosoftAppId,
	    appPassword: process.env.MicrosoftAppPassword	   
	});
	
	var bot = new builder.UniversalBot(connector);
	
	bot.dialog('/', [
	
	function (session) {
	    builder.Prompts.text(session, "Hello, and welcome to QnA Factbot! What's your name?");
	},
	
	function (session, results) {
	    userName = results.response;
	    builder.Prompts.number(session, "Hi " + userName + ", how many years have you been writing code?"); 
	},
	
	function (session, results) {
	    yearsCoding = results.response;
	    builder.Prompts.choice(session, "What language do you love the most?", ["C#", "Python", "Node.js", "Visual FoxPro"]);
	},
	
	function (session, results) {
	    selectedLanguage = results.response.entity;   
	
	    session.send("Okay, " + userName + ", I think I've got it:" +
	                " You've been writing code for " + yearsCoding + " years," +
	                " and prefer to use " + selectedLanguage + ".");
	}]);
	 
	var restify = require('restify');
	var server = restify.createServer();

	server.listen(3978, function() {
	    console.log('test bot endpoint at http://localhost:3978/api/messages');
	});

	server.post('/api/messages', connector.listen());    
	```

1. Set breakpoints on lines 20, 25, and 30 by clicking in the margin on the left.
 
    ![Adding breakpoints to app.js](Images/vs-add-breakpoints.png)

    _Adding breakpoints to app.js_ 

1. Click the **Debug** button in the activity bar, and then click the green arrow to start a debugging session. Confirm that "test bot endpoint at http://localhost:3978/api/messages" appears in the debug console.
 
    ![Launching the debugger](Images/vs-launch-debugger.png)

    _Launching the debugger_ 

1. Your bot code is now running locally. Launch the Bot Framework Emulator and click **Create a new bot configuration**. Enter the bot name and the bot URL displayed in the debug console in the previous step. Then click **Save and connect** and save the configuration file in the location of your choice.

	> In the future, you can reconnect to the bot simply by clicking the bot name under "My Bots."

    ![Connecting to the bot](Images/new-bot-configuration.png)

    _Connecting to the bot_ 

1. Type "hi" into the box at the bottom of the emulator and press **Enter**. Confirm that Visual Studio Code breaks on line 20 of **app.js**. Then click the **Continue** button in Visual Studio Code's debugging toolbar and return to the emulator to see the bot's response.
 
    ![Continuing in the debugger](Images/continue-debugging.png)

    _Continuing in the debugger_ 

1. The bot will ask you a series of questions. Answer them and click **Continue** in Visual Studio Code each time a breakpoint is hit. When you're done, click the **Stop** button in the debugging toolbar to end the debugging session.

At this point, you have a fully functioning bot and know how to debug it by running it locally in the Microsoft Bot Emulator. The next step is to make the bot more intelligent by connecting it to the knowledge base you published in [Exercise 2](#Exercise2).

<a name="Exercise5"></a>
## Exercise 5: Connect the bot to the knowledge base ##

In this exercise, you will connect your bot to the QnA Maker knowledge base you built earlier so the bot can carry on an intelligent conversation. Connecting to the knowledge base involves retrieving some information from the QnA Maker portal, copying it into the Azure portal, updating the bot code, and then redeploying the bot to Azure.

1. Return to the [QnA Maker portal](https://www.qnamaker.ai/) and click your name in the upper-right corner. Select **Manage endpoint keys** from the menu that drops down. Click **Show** to show the primary endpoint key, and **Copy** to copy it to the clipboard. Then paste it into a text file so you can easily retrieve it in a moment.

	![Copying the endpoint key](Images/copy-primary-key.png)
	
	_Copying the endpoint key_ 

1. Click **My knowledge bases** in the menu at the top of the page. Then click **View Code** for the knowledge base that you created earlier.

	![Opening the knowledge base](Images/open-knowledge-base.png)

	_Opening the knowledge base_

1. Copy the knowledge base ID from the first line and the host name from the second line and paste them into a text file as well. Then close the dialog. **Do not** include the "https://" prefix in the host name that you copy.

	![Copying the knowledge base ID and host name](Images/copy-endpoint-info.png)
	
	_Copying the knowledge base ID and host name_  

1. Return to the Web App Bot in the Azure portal. Click **Application settings** in the menu on the left and scroll down until you find application settings named "QnAKnowledgebaseId," "QnAAuthKey,", and "QnAEndpointHostName." Paste the knowledge base ID and host name obtained in Step 3 and the endpoint key obtained in Step 1 into these fields. Then click **Save**.

    ![Editing application settings](Images/enter-app-settings.png)

    _Editing application settings_ 
 
1. Return to Visual Studio Code and replace the contents of **app.js** with the code below. Then save the file.

	```JavaScript
	var restify = require('restify');
	var builder = require('botbuilder');
	var botbuilder_azure = require("botbuilder-azure");
	var builder_cognitiveservices = require("botbuilder-cognitiveservices");
	
	// Setup Restify Server
	var server = restify.createServer();
	server.listen(process.env.port || process.env.PORT || 3978, function () {
	   console.log('%s listening to %s', server.name, server.url); 
	});
	  
	// Create chat connector for communicating with the Bot Framework Service
	var connector = new builder.ChatConnector({
	    appId: process.env.MicrosoftAppId,
	    appPassword: process.env.MicrosoftAppPassword     
	});
	
	// Listen for messages from users 
	server.post('/api/messages', connector.listen());
	 
	// Create your bot with a function to receive messages from the user
	var bot = new builder.UniversalBot(connector);
	
	var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
	    knowledgeBaseId: process.env.QnAKnowledgebaseId, 
	    authKey: process.env.QnAAuthKey,
	    endpointHostName: process.env.QnAEndpointHostName
	});
	
	var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
	    recognizers: [recognizer],
	    defaultMessage: "I'm not quite sure what you're asking. Please ask your question again.",
	    qnaThreshold: 0.3
	});
	
	bot.dialog('basicQnAMakerDialog', basicQnAMakerDialog);
	
	bot.dialog('/',
	[
	    function (session) {
	        session.replaceDialog('basicQnAMakerDialog');
	    }
	]);
	```

	Note the call to create a ```QnAMakerDialog``` instance on line 30. This creates a dialog that integrates a bot built with the Azure Bot Service with a knowledge base built Microsoft QnA Maker.
 
1. Click the **Source Control** button in the activity bar in Visual Studio Code. Type "Connected to knowledge base" into the message box, and click the check mark to commit your changes. Then click the ellipsis and use the **Publish Branch** command to push these changes to the remote repository (and therefore to the Azure Web App).

1. Return to the Web App Bot in the Azure portal and click **Test in Web Chat** on the left to open the test console. Type "What's the most popular software programming language in the world?" into the box at the bottom of the chat window and press **Enter**. Confirm that the bot responds as follows:

    ![Testing the bot](Images/portal-testing-chat.png)

    _Testing the bot_

Now that the bot is connected to the knowledge base, the final step is to test it in the wild. And what could be wilder than testing it with Skype?

<a name="Exercise6"></a>
## Exercise 6: Test the bot with Skype ##

Once deployed, bots can be connected to channels such as Skype, Slack, Microsoft Teams, and Facebook Messenger, where you can interact with them the way you would with a person. In this exercise, you will add the bot to your Skype contacts and carry on a conversation with it in Skype.

1. If Skype isn't already installed on your computer, please install it now. You can download Skype for Windows, macOS, and Linux from https://www.skype.com/en/download-skype/skype-for-computer/.

1. Return to your Web App Bot in the Azure Portal and click **Channels** in the menu on the left. Click the **Skype** icon. Then click **Cancel** at the bottom of the blade.

    ![Editing the Skype channel](Images/portal-edit-skype.png)

    _Editing the Skype channel_
 
1. Click **Skype**. Then click **Add to Contacts** to add the bot as a Skype contact and launch Skype.

	![Connecting to Skype](Images/portal-click-skype.png)
	
	_Connecting to Skype_
 
1. Start a conversation with by typing "hi" into the Skype window. Then converse with the bot by asking it questions and seeing how it responds. Refer to the **Factbot.tsv** file that you used to populate the knowledge base in [Exercise 2](#Exercise2) for examples of questions to ask.
 
    ![Chatting with the bot in Skype](Images/skype-responses.png)

    _Chatting with the bot in Skype_

You now have a fully functional bot created with the Azure Bot Service, infused with intelligence by Microsoft QnA Maker, and available for anyone in the world to interact with. Feel free to plug your bot into other channels and test it in different scenarios. And if you would like to make the bot smarter, consider expanding the knowledge base with additional questions and answers. For example, you could use the [online FAQ](https://docs.microsoft.com/azure/bot-service/bot-service-resources-bot-framework-faq?view=azure-bot-service-3.0&WT.mc_id=academiccontent-github-cxa) for the Bot Framework to train the bot to answer questions about the framework itself.

<a name="Exercise7"></a>
## Exercise 7: Delete the resource group ##

In this exercise, you will delete the resource group containing the bot and all the resources associated with it. Deleting the resource group deletes everything in it and prevents any further charges from being incurred for it. Resource groups that are deleted can't be recovered, so be certain you're finished using it before deleting it.

1. Return to the blade for the "factbot-rg" resource group. Then click **Delete resource group** at the top of the blade.

    ![Deleting the resource group](Images/delete-resource-group.png)

    _Deleting the resource group_

1. For safety, you are required to type in the resource group's name. (Once deleted, a resource group cannot be recovered.) Type the name of the resource group. Then click the **Delete** button to remove all traces of this lab from your Azure subscription.

After a few minutes, the resource group and all of its resources will be deleted. Billing stops when you click **Delete**, so you're not charged for the time required to delete the resources. Similarly, billing doesn't start until the resources are fully and successfully deployed.

<a name="Summary"></a>
## Summary ##

There is much more that you can do to leverage the power of the Azure Bot Service by incorporating [Dialogs](http://aihelpwebsite.com/Blog/EntryId/9/Introduction-To-Using-Dialogs-With-The-Microsoft-Bot-Framework), [FormFlow](https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/07/14/building-a-microsoft-bot-using-microsoft-bot-framework-using-formflow/?WT.mc_id=academiccontent-github-cxa), and [Microsoft Language Understanding and Intelligence Services (LUIS)](https://docs.botframework.com/node/builder/guides/understanding-natural-language/?WT.mc_id=academiccontent-github-cxa). With these and other features, you can build sophisticated bots that respond to users' queries and commands and interact in a fluid, conversational, and non-linear manner. For more information, and for ideas to get you started, see [What is Microsoft Bot Framework Overview](https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/04/05/what-is-microsoft-bot-framework-overview/?WT.mc_id=academiccontent-github-cxa).

----

Copyright 2018 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.