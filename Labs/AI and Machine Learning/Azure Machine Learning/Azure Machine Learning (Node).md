<a name="HOLTitle"></a>
# Building Smart Apps with Azure Machine Learning Studio #

Machine learning, which facilitates predictive analytics using large volumes of data by employing algorithms that iteratively learn from that data, is one of the fastest growing areas of computer science. Its uses range from credit-card fraud detection and self-driving cars to optical character recognition (OCR) and online shopping recommendations. It makes us smarter by making computers smarter. And its usefulness will only increase as more and more data becomes available and the desire to perform predictive analysis from that data grows, too.

[Azure Machine Learning Studio](https://azure.microsoft.com/en-us/services/machine-learning/) is a cloud-based predictive-analytics service that offers a streamlined experience for data scientists of all skill levels. It features an easy to use, drag-and-drop interface for building machine-learning models. It comes with a library of time-saving experiments and features best-in-class algorithms developed and tested in the real world by Microsoft businesses such as Bing. And its built-in support for [R](https://www.r-project.org/) and [Python](https://www.python.org/) means you can build custom scripts  to customize your model. Once you've built and trained your model, you can easily expose it as a Web service that is consumable from a variety of programming languages, or share it with the community by placing it in the [Cortana Intelligence Gallery](https://gallery.cortanaintelligence.com/).

In this lab, you will use Azure Machine Learning Studio to build, train, and score a model that recognizes hand-written numeric digits. You will use a real OCR data set published for academic research. After deploying the model as a Web service, you will write an [Electron](http://electron.atom.io/) client for it that lets you sketch digits on the screen and then consult Azure Machine Learning to see if it can identify the digits you sketched. You will learn how to build and train a model, as well as how to write code that leverages the model.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Build, train, and score a model using Azure Machine Learning Studio
- Deploy your model as a Web service so it can be accessed from code or scripts
- Call an ML Web service from the apps that you write

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](http://aka.ms/WATK-FreeTrial).
- [Visual Studio Code](http://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/)

<a name="Resources"></a>
### Resources ###

[Click here](https://a4r.blob.core.windows.net/public/cs-machine-learning-resources.zip) to download a zip file containing the resources used in this lab. Copy the contents of the zip file into a folder on your hard disk.

<a name="Cost"></a>
### Cost ###

![](Images/cost-2.png)

The cost of this lab is **moderate**. For an overview of cost ratings, refer to [Explanation of Costs](../../Costs.md).

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create a Machine Learning experiment](#Exercise1)
- [Exercise 2: Upload a dataset](#Exercise2)
- [Exercise 3: Train a classification model](#Exercise3)
- [Exercise 4: Score the model](#Exercise4)
- [Exercise 5: Deploy the model as a Web service](#Exercise5)
- [Exercise 6: Build an Electron client](#Exercise6)
- [Exercise 7: Test the model](#Exercise7)

Estimated time to complete this lab: **60** minutes.

<a name="Exercise1"></a>
## Exercise1: Create a Machine Learning experiment

The first step in employing Azure Machine Learning Studio is to create a Machine Learning Studio workspace and an experiment to go in it. In this exercise, you'll get a machine-learning experiment up and running in Azure Machine Learning Studio.

1. Open the [Azure Portal](https://portal.azure.com) in your browser. If asked to log in, do so using your Microsoft account.

1. Click **+ Create a resource**. Then type "machine learning" (without quotation marks) into the search box and select **Machine Learning Studio Workspace** from the search results.

    ![Creating a workspace](Images/new-ml-workspace-1.png)

    _Creating a workspace_

1. Click the **Create** button at the bottom of the "Machine Learning Studio Workspace" blade.

    ![Creating a workspace](Images/new-ml-workspace-3.png)

    _Creating a workspace_

1. In the "Machine Learning Studio workspace" blade, enter a workspace name such as "AzureLabs" and make sure a green check mark appears next to it. Select **Create new** under **Resource group** and enter a resource-group name such as "MachineLearningResourceGroup." Select the location nearest you under **Location**. Then enter a storage-account name, making it as unique as possible, and make sure a green check mark appears next to it, too.

	> Storage-account names can be 3 to 24 characters in length, can only contain numbers and lowercase letters, and must be unique within Azure. A green check mark next to the name indicates that it meets all these criteria.

	Now click **Web service plan pricing tier** and select **S1 Standard** in the "Choose your pricing tier blade." Finish up by clicking **Select** at the bottom of that blade, and clicking **Create** at the bottom of the "Machine Learning Studio workspace" blade.

    ![Creating a workspace](Images/new-ml-workspace-4.png)

    _Creating a workspace_

1. Click **Resource groups** in the ribbon on the left side of the portal, and then click the resource group created for the Machine Learning Studio workspace.

    ![Opening the resource group](Images/open-resource-group.png)

    _Opening the resource group_

1. Wait until "Deploying" changes to "Succeeded," indicating that the workspace has been created. (You can click **Refresh** at the top of the blade to refresh the deployment status.) Then click the Machine Learning Studio workspace in the resource group.

    ![Opening the workspace](Images/open-workspace.png)

    _Opening the workspace_

1. Click **Launch Machine Learning Studio**.

    ![Launching ML Studio](Images/launch-ml-studio.png)

    _Launching ML Studio_

1. Click **Sign In** to sign in to Machine Learning Studio with your Microsoft account.

    ![Signing in to ML Studio](Images/sign-in.png)

    _Signing in to ML Studio_

1. In Machine Learning Studio, click **+ NEW** in the lower-left corner. Then start a new experiment by clicking **Blank Experiment**.

    ![Creating a blank experiment](Images/create-blank-experiment.png)

    _Creating a blank experiment_

1. Click the experiment title at the top of the page ("Experiment created on...") and type a new experiment name such as "Digit Recognition."

    ![Renaming the experiment](Images/new-experiment-title.png)

    _Renaming the experiment_

Now that the experiment has been created, the next step is to import some data and build a model around it.

<a name="Exercise2"></a>
## Exercise 2: Upload a dataset

Azure Machine Learning Studio comes with several sample datasets. Additional datasets are available from a variety of sources, including [Data.gov](http://www.data.gov/), [Kaggle](http://www.kaggle.com/), and the University of California Irvine's [Machine Learning Repository](http://archive.ics.uci.edu/ml/). In this exercise, you will upload a public dataset containing data generated by scanning and digitizing handwritten digits (0 through 9) from a sample of 43 people. You will later use the dataset to train an ML model that can recognize handwritten digits with a high degree of accuracy.

1. Click **+ NEW** in the lower-left corner of ML Studio. Then click **DATASET**, followed by **FROM LOCAL FILE**.

    ![Creating a new dataset](Images/new-dataset.png)

    _Creating a new dataset_

1. Click the **Browse** button. Select the file named **digit-recognition.csv** from the [resources that accompany this lab](https://a4r.blob.core.windows.net/public/cs-machine-learning-resources.zip). Make sure **Generic CSV File with a header (.csv)** is selected under **SELECT A TYPE FOR THE NEW DATASET**. Optionally enter a friendly name for the dataset in the **ENTER A NAME FOR THE NEW DATASET** box, and then click the check mark in the lower-right corner to begin uploading the dataset.

    ![Uploading the dataset](Images/upload-dataset.png)

    _Uploading the dataset_

1. Wait for the upload to finish. Then go to the modules palette on the left and find the dataset you just uploaded under **Saved Datasets** -> **My Datasets**.

    ![The uploaded dataset](Images/select-dataset.png)

    _The uploaded dataset_

1. Drag the dataset from the modules palette and drop it onto the canvas (the gray area to the right).

    ![Adding the dataset to the model](Images/add-dataset.png)

    _Adding the dataset to the model_

1. To see what this dataset looks like, click the output port (the circle with the "1" in it) at the bottom of the dataset and select **Visualize**.

    ![Visualizing the dataset](Images/visualize-dataset.png)

    _Visualizing the dataset_

1. The variables, or "features," in the dataset appear as columns, with each row representing a digit from 0 to 9. The dataset contains 3,823 rows and 65 columns. The first 64 columns contain values from 0 to 16 representing 4x4 blocks of pixels. Each digit represented in the dataset was scanned into a 32x32 array, yielding a total of 1,024 pixels per digit. Each scan is represented in the dataset by 64 values, each representing 16 pixels. 

    ![The Digit Recognition dataset](Images/raw-dataset.png)

    _The Digit Recognition dataset_

1. Scroll all the way to the right until you see the final column — the one named "digit." Each value in this column is the digit that corresponds to the pixel data in the same row. THIS is the target value that your model will predict given values for the other 64 columns.

    ![The target variable](Images/digit-column.png)

    _The target variable_

Close the visualization window by clicking the "**x**" in the upper-right corner. The data is loaded. Now it's time to do something with it.

<a name="Exercise3"></a>
## Exercise 3: Train a classification model

In this exercise, you will use ML Studio's drag-and-drop user interface to train an ML model. *Training* involves picking a machine-learning algorithm and feeding data into the model. During training, the computer looks for patterns in the data that it can use to predict values from future inputs.

There are several types of machine-learning models. One of the most common is the regression model, which uses one of a number of regression algorithms to produce a numeric value — for example, a person's age or the probability that a credit-card transaction is fraudulent. You will be training a classification model, which seeks to resolve a set of inputs into one of a set of known outputs. A classic example of a classification model is one that examines e-mails and classifies them as "spam" or "not spam." Your model will examine a set of inputs representing pixel patterns and attempt to classify each as a digit from 0 to 9, inclusive.

1. At the top of the modules palette, type "metadata" (without quotation marks) into the search box to find the [Edit Metadata](https://msdn.microsoft.com/en-us/library/azure/dn905986.aspx) module.

    ![Finding the Edit Metadata module](Images/find-metadata-editor.png)

    _Finding the Edit Metadata module_

1. Drag the module to the experiment canvas and drop it underneath the dataset. Then connect the output port of the dataset to the input port of the Edit Metadata module by dragging an arrow downward from the output port. Among other things, the Edit Metadata module allows you to specify data types for the columns in the dataset.

    ![Adding an Edit Metadata module](Images/metadata-editor.png)

    _Adding an Edit Metadata module_

     > A key concept to understand in Azure ML Studio is that of ports and connectors. In this step, you connected the output port of the dataset to the input port of the Edit Metadata module. The data flows from one module to the next through the connector. Some modules support multiple inputs and outputs and therefore have multiple input and output ports. If you want to know what a port does, hover over it with the mouse and a tooltip will pop up. If you want more information, right-click on the module and select **Help** from the popup menu.

1. Click the Edit Metadata module to select it. (When selected, it has a bold blue border.) Then click the **Launch column selector** button in the Properties pane on the right.

    ![Launching the column selector](Images/launch-column-selector-1.png)

    _Launching the column selector_

1. Scroll to the bottom of the **AVAILABLE COLUMNS** list and click **digit**. Then click the **>** button to move **digit** into the **SELECTED COLUMNS** list. Recall that **digit** is the value your model will predict. Finish up by clicking the check mark in the lower-right corner of the window.

    ![Selecting the digit column](Images/select-digit-column.png)

    _Selecting the digit column_

1. In the Properties pane, select **Make Categorial** from the drop-down list named **Categorical**. This tells the model that values in the **digit** column should be treated as discrete (as opposed to numeric values, which could take on values such as 7.5 and 8.6).

    ![Making the digit column categorical](Images/make-categorical.png)

    _Making the digit column categorical_

1. Click the **SAVE** button at the bottom of the page to save the experiment.

    ![Saving the experiment](Images/save-button.png)

    _Saving the experiment_

	> When working with the Azure Machine Learning Studio, get in the habit of saving your experiments often, particularly before you run a model. That way, if you encounter a problem, you will not have to redo your work. Also, be aware that you **may lose your work if you click the browser's Back button without saving your experiment first.**

1. Type "split" (without quotation marks) into the search box at the top of the modules palette. Then drag a [Split Data](https://msdn.microsoft.com/en-us/library/azure/dn905969.aspx) module onto the canvas and connect the output port from the Edit Metadata module to the input port of the Split Data module. The purpose of the Split Data module is to split a dataset into two parts: one for training and one for scoring. It's useful when you don't have separate datasets for training and scoring.

    ![Adding a Split Data module](Images/add-split-data.png)

    _Adding a Split Data module_

1. Make sure the Split Data module is selected. Then go to the Properties pane on the right and set the split to 0.8. You will use 80% of the rows to train the model, and the remaining 20% to score it. Also make sure that the **Randomized split** box is checked. This is particularly important when you are splitting data that is ordered.

    ![Setting the split percentage](Images/setting-split-percentage.png)

    _Setting the split percentage_

1. Click the **SAVE** button at the bottom of the page to save the experiment.

1. Click the **RUN** button at the bottom of the page to run the experiment.

1. Next, type "train model" (without quotation marks) into the search box at the top of the modules palette. Find the [Train Model](https://msdn.microsoft.com/en-us/library/azure/dn906044.aspx) module and drag it onto the canvas. Connect the left output from the Split Data module to the right input of the Train Model module.

    ![Adding a Train Model module](Images/add-train-model.png)

    _Adding a Train Model module_

1. The next step is a crucial one. In it, you will identify for the Train Model module which value you want it to predict. Select the Train Model module, and then click **Launch column selector** in the Properties pane.

    ![Launching the column selector](Images/launch-column-selector-2.png)

    _Launching the column selector_

1. Type in "digit" (without quotation marks) to select the **digit** column. This is the value that your model is going to predict. Finish up by clicking the check mark in the lower-right corner.

    ![Specifying the target value](Images/specify-target-value.png)

    _Specifying the target value_

1. Now it's time to select a learning algorithm. Azure Machine Learning offers several kinds of classification and regression algorithms for you to choose from, as well as algorithms of other types. Each is represented by a module in the modules palette. You can always code your own algorithms in R or Python as well. Your model will employ an algorithm known as "Multiclass Logistic Regression." It's a classification algorithm that employs logistic regression, which is frequently used in statistics to predict the probability of an outcome.

	> The Azure Machine Learning team has put together a "cheat sheet" to help you decide which algorithm to choose based on the intended purpose of your model. You can download it from [here](http://download.microsoft.com/download/A/6/1/A613E11E-8F9C-424A-B99D-65344785C288/microsoft-machine-learning-algorithm-cheat-sheet-v6.pdf).

	Type "multiclass" (without quotation marks) into the search box at the top of the modules palette. Find the [Multiclass Logistic Regression](https://msdn.microsoft.com/en-us/library/azure/dn905853.aspx) module and drag it onto the canvas. Then connect the output from the Multiclass Logistic Regression module to the left input of the Train Model module, as shown below.

    ![Specifying the learning algorithm](Images/add-algorithm.png)

    _Specifying the learning algorithm_

1. Click the **SAVE** button to save the experiment.

1. Click the **RUN** button to run the model. Wait until green check marks appear in all the modules indicating that they ran successfully.

1. If you would like to see how influential each of the input variables was in computing an output, right-click the output port of the Train Model module and select **Visualize**. You'll see a list of all the features (columns) in the model and the weights assigned to them.

The model has been trained. But how accurate is it in predicting values? That's where scoring comes in.

<a name="Exercise4"></a>
## Exercise 4: Score the model

In this exercise, you will score the model you trained in the previous exercise. *Scoring* determines how well the model was trained — that is, how adept it is at predicting target values from variables presented to it. ML Studio makes the scoring process very easy. You used 80% of the dataset that you uploaded to train the model. You will use the remaining 20% to score it.

1. Add a [Score Model](https://msdn.microsoft.com/en-us/library/azure/dn905995.aspx) module to the canvas. Connect the output of the Train Model module to the Score Model module's left input port. Then connect the right output port of the Split Data module to the right input port of the Score Model module. That connection represents the 20% of the data that was not used for training.

    ![Adding the Score Model module](Images/add-score-model.png)

    _Adding the Score Model module_

1. Click the **SAVE** button to save the experiment.

1. Click the **RUN** button to run the experiment.

1. After the run finishes, right-click the output port of the Score Model module and select **Visualize**. Scroll to the right. In the column labeled "digit," you see actual values from the 20% of the dataset passed to the Score Model module. The next ten columns — "Scored Probabilities for Class X" — indicate how the model scored the ten possible outputs (the digits 0 through 9) using the inputs on the left. The higher the number, the greater the likelihood of a match. The final column — "Scored Labels" — indicates which digit the model predicted from the inputs, which is the digit scored with the highest probability. By comparing values in the "digit" column to values under "Scored Labels," you can assess the accuracy of the model. A cursory examination reveals that the model gets it right the vast majority of the time.

    ![The scored dataset](Images/scored-dataset.png)

    _The scored dataset_

1. Close the visualization window by clicking the "**x**" in the upper-right corner.

1. To evaluate the quality of the results without having to compare hundreds of values manually, add an [Evaluate Model](https://msdn.microsoft.com/en-us/library/azure/dn905915.aspx) module to the experiment canvas. Connect the output port of the Score Model module to the left input port of the output of the Evaluate Model module. (There are two input ports because Evaluate Model can be used to compare two models.)

    ![Adding the Evaluate Model module](Images/add-evaluate-model.png)

    _Adding the Evaluate Model module_

1. Click **Save** to save the experiment. Then run the experiment again by clicking the **RUN** button.

1. Click the output port of the Evaluate Model module and select **Visualize** from the menu. From the **Overall accuracy** and **Average accuracy** numbers, you can see that the model performs very well. Given a digitized scan of a handwritten digit, it can correctly identify the digit more than 97% of the time.

    ![The evaluation results](Images/visualize-evaluate-model.png)

    _The evaluation results_

1. Close the visualization window by clicking the "**x**" in the upper-right corner.

Now that the model is built and tested, it's time to put it to work. The ultimate goal is to write an app that runs on a PC or mobile device and calls up to the cloud and runs the model. To facilitate that, you need to deploy the model as a Web service.

<a name="Exercise5"></a>
## Exercise 5: Deploy the model as a Web service

Once you have a trained and scored model, you can deploy it as a Web service and interact with it programmatically. Before deploying as a Web service, you need to streamline your experiment. This involves creating a new experiment from your trained model, removing unnecessary modules, and adding Web-service input and output modules. Fortunately, ML Studio can do all of this for you.

1. Click the **RUN** button to run your model again.

1. At the bottom of the screen, click the **SET UP WEB SERVICE** button and in the ensuing menu, select **Predictive Web Service [Recommended]**. If this option is grayed out, click the **RUN** button and try again.

    ![Creating a predictive Web service](Images/deploy-predict-button.png)

    _Creating a predictive Web service_

1. ML Studio will spin for a few seconds, after which a predictive experiment will appear. Observe that Split Data and Train Model are gone, and that 100% of the training data now flows into Score Model. In addition, new modules were added at the top and bottom for Web-service input and output.

	> Don't be alarmed thinking your original model is gone. It's still there. You can get to it by clicking the **Training experiment** tab at the top of the page.

    ![The predictive experiment](Images/predictive-experiment.png)

    _The predictive experiment_

1. To create a Web service that you can call to perform predictive analytics, click **RUN** once more. After the run completes, click the **DEPLOY WEB SERVICE** button to deploy the Web service.

    ![Deploying the Web service](Images/deploy-web-service.png)

    _Deploying the Web service_
 
1. In a moment, the dashboard for the new Web service will appear. The dashboard includes a **Test** button that you can click to test the Web service (not very practical here, because you'd have to enter 64 values from 0 to 16 representing pixel patterns). It also includes an API key that apps can use to make authenticated calls to the service. You will use this API key in the next exercise.

	For convenience, click the button to the right of the API key to copy the key to the clipboard, and then paste it into a text editor so you can easily retrieve it later.

    ![Copying the API key](Images/web-service-dashboard-1.png)

    _Copying the API key_

1. Now click **REQUEST/RESPONSE** to see useful information about calling the Web service over HTTPS using [REST](https://en.wikipedia.org/wiki/Representational_state_transfer).

    ![Viewing Request/Response information](Images/web-service-dashboard-2.png)

    _Viewing Request/Response information_

1. This page offers documentation that's useful to programmers who want to write apps that consume the Web service, including:

	- How HTTPS requests are formatted
	- How HTTPS responses are formatted
	- Input and output parameters
	- Sample code demonstrating how to call the Web service

	Scroll to the bottom of the page and you'll see the sample code. It's available in three languages: C#, Python, and R. Make sure **C#** is selected, and then scroll down until you see the statement that assigns the Web service's URL to client.BaseAddress. Copy this URL to the clipboard and paste it into a text editor so you can retrieve it in the next exercise. You're going to write code similar to this to call the Web service. And to do so, you'll need the URL.

    ![The Web service URL](Images/sample-code.png)

    _The Web service URL_

A common question regarding Azure ML Web services is: how much do they cost? You can find the current pricing information in the [Machine Learning Pricing](https://azure.microsoft.com/en-us/pricing/details/machine-learning/) page.

<a name="Exercise6"></a>
## Exercise 6: Build an Electron client

The whole reason for deploying an Azure ML model as a Web service is so you can build smart apps that utilize the model. There are a variety of ways to build such apps. You could call the service from a Web app using JavaScript and AJAX, for example, or you could use [NativeScript](https://www.nativescript.org/) to write an app that runs on iOS or Android and places calls to the service using HTTP requests.

In this exercise, you will write a cross-platform client app using [Node.js](https://nodejs.org) and [Electron](http://electron.atom.io/). The beauty of such apps is that they run on Windows, Mac, or Linux machines. The app you will write enables you to draw digits into an onscreen grid. Then it calls your ML Web service and tells you what digit you drew.

1. Create a new directory to serve as your project directory.

1. Open a terminal or Command Prompt window and navigate to the directory you created in the previous step to make it the current directory.

1. Execute the following command to verify that you have Node.js version 4 or higher installed. (If Node is installed, you will see the version number.) If Node is not installed or the version is less than 4, go to https://nodejs.org and install the latest stable version.
 
    ```
    node --version
    ```

1. Use the following command to create a new Node.js project.
 
    ```
    npm init -y
    ```

    This will create an empty **package.json** file in the current directory.

	> Node.js uses a package manager, called **npm**, to add additional components to Node.js applications. These additional components are dependencies of your application and are defined in the **package.json** file. Some dependencies are just needed when building the application, but others are required to actually run it. You will use several dependencies in your Electron application.
       
1. In the Command Prompt or terminal window, execute the following command (note the space and the period at the end of the command) to start Visual Studio Code in the current directory:

    ```
	code .
    ```

1. In Visual Studio Code, select the **Explorer** command from the **View** menu to make sure the Explorer panel is displayed. Then click **Package.json** to open the file for editing.

    ![Opening package.json](Images/node-open-package-json.png)

    _Opening package.json_
    
1. Add the ```dependencies``` and ```devDependencies``` properties shown below to **package.json** after the ```scripts``` property that is already there.
               
    ```json
	"dependencies": {
	  "@angular/common": "2.0.0",
	  "@angular/compiler": "2.0.0",
	  "@angular/core": "2.0.0",
	  "@angular/forms": "2.0.0",
	  "@angular/http": "2.0.0",
	  "@angular/platform-browser": "2.0.0",
	  "@angular/platform-browser-dynamic": "2.0.0",
	  "@types/core-js": "0.9.34",
	  "@types/jasmine": "2.2.34",
	  "@types/node": "6.0.41",
	  "core-js": "2.4.1",
	  "reflect-metadata": "0.1.3",
	  "rxjs": "5.0.0-beta.12",
	  "systemjs": "0.19.27",
	  "zone.js": "0.6.23"
	},
	"devDependencies": {
	  "electron": "1.8.4",
	  "npm-run-all": "3.1.0",
	  "typescript": "2.0.3"
	},
    ```

    This brings a number of important dependencies into the application. Everything under the ```dependencies``` property is associated with the [Angular](https://angular.io/) framework and related TypeScript definitions. Angular is a client framework that simplifies JavaScript applications. It provides functionality for implementing user interfaces and also for calling Web services. The ```devDependencies``` property defines other components used by the application.
     
    > You will be using [TypeScript](https://www.typescriptlang.org/) to code the application. TypeScript is a superset of JavaScript, so the code should look familiar to you. You will use some TypeScript-specific features, such as [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html). (While this is not an absolute requirement, it does simplify the Angular code a bit.)
      
1. Replace the ```scripts``` property in **package.json** with the following ```scripts``` property. Then save your changes to **package.json**.
       
    ```json
	"scripts": {
	  "start": "npm-run-all --parallel electron tsc:w",
	  "electron": "electron .",
	  "tsc": "tsc",
	  "tsc:w": "tsc -w"
	},
    ```

1. Place the mouse cursor over the project directory in Visual Studio Code's Explorer panel and click the **New File** button to add a new file to the project. Name the file **tsconfig.json**.

    ![Adding a file to the project](Images/node-new-file.png)

    _Adding a file to the project_

1. To give TypeScript information about how to build the application, paste the following statements into **tsconfig.json**. Then save your changes.

    ```json
    {
      "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "removeComments": false,
        "noImplicitAny": false
      }
    }
    ```

1. Return to the Command Prompt or terminal window and execute the following command to install the dependencies that you defined:
 
    ```
    npm install
    ```

1. Now it is time to write the application itself. As a first step, use Visual Studio Code to create a file named **index.html** in the project directory and insert the following statements:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>DX Machine Learning Lab</title>
        <link rel="stylesheet" href="main.css">
        <script src="node_modules/core-js/client/shim.min.js"></script>
        <script src="node_modules/zone.js/dist/zone.js"></script>
        <script src="node_modules/reflect-metadata/Reflect.js"></script>
        <script src="node_modules/systemjs/dist/system.src.js"></script>
        <script src="system.config.js"></script>
        <script>
            System.import('app').catch(function(err){ console.error(err); });
        </script>
    </head>
    <body>
    <my-app>Loading ...</my-app>
    </body>
    </html>
    ```

1. Now create a file named **main.css** in the project directory and add the following style definitions:
 
    ```css
    .pixel-grid {
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;
    }
    
    .pixel-grid > div {
        margin: 0;
        padding: 0;
        display: block;
    }
    
    .pixel-grid > div > div {
        margin: 0 2px;
        padding: 0;
        display: inline-block;
        width: 30px;
        height: 30px;
        background-color: #CCCCFF;
    }
    
    .pixel-grid div.selected {
        background-color: #0000FF;
    }
    ```

1. Your app will use [System.js](https://github.com/systemjs/systemjs), a universal dynamic module loader for JavaScript, to load scripts. System.js relies on a configuration file for loading JavaScript files. Add that configuration file to the project by creating a file named **system.config.js** in the project directory and adding the following code:
   
    ```javascript
    (function (global) {
        System.config({
            paths: {
                'npm:': 'node_modules/'
            },
            map: {
                'app': '.',
                '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
                '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
                '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
                '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
                '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
                '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
                'rxjs': 'npm:rxjs'
            },
            packages: {
                app: {
                    main: './application.js',
                    defaultExtension: 'js'
                },
                rxjs: {
                    defaultExtension: 'js'
                }
            }
        });
    })(this);
    ```

1. Electron needs a main startup file. The startup file performs the initial configuration of the application, responds to application events (such as the user closing the application), and loads the initial user interface. Create a file named **main.ts** in the project directory (the .ts extension is for TypeScript) and add the following statements to it:
 
    ```typescript
    const {app, BrowserWindow} = require('electron');
    
    let win = null;
    
    app.on('ready', () => {
        createWindow();
    });
    
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    
    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
    
    function createWindow() {
    
        win = new BrowserWindow({width: 800, height: 600});
        win.loadURL(`file://${__dirname}/index.html`);
        win.on('closed', () => {
            win = null
        });
    
        //win.webContents.openDevTools();
    }
    ```

    > You can uncomment the call to *win.webContents.openDevTools()* if you want the [Chrome Developer Tools](https://developer.chrome.com/devtools) to be opened automatically when you start the application.  This is helpful for debugging if things go wrong with your application.

1. Electron needs to know which file is the main startup file. This is specified in **package.json**. Change the ```main``` property in that file to the following:
       
    ```javascript
    "main": "main.js",
    ```

    **main.js** gets created when the TypeScript file **main.ts** gets compiled into JavaScript.     
     
1. Now comes the Angular application that displays the grid, handles mouse clicks, and calls the ML Web service you set up. Add an **application.ts** file to the project directory and add the following statements:
     
    ```typescript
    import { NgModule, Component, HostListener } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpModule, Http, Headers, RequestOptions } from '@angular/http';
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    import 'rxjs/add/operator/map';
    
    const GridSize: number = 8;
    
    function forEachIndex(count: number, callback: (idx: number) => void) {
        for(let idx = 0; idx < count; idx += 1) {
            callback(idx);
        }
    }
    function mapByIndex(count: number, callback: (idx: number) => any) {
        let items = new Array(count);
        forEachIndex(count, idx => {
            items[idx] = callback(idx);
        });
        return items;
    }
    
    @Component({
        selector: 'pixel-grid',
        template: `
            <div class="pixel-grid">
                <div *ngFor="let row of rows">
                    <div *ngFor="let col of cols"
                         [ngClass]="{ selected: grid[row*gridSize+col] }"
                         (mousedown)="selectPixel(row, col, true)"
                         (mouseover)="selectPixel(row, col)">
                    </div>
                </div>
            </div>
            <div>
                <button (click)="submitGrid()">Submit</button>
                <button (click)="clearGrid()">Clear</button>
            </div>
            <div *ngIf="result">
                Azure ML says you entered a {{result}}
            </div>
            <div *ngIf="requestError"><pre>{{requestError | json}}</pre></div>
        `
    })
    class PixelGrid {
    
        isMouseButtonDown: boolean = false;
        gridSize: number = GridSize;
        grid: boolean[];
        rows: number[];
        cols: number[];
        result: string = null;
        requestError: any = null;
    
        constructor(private http: Http) {
            this.rows = new Array(GridSize);
            this.cols = new Array(GridSize);
            forEachIndex(GridSize, idx => {
                this.rows[idx] = idx;
                this.cols[idx] = idx;
            });
            this.clearGrid();
        }
    
        @HostListener('document:mousedown', [])
        onMouseDown() {
            this.isMouseButtonDown = true;
        }
    
        @HostListener('document:mouseup', [])
        onMouseUp() {
            this.isMouseButtonDown = false;
        }
    
        selectPixel(row, col, select = false) {
            if(this.isMouseButtonDown || select) {
                this.grid[row * GridSize + col] = true;
            }
        }
    
        clearGrid() {
            this.grid = new Array(GridSize * GridSize);
            forEachIndex(GridSize * GridSize, idx => {
                this.grid[idx] = false;
            });
            this.result = null;
            this.requestError = null;
        }
    
        submitGrid() {
    
            let columnNames = mapByIndex(GridSize * GridSize + 1, idx => {
                let paramIdx = "0" + (idx + 1);
                return "p" + paramIdx.substr(paramIdx.length - 2);
            });
            columnNames[GridSize * GridSize] = "digit";
    
            let values = mapByIndex(GridSize * GridSize + 1, idx => {
                return this.grid[idx] ? 16 : 0;
            });
            values[GridSize * GridSize] = 0;
    
            let request = {
                inputs: {
                    input1: {
                        columnNames,
                        values: [values]
                    }
                },
                globalParameters: {
                }
            };
            console.log('-----Request------');
            console.log(JSON.stringify(request, null, 2));
    
            this.postRequest(request);
        }
    
        postRequest(request: any) {
    
            const url = 'WEB_SERVICE_URL';
            const apiKey = 'API_KEY';
    
            let body = JSON.stringify(request);
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            });
            let options = new RequestOptions({
                headers: headers
            });
    
            this.result = null;
            this.requestError = null;
            this.http
                .post(url, body, options)
                .map(res => res.json())
                .subscribe({
                    next: (value) => {
                        console.log('-----Response------');
                        console.log(JSON.stringify(value, null, 2));
                        let valuesList = value.Results.output1.value.Values[0];
                        this.result = valuesList[valuesList.length - 1];
                    },
                    error: (error) => {
                        this.requestError = error.json() || error;
                    }
                });
        }
    }
    
    @Component({
        selector: 'my-app',
        template: `
            <h2>Draw a digit from 0 to 9</h2>
            <pixel-grid></pixel-grid>
        `
    })
    class AppComponent {
    }
    
    @NgModule({
        imports: [ BrowserModule, HttpModule ],
        declarations: [ AppComponent, PixelGrid ],
        bootstrap: [ AppComponent ]
    })
    class AppModule { }
    
    const platform = platformBrowserDynamic();
    platform.bootstrapModule(AppModule);
    ```
     
    The heart of the application is the ```PixelGrid``` component, which displays a two-dimensional grid in which the user draws digits and manages an array of Boolean values indicating the on/off state of each square in the grid. It also handles clicks of the **Submit** and **Clear** buttons. The **Submit** button submits the input data to the ML Web service.
    
1. The application needs the API Key and URL for your Web service. Modify **application.ts** by replacing WEB_SERVICE_URL on line 120 with the Web service URL you saved in Exercise 5, Step 7, and replacing API_KEY on line 121 with the API key you saved in Exercise 5, Step 5.

    ```typescript
    const url = 'WEB_SERVICE_URL';
    const apiKey = 'API_KEY';
    ```

1. Use Visual Studio Code's **File -> Save All** command to save all of your changes. Then return to the Command Prompt or terminal window and compile the application by executing the following command:
         
    ```
    npm run tsc
    ```

Congratulations! You built an Electron application that relies on Azure Machine Learning for intelligence. The final task is to try it out and see how intelligent the app really is.
         
<a name="Exercise7"></a>
## Exercise 7: Test the model

The Electron application puts a graphical front end on Web-service calls. You draw a digit into the grid of squares by dragging a mouse over the squares. Clicking the **Submit** button creates an array of 64 values (one per square, and one for each of the 64 feature columns in the training dataset), serializes it into JSON, and passes it to the Web service. The app deserializes the JSON that comes back and displays the result. In essence, the Electron client provides a highly visual way to gauge the accuracy of your ML model.

1. Run the application by executing the following command in the Command Prompt or terminal window:

    ```
    npm run electron
    ```

    > An alternative is to run the command **npm start**, which starts the application and also watches for changes in the TypeScript files, recompiling them when they change. This ensures that changes to your code will be reflected in the running application without requiring a manual restart.

1. Use your mouse to sketch a "7" into the grid, similar to the one shown below. Then click the **Submit** button.

    ![Testing the app](Images/node-mlclient-app-2.png)

    _Testing the app_

1. In a moment, a message at the bottom of the window will appear telling you what digit you sketched. Is it correct?

    ![Azure ML's response](Images/node-it-works.png)

    _Azure ML's response_

1. Click the **Clear** button to clear the grid and try a few other digits. You'll probably find that the model you built is better at identifying some digits than others, and that you get the best results when the digits you draw fill the expanse of the grid as much as possible.

Any incorrect answers are partly the result of the relatively small dataset you trained the model with (the dataset was roughly 0.5 MB, which is small by big-data standards), and partly due to the fact that the onscreen grid display uses only 1/16th the resolution of the scans that the model was trained with. Nonetheless, it's a pretty impressive feat for an app to perform basic OCR in this manner. And it's indicative of the kinds of apps you can build when you have Azure Machine Learning doing the heavy lifting.

## Summary

In this hands-on lab, you learned how to:

- Create an Azure Machine Learning experiment
- Upload a dataset
- Train and score an Azure Machine Learning model
- Deploy the model as a Web service
- Call the Web service using REST

There's much more than you can do with Azure Machine Learning, but this is a start. Feel free to experiment with it on your own and explore the exciting world of predictive analysis with a tool that is not only productive, but fun!

----

Copyright 2017 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.
