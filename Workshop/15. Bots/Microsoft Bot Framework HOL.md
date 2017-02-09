<a name="HOLTitle"></a>
# The Microsoft Bot Framework #

---

<a name="Overview"></a>
## Overview ##

Software bots are everywhere. You probably interact with them every day without realizing it. Bots, especially chat and messenger bots, are changing the way we interact with businesses, communities, and even each other. Thanks to light-speed advances in artificial intelligence (AI) and the ready availability of AI services, bots are not only becoming more advanced and personalized, but also more accessible to developers. 

Regardless of the target language or platform, developers building bots face the same challenges. Bots require input and output capabilities. Bots need language and dialog logic. Bots need to respond to questions with appropriate answers, and bots need to be responsive, scalable, and extensible. They need to work cross-platform, and they need to interact with users in a conversational manner and in the language the user chooses. The [Microsoft Bot Framework](https://dev.botframework.com/) combined with [Microsoft QnA Maker](https://qnamaker.ai/) provides the tools developers need to build, connect, manage, and publish intelligent bots that interact naturally with users using a range of services. 

In this lab, you will create a bot using Visual Studio Code and the Microsoft Bot Framework, and populate a knowledge base using Microsoft QnA Maker. Then you will interact with the bot using Skype — one of many popular services that can integrate with bots built with the Microsoft Bot Framework.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create an Azure Bot Service to register and host a bot
- Create a Microsoft QnA Service to populate a knowledge base
- Setup continuous code integration to publish bot code
- Debug the bots that you build
- Update your bot using Visual Studio Code, Node.js, and JavaScript
- Interact with a bot using Skype

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](http://aka.ms/WATK-FreeTrial).
- [Visual Studio Code](http://code.visualstudio.com) 
- [Git Client](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org)
- [Microsoft Bot Framework Emulator](https://emulator.botframework.com/)
- [Skype](https://www.skype.com/en/download-skype/skype-for-computer/)

---

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create an Azure Bot Service](#Exercise1)
- [Exercise 2: Update Microsoft QnA Service settings](#Exercise2)
- [Exercise 3: Populate and publish a QnA knowledge base](#Exercise3)
- [Exercise 4: Set up continuous integration](#Exercise4)
- [Exercise 5: Debug our bot](#Exercise5)
- [Exercise 6: Update your bot](#Exercise6)
- [Exercise 7: Test the bot](#Exercise7)
 
Estimated time to complete this lab: **60** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create an Azure Bot Service ##

The first step in creating a bot is to provide a location for the bot to be hosted, as well as configuring the services that will be used by your bot for authorization. Azure Web Apps are perfect for hosting bot applications, and the Azure Bot Service is designed to provision and connect these services for you. In this exercise, you will create and configure an Azure Bot Service.

1. Open the [Azure Portal](https://portal.azure.com) in your browser. If you are asked to sign in, do so using your Microsoft account.

1. Click **+ New**, followed by **Intelligence + Analytics** and then **Bot Service (preview)**.
 
    ![Creating a new Azure Bot Service](Images/portal-new-bot-service.png)

    _Creating a new Azure Bot Service_
  
1. Enter a name such as "qnafactbot" (without quotation marks) into the **App name** box. *This name must be unique within Azure, so make sure a green check mark appears next to it.* Make sure **Create new** is selected under **Resource Group** and enter the resource-group name "BotsResourceGroup" (again, without quotation marks). Then select the location nearest you and click **Create**. 

    ![Configuring a new Azure Bot Service](Images/portal-create-new-bot-service.png)

    _Configuring a new Azure Bot Service_
  
1. Click **Resource Groups** in the ribbon on the left, followed by **BotsResourceGroup** to open the resource group created for the Bot Service.

	> Click the browser's **Refresh** button to update the deployment status. Clicking the **Refresh** button in the resource-group blade refreshes the list of resources in the resource group, but does not reliably update the deployment status.

    ![Opening the resource group](Images/portal-open-resource-group.png)

    _Opening the resource group_
  
1. Wait until "Deploying" changes to "Succeeded" indicating your Bot Service has been successfully deployed.

    ![Successful deployment](Images/portal-app-deployment-status.png)

    _Successful deployment_
  
1. Click **qnafactbot** (or the name you entered in Step 3) to open the App Service created for your bot.

    ![Opening the bot service](Images/portal-click-bot-service.png)

    _Opening the bot service_
  
1. Click **Create Microsoft App ID and password**. If you are asked to sign in again, do so using your Microsoft account.

    ![Creating an app ID and password](Images/portal-click-create-msft-app.png)

    _Creating an app ID and password_
  
1. Click **Generate an app password to continue**.

    ![Generating an app password](Images/portal-generate-password.png)

    _Generating an app password_
  
1. Copy the password to the clipboard. **You will not be able to retrieve this password after this step**, but will be required to use it in a later exercise. Once the password is saved, click **Ok** to dismiss the dialog.

    ![Copying the app password](Images/portal-new-password-generated.png)

    _Copying the app password_
  
1. Review the application registration information, and then click **Finish and go back to Bot Framework**.

    ![Finalizing the app registration](Images/portal-click-finish.png)

    _Finalizing the app registration_
  
1. Paste the password copied to the clipboard in Step 9 into the password box.

    ![Pasting the app password](Images/portal-paste-app-password.png)

    _Pasting the app password_
  
1. Click **NodeJS**. Then click **Question and Answer** and click **Create bot**. If you are asked to sign in again, do so using your Microsoft account. Also, if you are asked for permission for QnA Maker to access your info, click **Yes**.

    ![Selecting a language and template](Images/portal-select-template.png)

    _Selecting a language and template_

1. Check the **I agree** box, and then click **OK**. 

    ![Connecting to QnA Maker](Images/connect-bot-to-qnamaker.png)

    _Connecting to QnA Maker_
  
1. After a short delay, the Bot Service will open in the portal and display the Bot Service editor, as pictured below. The Bot Service has now been created, and the following services have been provisioned and configured:

	- A Microsoft Bot registration
	- A Microsoft App registration
	- An Azure App Service
	- A Microsoft QnA Maker service

    ![The Bot Service editor](Images/portal-editor-new.png)

    _The Bot Service editor_  

1. To make sure these services can communicate with each other, you can test bot communication in the Azure Bot Service editor. To test, type the word "hi" (without quotation marks) into the chat window on the right side of the page.

    ![Testing bot communication](Images/portal-send-chat-test.png)

    _Testing bot communication_

1. Wait for the bot to respond with the word "hello," indicating your bot is configured and ready to go.

    ![Chatting with your bot](Images/portal-test-chat.png)

    _Chatting with your bot_

With the Bot Service deployed and configured, the next step is to update Microsoft QnA Maker settings.

<a name="Exercise2"></a>
## Exercise 2: Update Microsoft QnA Service settings ##

Although your bot has been created, it can only understand the word "hi" by responding with the word "hello". To understand where your bot is getting this information, it's time to start working in the Microsoft QnA Maker portal.

1. Open the [Microsoft QnA Maker portal](https://qnamaker.ai/) in your browser. If you are not signed in, click **Sign in** in the upper-right corner and sign in with your Microsoft account. If you are presented with a terms agreement, check the **I agree** box and continue. 

    ![Signing in to the QnA Maker portal](Images/qna-click-signin.png)

    _Signing in to the QnA Maker portal_

1. Ensure that **My services** is selected at the top. Then click the pencil icon.
 
    ![Editing a Microsoft QnA service](Images/qna-click-edit-icon.png)

    _Editing a Microsoft QnA service_

1. Click **Settings**.
 
    ![Opening the Settings page](Images/qna-select-settings-tab.png)

    _Opening the Settings page_

1. Replace the value in the **Service name** box with "QnA Factbot" (without quotation marks). Then click **Save and retrain** to save the change. 
 
    ![Updating the service name](Images/qna-save-service-name.png)

    _Updating the service name_

1. Click **Knowledge Base**.
 
    ![Opening the Knowledge Base page](Images/qna-select-kb-tab.png)

    _Opening the Knowledge Base page_

1. Replace "hello" in the Answer column with "Welcome to the QnA Factbot!" Then click **Save and retrain** to save the change. 
 
    ![Updating a response](Images/qna-update-default-answer.png)

    _Updating a response_

1. Click **Test**.
 
    ![Opening the Test page](Images/qna-select-test-tab.png)

    _Opening the Test page_

1. Type "hi" into the box at the bottom of the chat window and press **Enter**. Confirm that the bot responds with "Welcome to the QnA Factbot!"
 
    ![Chatting with the bot](Images/qna-updated-chat-response.png)

    _Chatting with the bot_

This is a great start, but a simple reply to the greeting "hi" doesn't demonstrate a lot of value. To give your bot some meaningful content to work with, the next step is to populate the knowledge base with more questions and answers and publish it for your bot to use.

<a name="Exercise3"></a>
## Exercise 3: Populate and publish a QnA knowledge base ##

The Microsoft QnA Maker tool is designed to understand question and answer pairs from a variety of methods, including automatic population from a website FAQ page, manual entry, or even a tab-separated text file on your local computer. In this exercise, you will use all of these techniques to create a set of question and answer pairs.

1. Click **Settings** to the return to the Settings page in the [Microsoft QnA Maker portal](https://qnamaker.ai/).
 
    ![Opening the Settings page](Images/qna-select-settings-tab.png)

    _Opening the Settings page_

1. Paste the following URL into the **URLs** box:

	```
	https://traininglabservices.azurewebsites.net/help/faqs.html
	```

1. Click **Save and retrain** to instruct QnA Maker to populate the Knowledge Base with questions and answers from the Web site whose URL you provided.
 
    ![Populating the Knowledge Base with questions and answers](Images/qna-add-faq-url.png)

    _Populating the Knowledge Base with questions and answers_

1. Click **Knowledge Base** and confirm that six new questions and answers were added. Then click **Save and retrain** to save the changes.

    ![The updated Knowledge Base](Images/qna-updated-kb-01.png)

    _The updated Knowledge Base_

1. Click **Test** to return to the Test page. Type "What's the largest city in the world?" into the box at the bottom of the chat window and press **Enter**. Confirm that the bot responds as shown below.
 
    ![Testing the updated Knowledge Base](Images/qna-test-largest-city.png)

    _Testing the updated Knowledge Base_

1. The knowledge base only contains a few questions and answers, but can easily be updated to include more. You can even import questions and answers stored in text files on your computer. To demonstrate, click **Replace Knowledge Base** in the upper-left corner of the portal.
 
    ![Replacing the Knowledge Base](Images/qna-click-replace-kb.png)

    _Replacing the Knowledge Base_

1. Browse to the "Resources" folder included with this lab and select the text file named **Final QnA.txt**. Click **OK** when prompted to confirm that importing this file will overwrite existing questions and answers.
 
1. Click **Knowledge Base** and confirm that 14 new questions and answers appear in the Knowledge Base. (The six you imported from the URL are still there, despite the fact that you were warned that they would be overwritten.) Then click **Save and retrain** to save the changes.

    ![The updated Knowledge Base](Images/qna-updated-kb-02.png)

    _The updated Knowledge Base_

1. Click **Test** to return to the Test page. Type "What book has sold the most copies?" into the box at the bottom of the chat window and press **Enter**. Confirm that the bot responds as shown below. 
 
    ![Chatting with the bot](Images/qna-test-book.png)

    _Chatting with the bot_

1. The Knowledge Base now contains 20 questions and answers, but an invalid character is present in the answer in row 7. To remove the character, click **Knowledge Base** to return to the Knowledge Base page. Locate the invalid character in row 7 between the words "most" and "Emmys," and replace it with a space character. Then click **Save and retrain**.
 
    ![Editing answer #7](Images/qna-invalid-char.png)

    _Editing answer #7_

1. Click **Publish** to publish the QnA Knowledge Base so it can be used with a bot.
 
    ![Publishing knowledge base changes](Images/qna-click-publish.png)

    _Publishing knowledge base changes_

1. When asked to "Review your changes,", click **Publish**. After a brief pause, you should be notified that the service has been deployed.
 
    ![Reviewing knowledge base publishing changes](Images/qna-review-publishing-changes.png)

    _Reviewing knowledge base publishing changes_

The QnA Knowledge Base has been populated with questions and answers and published for use in a bot. In the remaining exercises, you will use Visual Studio Code to work with the Microsoft Bot Framework code created for you in [Exercise 1](#Exercise1).

<a name="Exercise4"></a>
## Exercise 4: Set up continuous integration ##

Publishing changes to your bot project often involves a number of steps, since you typically work with code in a local development environment, such as Visual Studio Code, but the final code needs to exist somewhere bot users can easily access. Since an Azure Bot Service is a type of Azure App Service, you can leverage the "continuous integration" feature of Azure App Services to keep your code synchronized with external repositories, such as Visual studio Team Services or GitHub.

1. Open the Azure Portal dashboard (if it’s not already open from Exercise 1) and click the **“hamburger”** icon to open the side drawer menu.
1. Click **Resource Groups** followed by **BotsResourceGroup**.

    ![Opening the resource group](Images/portal-open-resource-group.png)

    _Opening the resource group_
  
1. Select the **Overview** tab.
1. Click **qnafactbot** (or the name you used to create the Azure Bot Service in Exercise 1, Step 3) to open the Azure Bot Service editor for the bot.

    ![Opening the bot service](Images/portal-click-bot-service.png)

    _Opening the bot service_
  
1. Select the **Settings** tab in the Bot Service editor. 
1. Expand the **Configure** node under the "Continuous integration" group.

    ![Expanding the Continuous integration Configure node](Images/portal-expand-configure.png)

    _Expanding the Continuous integration Configure node_
  
1. Click the zip file link referenced to the right of "Download your source code".

    ![Generating the bot project archive file](Images/portal-click-download-source.png)

    _Generating the bot project archive file_
  
1. After a short delay, the Azure Bot Service will prompt you to save the generated zip file to your local computer. Follow the prompts from your browser to save this file to a location on your local computer, and then extract/unzip the zip file to a location for local use. 

    ![Saving the generated archive file](Images/fe-extract-project-archive.png)

    _Saving the generated archive file_  

Your Microsoft Bot Framework code is now available on your local computer.

1. Still in the "Settings" tab of Azure Portal dashboard, locate the "Advanced Settings" panel and click **Open** to open the Azure Bot Service App Service blade.

    ![Opening the Advanced Settings blade](Images/portal-open-advanced-settings.png)

    _Opening the Advanced Settings blade_  

1. In the "App Deployment" group, click **Deployment Credentials**.

    ![Opening Deployment Credential settings](Images/portal-select-deployment-credentials.png)

    _Opening Deployment Credential settings_  

1. Type in a user name, such as "BotAdministrator" (without quotation marks) in the **FTP/deployment username** entry. This is the username you will use when deploying your bot code throughout the remainder of this lab.
1. Type in "Password_1" (again, without quotation marks) in the **Password** entry, and then enter it one more time in the **Confirm password** entry. This is the password you will use when deploying your bot code throughout the remainder of this lab.

    ![Entering continuous integration credentials](Images/portal-enter-ci-creds.png)

    _Entering continuous integration credentials_  

1. Click **Save** in the "Deployment credentials" blade to save your credential changes. 

    ![Saving continuous integration credentials](Images/portal-saving-ci-creds.png)

    _Saving continuous integration credentials_  

1. Close the "Deployment credentials" blade by clicking the **"x"** in the top right corner of the blade to return to the Azure Bot Service editor.
 
    ![Closing the Deployment credentials blade](Images/portal-close-ci-blade.png)

    _Closing the Deployment credentials blade_  

1. In the "Continuous integration" panel, click **Set up integration source** to open the "Deployments" panel.
 
    ![Setting up an integration source](Images/portal-click-set-source.png)

    _Setting up an integration source_  

1. In the "Deployments" panel click **Setup**, and then **Choose Source**.
 
    ![Selecting an integration source](Images/portal-select-source.png)

    _Selecting an integration source_  

1. Select **Local Git Repository** as the deployment source, and then click **OK**. 
 
    ![Selecting Local Git Repository as the integration source](Images/portal-set-local-git.png)

    _Selecting Local Git Repository as the integration source_  

	Azure Bot Service continuous integration is now enabled and you can start working with a local copy of the bot code in Visual Studio Code.

	If you haven't installed Visual Studio Code, take a moment to do so now. You can download Visual Studio Code from http://code.visualstudio.com. You should also install [Node.js](https://nodejs.org) and [Git Client](https://git-scm.com/downloads), if it isn't already installed. All these products work cross-platform and can be installed on Windows, macOS, or Linux.

	> An easy way to determine whether Node.js is installed is to open a terminal window or Command Prompt window and execute a **node -v** command. If the Node.js version number is displayed, then Node.js is installed.

1. Open Visual Studio Code.
1. From the Visual Studio Code menu select **File** > **Open Folder**, and browse to the archive content extracted in Step 8, then select the **messages** folder and click **Open**.
 
    ![Opening a folder in Visual Studio Code](Images/vs-open-folder.png)

    _Opening a folder in Visual Studio Code_  

    ![Selecting the bot service code messages folder](Images/fe-select-messages-folder.png)

    _Selecting the bot service code messages folder_  

1. Click the **Git** button in the View Bar on the left side of Visual Studio Code, and then click **Initialize Git Repository**. This will initialize a Git repository for the bot project locally.

    ![Initializing the local Git repository](Images/vs-init-git-repo.png)

    _Initializing the local Git repository_  

1. Locate the Git commit label window and type in "First commit" in the message entry, and then click the **checkmark icon** to commit your initial project to your local repository. After a short delay, your bot code will be committed to the local Git repository.

    ![Committing bot code to the local Git repository](Images/vs-first-git-commit.png)

    _Committing bot code to the local Git repository_  

1. Still, in Visual Studio Code, select **View** > **Integrated Terminal**.

    ![Opening the Integrated Terminal](Images/vs-view-terminal.png)

    _Opening the Integrated Terminal_  

1. Execute the following command in the Integrated Terminal, replacing the values "[BOT_APP_NAME]" with the name of your bot service created in Exercise 1.

```
git remote add qnafactbot https://[BOT_APP_NAME].scm.azurewebsites.net:443/[BOT_APP_NAME].git
```

1. Select **View**  > **Command Palette** to open the VS Code command palette, and then type in "Git Pub" in the command palette and select **Git Publish**. 

    ![Opening the Command Palette](Images/vs-view-command-palette.png)

    _Opening the Command Palette_  

    ![Selecting Git: Publish from the Command Palette](Images/vs-select-git-publish.png)

    _Selecting Git: Publish from the Command Palette_  

1. If prompted to confirm publishing, review the dialog information and click **Publish**.

    ![Confirming Git publishing](Images/vs-confirm-publish.png)

    _Confirming Git publishing_ 

1. If prompted for credentials, enter the Continuous Integration **username** and **password** configured in Steps 3 and 4 of this exercise.

    ![Entering Continuous Integration credentials for Git publishing](Images/vs-enter-git-creds.png)

    _Entering Continuous Integration credentials for Git publishing_ 

	After a short delay, your bot code will be published to the Azure Bot Service via continuous integration. A visual indicator over the Git button in the View Bar will display a clock indicator while publishing is in progress.

    ![The Git publishing indicator](Images/vs-git-delay-icon.png)

    _The Git publishing indicator_ 

In this exercise, you created a local copy of your bot project and setup continuous integration to simplify publishing bot code changes to your Azure Bot Service via a local Git repository. Your initial bot code has been published to Azure and it's time to start seeing your bot in action by learning how to debug bots in Visual Studio Code.

<a name="Exercise5"></a>
## Exercise 5: Debug your bot ##

The Microsoft Bot Framework supports a number of mechanisms for debugging bots, including the [Bot Framework Emulator](https://emulator.botframework.com/). In this exercise, you will learn how to use Visual Studio code to debug bots by setting breakpoints and stepping through code, in a simplified guided bot experience before integrating your bot with the Microsoft QnA knowledge base created earlier in this lab.

Since most of the logic for a bot experience using a Microsoft QnA knowledge is encapsulated in the QnAMakerDialog object, it's  helpful to get a clear understanding of bot communication by debugging a simple "guided" bot experience first. To update your bot code to support a guided experience:

1. In Visual Studio Code, click the **Explorer** button in the View Bar to view the structure of your bot code.

    ![Selecting the Explorer](Images/vs-select-explorer.png)

    _Selecting the Explorer_ 

1. In the Explorer, select **index.js** to open it in the code editor. This file contains the code for bot interactions.

    ![Opening the index.js file](Images/vs-select-index-js.png)

    _Opening the index.js file_ 

1. Replace the entire contents of **index.js** with the following code:

	```JavaScript
	"use strict";
	var builder = require("botbuilder");
	var botbuilder_azure = require("botbuilder-azure");
	
	var useEmulator = (process.env.NODE_ENV == 'development');
	
	var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
	    appId: process.env['MicrosoftAppId'],
	    appPassword: process.env['MicrosoftAppPassword'],
	    stateEndpoint: process.env['BotStateEndpoint'],
	    openIdMetadata: process.env['BotOpenIdMetadata']
	});
	
	var bot = new builder.UniversalBot(connector);
	
	bot.dialog('/', [
	
	function (session) {
	    builder.Prompts.text(session, "Hello, and welcome to QnA Factbot! What's your name?");
	},
	
	function (session, results) {
	
	    session.userData.name = results.response;
	    builder.Prompts.number(session, "Hi " + results.response + ", how many years have you been writing code?"); 
	},
	
	function (session, results) {
	
	    session.userData.yearsCoding = results.response;
	    builder.Prompts.choice(session, "What language do you love the most?", ["C#", "JavaScript", "TypeScript", "Visual FoxPro"]);
	},
	
	function (session, results) {
	
	    session.userData.language = results.response.entity;   
	
	    session.send("Okay, " + session.userData.name + ", I think I've got it:" +
	                " You've been writing code for " + session.userData.yearsCoding + " years," +
	                " and prefer to use " + session.userData.language + ".");
	}]);
	
	if (useEmulator) {
	    var restify = require('restify');
	    var server = restify.createServer();
	    server.listen(3978, function() {
	        console.log('test bot endpoint at http://localhost:3978/api/messages');
	    });
	    server.post('/api/messages', connector.listen());    
	} else {
	    module.exports = { default: connector.listen() }
	}
	
	```

1. Observe the use of the Microsoft Bot Builder dialog prompts on **lines 19**, **25**, and **31**. Set a breakpoint on each of these lines by clicking the margin at the far left of the code window for each line.
 
    ![Adding breakpoints to index.js](Images/vs-add-breakpoints.png)

    _Adding breakpoints to index.js_ 

1. Click the **Debug** button in the View Bar on the left side of Visual Studio Code, and then click the **green arrow** at the top of the debugging panel to start a debugging session.
 
    ![Launching the VS Code debugger](Images/vs-launch-debugger.png)

    _Launching the VS Code debugger_ 

1. Observe the location of the bot debugging endpoint displayed in the Visual Studio Code **Debug Console**.
 
    ![The bot debugging endpoint](Images/vs-local-endpoint.png)

    _The bot debugging endpoint_ 

Your bot code is now running locally. An easy way to step through processes while debugging is to use the Microsoft Bot Framework Emulator.   

If you haven't installed the Microsoft Bot Framework Emulator, take a moment to do so now. You can download the Bot Framework Emulator from https://emulator.botframework.com/. 

1. Open the Bot Framework Emulator, if not already open from your initial installation.
1. Select the "Enter your endpoint URL" panel at the top of the emulator window and enter the following endpoint URL:

	```
	http://localhost:3978/api/messages
	```

1. Leave the Microsoft App ID and Microsoft App Password entries empty, and click **CONNECT**. The Bot Framework Emulator is now connected to your Visual Studio Code debugging session.
 
    ![Connecting the Bot Framwork Emulator](Images/emulator-connect.png)

    _Connecting the Bot Framwork Emulator_ 

1. Observe log entries being created in the emulator "Log" panel.
 
    ![Newly created emulator log entries](Images/emulator-log-entries.png)

    _Newly created emulator log entries_ 

1. Type in "hi" (without quotation marks) in the "Type your message..." entry at the bottom of the emulator chat window and press **Enter** on your keyboard. The Visual Studio Code editor will now become active and positioned on the breakpoint at line 19 of your bot code. 
 
    ![Entering a default phrase in the Bot Framwork Emulator Chat window](Images/emulator-step-01.png)

    _Entering a default phrase in the Bot Framwork Emulator Chat window_
 
    ![The VS Code debugger positioned at line 19](Images/vs-stop-breakpoint-01.png)

    _The VS Code debugger positioned at line 19_ 

1. Click the **Continue** button in the Visual Studio Code debugging toolbar and return to the emulator to observe the bot response.
 
    ![Continuing through a breakpoint](Images/vs-click-continue.png)

    _Continuing through a breakpoint_ 

1. Continue through the guided bot conversation, answering each question, and observing the debugging interaction at each step through the conversation, as well as the ability to view user communication by hovering over values in the code editor.
 
    ![Viewing the value of session.userData.name property in a debugging session](Images/vs-debug-watch.png)

    _Viewing the value of session.userData.name property in a debugging session_ 
 
    ![A guided bot conversation](Images/emulator-complete-convo.png)

    _A guided bot conversation_ 

At this point, you have a fully functioning bot and are familiar with setting breakpoints and debugging bot code. Now that you see how easy it is to walk through and debug bot communication processes using a simple guided conversation, the next step is to update your bot code to communicate with the Microsoft QnA knowledge base populated in Exercise 3.

<a name="Exercise6"></a>
## Exercise 6: Update your bot ##

In this exercise, you will update your code and bot configuration to access the Microsoft QnA knowledge base populated earlier in this lab.

1. In Visual Studio Code, click the **Explorer** button in the View Bar to view the structure of your bot code.
1. In the Explorer, if not already open in the code editor, select **index.js** to open it.
 
    ![Opening index.js again in the Explorer](Images/vs-reopen-index-js.png)

    _Opening index.js again in the Explorer_ 

1. Click the **Debug** button in the View Bar on the left side of Visual Studio Code.
1. Locate the **BREAKPOINTS** pane, then right-click any where over the pane and select **Remove All Breakpoints**.

    ![Removing all the active breakpoints](Images/vs-remove-breakpoints.png)

    _Removing all the active breakpoints_ 

1. In **index.js**, replace the entire contents of the file with the following code:

	```JavaScript
	// For more information about this template visit http://aka.ms/azurebots-node-qnamaker
	
	"use strict";
	var builder = require("botbuilder");
	var botbuilder_azure = require("botbuilder-azure");
	var builder_cognitiveservices = require("botbuilder-cognitiveservices");
	
	var useEmulator = (process.env.NODE_ENV == 'development');
	
	var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
	    appId: process.env['MicrosoftAppId'],
	    appPassword: process.env['MicrosoftAppPassword'],
	    stateEndpoint: process.env['BotStateEndpoint'],
	    openIdMetadata: process.env['BotOpenIdMetadata']
	});
	
	var bot = new builder.UniversalBot(connector);
	
	var recognizer = new builder_cognitiveservices.QnAMakerRecognizer({
	                knowledgeBaseId: process.env.QnAKnowledgebaseId, 
	    subscriptionKey: process.env.QnASubscriptionKey});
	
	var basicQnAMakerDialog = new builder_cognitiveservices.QnAMakerDialog({
	    recognizers: [recognizer],
	                defaultMessage: 'No match! Try changing the query terms!',
	                qnaThreshold: 0.3}
	);
	
	
	bot.dialog('/', basicQnAMakerDialog);
	
	if (useEmulator) {
	    var restify = require('restify');
	    var server = restify.createServer();
	    server.listen(3978, function() {
	        console.log('test bot endpoint at http://localhost:3978/api/messages');
	    });
	    server.post('/api/messages', connector.listen());    
	} else {
	    module.exports = { default: connector.listen() }
	}
	```

1. Observe the use of the **QnAMakerDialog** on line 23. This dialog is part of the Microsoft Bot Framework for use when creating bots that use Microsoft QnA knowledge bases.
 
    ![The Bot Framework QnAMakerDialog](Images/vs-using-qnamaker.png)

    _The Bot Framework QnAMakerDialog_ 

1. Set a breakpoint on **line 23** by clicking the margin at the far left of the code window for this line.
1. Click the **Debug** button in the View Bar on the left side of Visual Studio Code, and then click the **green arrow** at the top of the debugging panel to start a debugging session.
 
    ![Launching the VS Code debugger](Images/vs-launch-debugger.png)

    _Launching the VS Code debugger_ 

1. Locate the "DEBUG CONSOLE" input pane, and type in the following code, and then press **Enter** on your keyboard:

	```
	process.env.QnAKnowledgebaseId
	```

1.  Observe the value of "process.env.QnAKnowledgebaseId" is set to an "empty" string.
 
    ![Querying process.env.QnAKnowledgebaseId in the Debug Console](Images/vs-config-no-value.png)

    _Querying process.env.QnAKnowledgebaseId in the Debug Console_ 

In order to connect the bot to the QnA knowledge base created in Exercise 1, we need to update the bot configuration file to include both the "QnAKnowledgebaseId" and "QnASubscriptionKey" generated by the Azure Bot Service.

To update the bot configuration with QnA knowledge base information:

1. In Visual Studio Code, click the **Explorer** button in the View Bar to view the structure of your bot code.
1. In the Explorer, select **.vscode** > **launch.json** to open it, and observe the empty string values for both "QnAKnowledgebaseId" and "QnASubscriptionKey" in the "configurations" section. These values need to be populated from the Azure Bot Service Application Settings.
 
    ![Opening launch.json in the Explorer](Images/vs-launch-file.png)

    _Opening launch.json in the Explorer_ 

1. Open the Azure Portal dashboard (if it’s not already open from Exercise 1) and click the **“hamburger”** icon to open the side drawer menu.
1. Click **Resource Groups** followed by **BotsResourceGroup**.
1. Select the **Overview** tab.
1. Click **qnafactbot** (or the name you used to create the Azure Bot Service in Exercise 1, Step 3) to open the Azure Bot Service editor for the bot.

    ![Opening the bot service](Images/portal-click-bot-service.png)

    _Opening the bot service_
 
1. Select the **Settings** tab in the Bot Service editor. 

    ![Selecting the Settings tab](Images/portal-select-settings.png)

    _Selecting the Settings tab_
 
1. Locate the "Application Settings" panel and click **Open** to open the Azure Bot Service App Settings blade.

    ![Opening the Azure Bot Service Application Settings](Images/portal-open-app-settings.png)

    _Opening the Azure Bot Service Application Settings_
 
1. Locate the "App Settings" panel and, with your mouse cursor, highlight the value to the right of the "QnAKnowledgebaseId" key and copy it to the clipboard.

    ![Copying the QnAKnowledgebaseId value](Images/portal-app-setting-01.png)

    _Copying the QnAKnowledgebaseId value_ 
 
1. Return to Visual Studio Code and paste this value between the quotation marks for the setting named **QnAKnowledgebaseId**.

    ![The updated QnAKnowledgebaseId value](Images/vs-updated-key-01.png)

    _The updated QnAKnowledgebaseId value_ 

1. In a browser, return to the "App Settings" panel of the "Application Settings" blade and, with your mouse cursor, highlight the value to the right of the "QnASubscriptionKey" key and copy it to the clipboard.

    ![Copying the QnASubscriptionKey value](Images/portal-app-setting-02.png)

    _Copying the QnASubscriptionKey value_
 
1. Return to Visual Studio Code and paste this value between the quotation marks for the setting named **QnASubscriptionKey**.

    ![The updated QnASubscriptionKey value](Images/vs-updated-key-02.png)

    _The updated QnASubscriptionKey value_ 

1. One more time, click the **Debug** button in the View Bar on the left side of Visual Studio Code, and then click the **green arrow** at the top of the debugging panel to start a debugging session.
1. Locate the "DEBUG CONSOLE" input pane, and type in the following code, and then press **Enter** on your keyboard:

	```
	process.env.QnAKnowledgebaseId
	```

1. Observe the value of "process.env.QnAKnowledgebaseId" is now set to an appropriate value.
1. Locate the **BREAKPOINTS** pane, and then hover your mouse cursor over the heading to display the panel action bar. and click the **Remove All Breakpoints** icon.

    ![Removing breakpoints via the action bar](Images/vs-remove-breakpoint.png)

    _Removing breakpoints via the action bar_ 

1. Click the **Debug** button in the View Bar on the left side of Visual Studio Code, and then click the **green arrow** at the top of the debugging panel to start a debugging session.
1. Open the Bot Framework Emulator, if not already open from the previous exercise.
1. If necessary, select the "Enter your endpoint URL" panel at the top of the emulator window one more time and enter the following endpoint URL:

	```
	http://localhost:3978/api/messages
	```

1. Remember to leave the Microsoft App ID and Microsoft App Password entries empty, and click **CONNECT**. The Bot Framework Emulator is now re-connected to your Visual Studio Code debugging session.
1. In the emulator, click the **Refresh** icon to start a new conversation.

    ![Starting a new conversation in the emulator](Images/emulator-start-new.png)

    _Starting a new conversation in the emulator_

1. Type in "What's the most popular software programming language in the world?" (without quotation marks) in the "Type your message..." entry at the bottom of the emulator chat window and press **Enter** on your keyboard.

    ![Bot interaction using QnA knowledge base integration](Images/emulator-step-02.png)

    _Bot interaction using QnA knowledge base integration_

1. Observe the responses are now based on the QnA knowledge base populated in Exercise 3. Feel free to ask the bot additional questions to validate QnA dialog responses.  

    ![Additonal interaction using QnA knowledge base integration](Images/emulator-step-03.png)

    _Additonal interaction using QnA knowledge base integration_

1. Select **View**  > **Command Palette** to open the VS Code command palette, and then type in "Git Sy" in the command palette and select **Git Sync**. 

	![Selecting Git: Sync from the Command Palette](Images/vs-select-git-sync.png)

    _Selecting Git: Sync from the Command Palette_  

1. If Visual Studio Code prompts with a Git synchronization warning, click **OK**.

	![The Git synchronization warning](Images/vs-git-warning.png)

    _The Git synchronization warning_  

1. After a short delay your bot code and configuration changes will be published to the Azure Bot Service.

Now that your bot has been written, updated, and tested, the final step is to test it in a connected channel.

<a name="Exercise7"></a>
## Exercise 7: Test the bot ##

Once deployed, bots can be connected to channels such as Skype, Slack, Microsoft Teams, and Facebook Messenger, where you can interact with them the way you would interact with any other user. In this exercise, you will test your bot with Skype. If Skype isn't already installed on your computer, please install it now. You can download Skype for Windows, macOS, and Linux from https://www.skype.com/en/download-skype/skype-for-computer/.

1. Open the Azure Portal dashboard (if it’s not already open from the previous exercise) and click the **“hamburger”** icon to open the side drawer menu.
1. Click **Resource Groups** followed by **BotsResourceGroup**.
1. Select the **Overview** tab.
1. Click **qnafactbot** (or the name you used to create the Azure Bot Service in Exercise 1, Step 2) to open the Azure Bot Service editor for the bot.

    ![Opening the bot service](Images/portal-click-bot-service.png)

    _Opening the bot service_
 
1. Select the **Channels** tab in the Bot Service editor. 

    ![The Bot Service Channels tab](Images/portal-bot-channel-tab.png)

    _The Bot Service Channels tab_
 
1. Locate the "Channels" panel and click **Edit** in the row for the Skype channel.

    ![Editing the Bot Service Skype channel](Images/portal-edit-skype.png)

    _Editing the Bot Service Skype channel_
 
1. Ensure that **Enable QnAFactbot on Skype** is toggled ON and click **I’m done configuring** at the bottom of the page. Your bot is now ready to test in a Skype conversation.

    ![Ensuring Bot Service Skype integration](Images/portal-enable-skype.png)

    _Ensuring Bot Service Skype integration_
 
1. Click the **Add to Skype** button.
 
    ![Adding QnA Factbot to Skype](Images/portal-click-add-to-skype.png)

    _Adding QnA Factbot to Skype_
 
1.  Click **Add to Contacts** to add the bot as a Skype contact. After a short delay, Skype will launch and display a new conversation thread between you and the bot. 
  
	> If Skype does not automatically add QnA Factbot to a conversation, select the bot from the "Recent" list in Skype to initiate a conversation manually. 
	
    ![Adding QnA Factbot to your Skype contacts](Images/skype-add-to-contacts.png)

    _Adding QnA Factbot to your Skype contacts_
	
1. Start a conversation with the QnA Factbot by typing "hi" into the Skype window. After a short delay, the bot will display a welcome message and you can start a question and answer process using the information available in your QnA knowledge base!   	
 
    ![Using the QnA Factbot in Skype](Images/skype-responses.png)

    _Using the QnA Factbot in Skype_

You now have a fully functioning bot, created with the Microsoft Bot Framework, available for anyone in the world to use. You may have noticed there are many other channels to choose from as well. Feel free to plug your bot into other channels and test it in different scenarios. 

<a name="Summary"></a>
## Summary ##

In this hands-on lab you learned how to:

- Create an Azure Bot Service to register and host a bot
- Create a Microsoft QnA Service to populate a knowledge base
- Setup continuous code integration to publish bot code
- Debug the bots that you build
- Update your bot using Visual Studio Code, Node.js, and JavaScript- 
- Interact with a bot using Skype

There is much more that you can do to leverage the power of the Microsoft Bot Framework by incorporating [dialogs](http://aihelpwebsite.com/Blog/EntryId/9/Introduction-To-Using-Dialogs-With-The-Microsoft-Bot-Framework), [FormFlow](https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/07/14/building-a-microsoft-bot-using-microsoft-bot-framework-using-formflow/), and [Microsoft Language Understanding and Intelligence Services (LUIS)](https://docs.botframework.com/en-us/node/builder/guides/understanding-natural-language/). With these and other features, you can build sophisticated bots that respond to users' queries and commands and interact in a fluid, conversational, and non-linear manner. For more information, see https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/04/05/what-is-microsoft-bot-framework-overview/.

----

Copyright 2016 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.