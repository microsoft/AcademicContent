# Azure Logic Apps
## Creating serverless process to analyse an image and email you

In this section you will build an Azure Logic App to consume your Custom Vision Endangered Animal Detector classification application

First we need to create two Azure Storage Accounts.

Go to the **azure portal** and click **create new resource** in the top left corner. Select the section **Storage** and choose the first option **Storage Account**.

![Select Storage account in Azure Portal](docs-images/storage-account.JPG)

1. We are going to create a storage account for the images to be dropped into to be processed (called endangeredanimaldetector)
2. And a storage account for the output to be dropped into to review (called endangeredanimaloutput)

*follow the process below for each of the storage accounts mentioned above*

On the storage account creation page enter options to setup your storage account

* **Subscription:** choose your subscription
* **Resource Group:** choose the resource group you have been using for this application (e.g. student-ai-workshop)
* **Storage Account Name:** (must be unique) enter an all lowercase storage account name. Such as endangeredanimaldetector(yourname) - append your name to the end of the storage account name so you know its unique (remove the brackets)
* **Location:** your closest data center
* **Performance:** Standard
* **Account Kind:** Blob Storage
* **Replication:** Locally-redundant storage (LRS)
* **Access Tier:** Hot


Select **Review + create**, confirm validation is passed and then select **Create**

![Storage account details to follow](docs-images/storage-account-details.JPG)

*Repeat this process for both storage accounts before continuing*

Once your deployment is complete, got to the resource and review the account settings. Select Blobs to review your empty blob storage account.

![Review Blob Storage Details](docs-images/blob-storage-account-page.JPG)

We need to add a container to the storage account to store our images and results.

* Select the **+ Container** button
* Create a name for the container
    * for example the **endangeredanimalsdetector** account would have an **images** container/folder
    * for example the **endangeredanimalsoutput** account would have a **results** container/folder
* For the public access level setting select **Container (anonymous read access for containers and blobs)**

![create images container](docs-images/create-stor-container.JPG)

Now we will create a **Logic App** - this will connect your image storage account to your AI classification service and send the results to the results storage account in a csv file

Head to the **Azure Portal Homepage**. We are going to use **Event Grid**, a service that detects triggers in an Azure subscription (in our case, when a new blob is created in your Azure Storage account). Before we build with this - **we must register it**.

Got to **subscriptions** in the left panel, select your subscription and find **Resource Providers** in the left pane. Once the resource providers are listed - search **'event'** and select **Microsoft.EventGrid**.

![Register Event Grid on your Azure Subscription](docs-images/subscriptions.JPG)

If this is not already status registered, **select register** from the toolbar

![Register Microsoft.EventGrid if not already registered](docs-images/register-event-grid.JPG)

![Registering status](docs-images/registering.JPG)

Once registered with a **green tick** - go back to the **Azure Portal Homepage**. Select **Create a Resource**. Type **Logic App** and select the service

![Logic Apps service create page](docs-images/logic-app.JPG)

Create the logic app by entering some setup details like below:

* **Name:** suitable name for the endangered animal detector classification application
* **Subscription:** Choose your subscription
* **Resource Group:** (use existing e.g. student-ai-exercise) select the resource group you have been working for the whole workshop
* **Location:** choose the data center closest to you
* **Log Analytics:** off
* Choose **Create**

![Logic app creation details to follow](docs-images/logic-app-details.JPG)

Once created, go to resource. From here we can create our logic process. Select **Logic app designer** from the left menu and then the **When an Event Grid resource event occurs** option

![Select event grid option](docs-images/when-event-grid-occurs.JPG)

Connect to Azure event grid by signing in using your Azure credentials

![Event grid sign in](docs-images/event-grid-sign-in.JPG)

Once connected and you see a green tick, select continue.

Select the options below:

* **Subscription:** your subscription
* **Resource Type:** Microsoft.Storage.StorageAccounts
* **Resource Name:** choose your image storage account (e.g. endangeredanimaldetector)
* **Event Type Item - 1:** Microsoft.Storage.BlobCreated

![Event Grid details to follow](docs-images/when-resource-event-occurs.JPG)

Then choose next step. Type **Parse JSON** and select the parse JSON operator as part of the data **Data Operations** category

* **Content:** select the box and from the Dynamic Content box on the right, select **Body**
* **Schema:** select this box and enter the JSON schema provided in the [logic-app-schema1.json](sample-code/logic-app-schema1.json) file

![Parse JSON from blob storage call](docs-images/parse-json.JPG)

Then choose **next step**. Type **custom vision** and select the **Classify an image URL (preview)** as below

![Custom vision logic app selection](docs-images/custom-vision-logic-app.JPG)

Now we need to fill in the details to connect to our custom vision service: 

* **Connection Name:** enter a connection name you will associate with this logic app connector. (example: endangeredanimalcustomvision)
* **Prediction Key:** In the **Azure Portal**, in your resource group folder you will see two services like below - select the one ending in **'_Prediction'**. In there copy the key and put in this box in logic apps
![Select Prediction service](docs-images/select-prediction-service.JPG)
![Get key details](docs-images/custom-vision-prediction-key.JPG)
* **Site URL:** As with the above in the custom vision service ending **_Prediction** copy the **Endpoint URL**

Completed details below:
![Connection details for custom vision](docs-images/custom-vision-connection.JPG)

Now lets enter the Project details for your Custom Vision service:
* **Project ID:** Find the project ID from the settings logo in the top right of the Custom Vision webpage
![Find Project ID from Custom Vision service](docs-images/find-project-id.JPG)
* **Published Name:** Enter **Iteration1** or whatever you named your published model. You find this information in the custom vision UI select Performance tab
* **Image URL** select the input box and on the right side select URL from Parse JSON outputs

![Project Details for Custom Vision service](docs-images/project-details-custom-vision.JPG)

Choose **next step**

Type **for each** and select the grey control step called for each. Once selected in the output from previous step box, select the box and from Dynamic content select **Predictions** from the Classify an image url category

![Select all the predictions](docs-images/predictions.JPG)

Choose **Add an action**

Search **Control**, select the control icon and then from the results, select **Condition**

![Select IF statement option](docs-images/if-statement.JPG)

In the **Condition** box, select choose a value. From Dynamic content find **'Classify an image url'** heading and then **Probability** option

Set the condition to be **Predictions Probability** greater than 0.7 (as shown below)

![Enter predictions probability greater than 0.7](docs-images/probability.JPG)

In the **If True** box select **Add an action**

> You have two options to continue with: 
> * If you have an Office 365 subscription with your university account - [check out the personalized email output here](endangered-animal-detector-O365-output.md)
> * Else, carry on with the instructions below and output the data to an output storage account

First connect to your storage account in the Logic App:
* Select 'Azure Blob Storage'
* Then 'Create Blob'
* Create a connection name, for example result-storage
* Select your output storage account

Next setup the content of the output blob:
* folder path is your 'results' container within your output storage account. You can use the folder icon to select this
* Blob name select 'Classify an image url' and then 'Id'.csv
* Blob content select 'Classify an image url' 'Predictions Tag' : 'Predictions Probability'

![Create Blob Storage content](docs-images/create-blob-content.JPG)


Finally save the logic app in the top action bar

Once saved, lets test the app for the desired outcome. Select **Run** from the top action bar

![Run logic app to test](docs-images/run-logic-app.JPG)

Now navigate to your images storage account (easy to find from the resource group section). Choose **Blob** and select the **images container**. In there you should see an **upload** button. Upload one of the images from the testset folder

![Image uploaded to test](docs-images/upload-image.JPG)

Once uploaded, navigate back to your **Logic App main page** and review the **runs history** section at the bottom of the page. Select the successful run to review the inputs and outputs

![Successful runs on Logic Apps main page](docs-images/successful-run.JPG)

All sections should have a green tick and you can select each one to view the input and output between the layers (this is also a great way to debug if it doesn't run as expected)

![Completed run to dig into](docs-images/run-complete.JPG)

In the final part of the run you can review the blob storage output
![Blob Storage output in Logic App](docs-images/blob-output.JPG)

and also find the file in your output storage account results folder
![CSV Blob Storage account](docs-images/csv-blob-output.JPG)


## Congratulations! 

You have created an end-to-end process using an AI service.
