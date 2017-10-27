<a name="HOLTitle"></a>
# Analyzing Data in Real Time with Azure Stream Analytics #

---

<a name="Overview"></a>
## Overview ##

[Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) is a cloud-based service for ingesting high-velocity data streaming from devices, sensors, applications, Web sites, and other data sources and analyzing that data in real time. It supports a [SQL-like query language](https://msdn.microsoft.com/library/azure/dn834998.aspx) that works over dynamic data streams and makes analyzing constantly changing data no more difficult than performing queries on static data stored in traditional databases. With Azure Stream Analytics, you can set up jobs that analyze incoming data for anomalies or information of interest and record the results, present notifications on dashboards, or even fire off alerts to mobile devices. And all of it can be done at low cost and with a minimum of effort.

Scenarios for the application of real-time data analytics are legion and include fraud detection, identity-theft protection, optimizing the allocation of resources (think of an Uber-like transportation service that sends drivers to areas of increasing demand *before* that demand peaks), click-stream analysis on Web sites, shopping suggestions on retail-sales sites, and countless others. Having the ability to process data *as it comes in* rather than waiting until after it has been aggregated offers a competitive advantage to businesses that are agile enough to make adjustments on the fly.

In this lab, you'll create an Azure Stream Analytics job and use it to analyze data streaming in from simulated Internet of Things (IoT) devices. And you will see how simple it is to monitor real-time data streams for information of significance to your research or business.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create an Azure event hub and use it as a Stream Analytics input
- Create a Stream Analytics job and test queries on sample data streams
- Run a Stream Analytics job and perform queries on live data streams
- Store Stream Analytics output in Azure storage blobs

<a name="Prerequisites"></a>
### Prerequisites ###

The following is required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](http://aka.ms/WATK-FreeTrial).
- [Node.js](https://nodejs.org)

---
<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create an event hub](#Exercise1)
- [Exercise 2: Create a shared-access signature token](#Exercise2)
- [Exercise 3: Send events to the event hub](#Exercise3)
- [Exercise 4: Create a Stream Analytics job](#Exercise4)
- [Exercise 5: Prepare queries and test with sample data](#Exercise5)
- [Exercise 6: Analyze a live data stream](#Exercise6)

Estimated time to complete this lab: **60** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create an event hub ##

Azure Stream Analytics supports several types of input, including input from Azure blobs and input from Azure event hubs. Of the two, the latter is typically more interesting because in the IoT world, data is easily transmitted to Azure event hubs through field gateways (for devices that are not IP-capable) or cloud gateways (for devices that *are* IP-capable), and a single Azure event hub can handle millions of events per second transmitted from devices spread throughout the world.

In this exercise, you'll create an Azure event hub to provide input to Azure Stream Analytics and configure it to so that it can be accessed safely and securely by IoT devices and gateways. 

1. In your browser, navigate to the [Azure Portal](https://portal.azure.com). If you are asked to sign in, do so using your Microsoft account.

1. In the portal, click **+ New**, followed by **Internet of Things** and **Event Hubs**.

    ![Adding a new event hub](Images/new-event-hub.png)

    _Adding a new event hub_

1. Type a namespace name into the **Name** box. The name must be unique within Azure, so you will probably have to use something other than the name in the screen shot below. (A green check mark will appear in the box when the name you've entered is one that Azure will accept.) Select **Create new** under **Resource group** and enter the resource-group name "StreamAnalyticsResourceGroup" (without quotation marks). Choose the region closest to you in the **Location** drop-down, and then click the **Create** button.

    ![Creating a namespace](Images/create-namespace.png)

    _Creating a namespace_

1. Click **Resource groups** in the ribbon on the left, and then click the "StreamAnalyticsResourceGroup" resource group created in the previous step.

    ![Opening the resource group](Images/open-resource-group.png)

    _Opening the resource group_

1. Wait until "Deploying" changes to "Succeeded." (You can click the **Refresh** button at the top of the blade to refresh the deployment status.) Then click the namespace whose name you specified in Step 3.

    ![Opening the namespace](Images/open-namespace.png)

    _Opening the namespace_

1. Click **+ Event Hub** to add an event hub to the namespace.

    ![Adding an event hub](Images/add-event-hub.png)

    _Adding an event hub_

1. Type "inputhub" (without quotation marks) into the **Name** box. Then click the **Create** button.

    ![Creating an event hub](Images/create-event-hub.png)

    _Creating an event hub_

1. Wait a moment for the event hub to be created. Then scroll to the bottom of the blade and click the event hub name.

    ![Opening the event hub](Images/open-event-hub.png)

    _Opening the event hub_

1. In order to transmit events to the event hub from an application or device, you need to create a shared-access policy that includes Send permission. To begin, click **Shared access policies**, and then click **+ Add**.

    ![Adding a shared-access policy](Images/new-shared-access-policy.png)

    _Adding a shared-access policy_

1. Type "SendPolicy" (without quotation marks) into the **Policy name** box and check the **Send** box. Then click the **Create** button to create the new policy.

    ![Creating a send policy](Images/create-send-policy.png)

    _Creating a send policy_

1. Wait a moment for **SendPolicy** to appear in the policies list, and then click it.

    ![Opening the policy](Images/open-send-policy.png)

    _Opening the policy_

1. Click the **Copy** button to the right of the **Primary key** box to copy the policy's shared-access key to the clipboard. Then temporarily save the key by pasting it into your favorite text editor. You'll need it in the next exercise.

    ![Copying the primary key to the clipboard](Images/copy-access-key.png)

    _Copying the primary key to the clipboard_

You have created an event hub that can ingest events and be used as the source of input to a Stream Analytics job. You have also created a policy that allows holders of that policy to send events to the event hub. The next step is to generate a security token that can be used to authenticate calls to the event hub.

<a name="Exercise2"></a>
## Exercise 2: Create a shared-access signature token ##

Applications, devices, or gateways can send events to event hubs using the [Azure Event Hubs REST API](https://msdn.microsoft.com/en-us/library/azure/Dn790674.aspx). Each request transmitted via this API must include a valid [shared-access signature (SAS)](https://azure.microsoft.com/en-us/documentation/articles/service-bus-shared-access-signature-authentication/) token in the HTTP Authorization header. SAS tokens are generated from the event hub's URL and the primary key for the policy used to communicate with the event hub — in this case, the policy named "SendPolicy" that you created in the previous exercise.

In this exercise, you will generate a shared-access signature token for the event hub created in [Exercise 1](#Exercise1) and copy it, along with the event hub URL, into a Node.js application that will be used to send events to the event hub in Exercise 3. The Azure Portal doesn't provide an interface for generating SAS tokens, so you will generate a token using a Node.js app named sas.js provided with this lab.

1. If Node.js isn't installed on your computer, go to https://nodejs.org and install it now.

	> You can find out whether Node.js is installed on your computer by executing a **node -v** command in a Command Prompt window or terminal window. If Node.js is installed, you will see the Node.js version number.

1. Open a Command Prompt window or terminal window and in it, navigate to this lab's "resources" directory. Then execute the following commands to install the packages used by the Node.js apps in the "resources" directory:

	```
	npm install shared-access-signature
	npm install request
	```

	> It is very important that you run these commands from the lab's "resources" directory so the packages will be installed in the same directory as the apps that use them.

1. Now execute the following command to run sas.js:

	```
	node sas.js
	```

1. When prompted for the event-hub URL, enter the text below, replacing *namespace* with the namespace name you entered in Exercise 1, Step 3. Then press Enter.

	<pre>
	https://<i>namespace</i>.servicebus.windows.net/inputhub</pre>

	> This assumes that you named the event hub "inputhub" as directed in Exercise 1, Step 7. If you chose another name, substitute that name for "inputhub" in the event-hub URL.

1. When prompted, enter the name of the policy (SendPolicy) you created for the Azure event hub in Exercise 1, Step 10. Then press Enter.

1. When prompted, enter the policy key that you saved in Exercise 1, Step 12. Then press Enter.

1. The SAS token, which is highlighted with the red box below, will be output to the Command Prompt or terminal window. Select it and copy it to the clipboard. 

    ![Copying the SAS token](Images/copy-sas.png)

    _Copying the SAS token_

1. Find the file named eventgen.js in the "resources" directory of this lab and open it in your favorite text editor. Then find the section at the top of the file labeled "KEY VARS:"

	```JavaScript
	///////////////// KEY VARS /////////////////
	var sas = "Token";
	var uri = "URL";
	///////////////////////////////////////////
	```

1. Replace *Token* with the SAS token you copied to the clipboard in Step 7. **Important:** The SAS token must **not include line breaks**. It needs to appear on this line as one contiguous string, and it must begin and end with quotation marks. In addition, the line must end with a semicolon.

1. Replace *URL* with the event-hub URL you entered in Step 4.

1. Save the modified eventgen.js file. The modified "KEY VARS" section should look something like this:

	```JavaScript
	///////////////// KEY VARS /////////////////
	var sas = "SharedAccessSignature sr=https%3A%2F%2Fstream-analytics-lab.servicebus.windows.net%2Finputhub&sig=Rz5dVs73XQkUU8KUcrLivDU4Q7%2Bg8zogdApBZHak480%3D&se=1515170996.004&skn=SendPolicy";
	var uri = "https://stream-analytics-lab.servicebus.windows.net/inputhub";
	///////////////////////////////////////////
	```

Now that you've modified eventgen.js with information specific to your event hub, it's time to generate some events. 

<a name="Exercise3"></a>
## Exercise 3: Send events to the event hub ##

In this exercise, you will send events to the event hub you created in [Exercise 1](#Exercise1). To do that, you'll use Node.js to run eventgen.js, which in turn transmits secure requests to the event hub using the [Azure Event Hubs REST API](https://msdn.microsoft.com/en-us/library/azure/Dn790674.aspx). eventgen.js generates events representing withdrawals from simulated ATM machines. Each event contains relevant information such as the card number used for the withdrawal, the time and amount of the withdrawal, and a unique identifier for the ATM machine used.

1. At the command prompt or in a terminal window, navigate to the "resources" directory of this lab if you aren't there already. Then execute the following command:

	```
	node eventgen.js
	```

	You should see output similar to the following. Each line represents one event sent to the event hub, and events will probably roll by at a rate of about 2 to 3 per second. (Rates will vary depending on your connection speed.) **Confirm that each request returns the HTTP status code 201**. This indicates that the event hub received and accepted the request. If you receive any other status code — for example, 401 — then the SAS token probably isn't valid and you need to repeat [Exercise 2](#Exercise2).

	```
	[1000] Event sent (status code: 201)
	[1001] Event sent (status code: 201)
	[1002] Event sent (status code: 201)
	[1003] Event sent (status code: 201)
	[1004] Event sent (status code: 201)
	[1005] Event sent (status code: 201)
	[1006] Event sent (status code: 201)
	[1007] Event sent (status code: 201)
	[1008] Event sent (status code: 201)
	[1009] Event sent (status code: 201)
	```

1. After 10 to 20 events have been sent, press Ctrl+C (or whatever key combination your operating system supports for terminating an application running in a terminal window) to stop the flow of events. **Leave the Command Prompt or terminal window open so you can return to it later.**

Now that events are flowing to your event hub, the next step is to create a Stream Analytics job and connect it to the event hub.

<a name="Exercise4"></a>
## Exercise 4: Create a Stream Analytics job ##

In this exercise, you will use the Azure Portal to create a Stream Analytics job and connect it to the event hub you created in [Exercise 1](#Exercise1). You will also capture the raw data being passed to the Stream Analytics job from the event hub and examine its structure.

1. Return to the [Azure Portal](https://portal.azure.com) and click **+ New**, followed by **Internet of Things** and **Stream Analytics job**.

    ![Creating a Stream Analytics job](Images/new-stream-analytics-job.png)

    _Creating a Stream Analytics job_

1. Type "ATMAnalytics" (without quotation marks) into the **Job name** box. Select **Use Existing** under **Resource group** and select the "StreamAnalyticsResourceGroup" resource group that you created in [Exercise 1](#Exercise1). Select the region nearest you for **Location**. (It is important to select the same region that you selected for the event hub in Exercise 1, because you're not charged for data that moves within a data center, but you typically *are* charged for data that moves *between* data centers. In addition, locating services that talk to each other in the same data center reduces latency.) Then click the **Create** button.

    ![Specifying parameters for the Stream Analytics job](Images/create-stream-analytics-job.png)

    _Specifying parameters for the Stream Analytics job_

1. Click **Resource groups** in the ribbon on the left, and then click the "StreamAnalyticsResourceGroup" resource group.

    ![Opening the resource group](Images/open-resource-group.png)

    _Opening the resource group_

1. Click **ATMAnalytics** to open the Stream Analytics job in the portal.

    ![Opening the Stream Analytics job](Images/open-stream-analytics-job.png)

    _Opening the Stream Analytics job_

1. Click **Inputs** to add an input to the Stream Analytics job.

    ![Adding an input](Images/add-input-1.png)

    _Adding an input_

1. Click **+ Add**.

    ![Adding an input](Images/add-input-2.png)

    _Adding an input_

1. Type "Withdrawals" (without quotation marks) into the **Input alias** box. Make sure **Source Type** is set to **Data stream** and **Source** is set to **Event hub**. Select the service-bus namespace and event hub ("inputhub") you created in [Exercise 1](#Exercise1). Then select **RootManageSharedAccessKey** from the **Event hub policy name** drop-down and click the **Create** button at the bottom of the blade.

    ![Creating an input](Images/create-input.png)

    _Creating an input_

1. After a few moments, the new input — "Withdrawals" — appears in the list of inputs for the Stream Analytics job. Click it to open a blade for it.

    ![Opening the input](Images/open-input.png)

    _Opening the input_

1. Go back to the Command Prompt or terminal window you left open at the end of the previous exercise and run eventgen.js again by executing the following command:

	```
	node eventgen.js
	```

1. With eventgen.js still running, return to the Azure Portal open in your browser and click **Sample Data**.

	![Sampling input data](Images/sample-data-1.png)

	_Sampling input data_

1. Click **OK** to begin sampling data from the input stream.

	![Specifying sampling parameters](Images/sample-data-2.png)

	_Specifying sampling parameters_

1. Wait a few seconds for sampling to complete, and when you are notified that the sample data can be downloaded, click to download it.

	![Data sampling completed](Images/sample-data-3.png)

	_Data sampling completed_

1. Click **Download** to download the data sampled from the input stream.

	![Downloading sample data](Images/sample-data-4.png)

	_Downloading sample data_

1. Save the JSON file that is downloaded to a location where you can easily find it. Then open the downloaded file in your favorite text editor and take a moment to examine its contents. How many rows (events) are represented in the sample data? What is the structure of each row — that is, what fields does each row contain?

	> If you find the output hard to digest since there are no line breaks, try pasting it into an online JSON viewer such as the one at https://jsonformatter.curiousconcept.com/. 

1. Return to the Command Prompt or terminal window in which eventgen.js is running and press Ctrl+C (or the equivalent) to stop it.

You have connected a Stream Analytics job to an event hub and demonstrated that data is passed from one to the other. You have also sampled the data input to the Stream Analytics job and examined its structure. The next step is to do something with it — specifically, to bring the power of Azure Stream Analytics to bear on the data.  

<a name="Exercise5"></a>
## Exercise 5: Prepare queries and test with sample data ##

Now that your job is set up, there's much more you can do with Stream Analytics than simply view the raw data presented to it. The whole point of Stream Analytics is being able to query real-time data streams. In this exercise, you will use the [Stream Analytics Query Language](https://msdn.microsoft.com/en-us/library/azure/Dn834998.aspx) to query a sample data set for potentially fraudulent ATM transactions. It is always a good idea to test your queries against sample data before deploying them against live data streams, because with sample data, you can verify that a known set of inputs produces the expected outputs.

To flag potentially fraudulent withdrawals from ATMs, you will query for transactions performed with the same ATM card at different ATM machines within a specified time window (60 seconds). In real life, you would probably use a larger time window and perhaps even factor in the distance between ATM machines. However, a narrower time window is useful in a lab environment because it allows you to perform meaningful experiments in minutes rather than hours.

1. Begin by returning to the Stream Analytics job in the portal and clicking **Query**.

    ![Opening the query viewer](Images/add-query.png)

    _Opening the query viewer_

1. Click the **ellipsis** (the three dots) to the right of **Withdrawals** and select **Upload sample data from file** from the menu.

    ![Uploading sample data for testing queries](Images/upload-test-data-1.png)

    _Uploading sample data for testing queries_

1. Click the **folder** icon on the right and select the file named **Withdrawals.json** in this lab's "resources" directory. Then click **OK** to upload the file.

	> The reason you're using a file provided for you (rather than the one you captured in the previous exercise) is to make sure everyone gets the same results. eventgen.js uses JavaScript's Math.random() function to randomize results, and Math.random() does not produce repeatable sequences of pseudo-random numbers.

    ![Uploading Withdrawals.json](Images/upload-test-data-2.png)

    _Uploading Withdrawals.json_

1. When the upload is complete, enter the following query, and then click the **Test** button to execute it against the sample data you uploaded:

	```sql
	SELECT * FROM Withdrawals
	```

	> Where did the name "Withdrawals" come from? That's the alias you assigned to the event-hub input in the previous exercise. If you named it differently, you'll need to replace "Withdrawals" with the alias you used.

    ![Testing a query](Images/test-query-1.png)

    _Testing a query_

1. Confirm that you see the output pictured below. The test data contains 607 rows. Each row has fields named TRANSACTIONID, TRANSACTIONTIME, DEVICEID, CARDNUMBER, and AMOUNT. DEVICEID is the ID of the ATM machine at which the transaction took place. AMOUNT is the amount of cash withdrawn from the ATM.

    ![Query results](Images/query-results-1.png)

    _Query results_

1. Suppose you only wanted to view transactions for amounts between 200 and 300, inclusive. Furthermore, suppose you wanted to clean up the output by assigning your own column names and excluding the TRANSACTIONID column. Enter the following query and click **Test** again to execute it.

	```sql
	SELECT TransactionTime as [Time of Transaction],
	       DeviceID as [ATM],
	       CardNumber as [Card Number],
	       Amount as [Amount]
	FROM Withdrawals
	WHERE Amount >= 200 and Amount <= 300
	```

1. Confirm that the query generated the following output:

    ![Customizing the output](Images/query-results-2.png)

    _Customizing the output_

1. One of the key features of the Stream Analytics Query Language is its ability to group results using windows of time whose length you specify. To demonstrate, enter the following query to count the number of transactions taking place each minute and click **Test** to execute it:

	```sql
	SELECT System.Timestamp as [Time Ending],
        COUNT(*) AS [Number of Transactions]
    FROM Withdrawals TIMESTAMP BY TransactionTime
    GROUP BY TumblingWindow(n, 1)
	```

	> TIMESTAMP BY is an important element of the Stream Analytics Query Language. If it was omitted from the query above, you would be querying for the number of transactions that arrived *at the event hub* each minute rather than the number of transactions that occurred in each 1-minute interval. TIMESTAMP BY allows you to specify a field in the input stream as the event time.

1. Confirm that you see the output below:

    ![Querying for the number of transactions per minute](Images/query-results-3.png)

    _Querying for the number of transactions per minute_

1. Now it's time to query the test data for potentially fraudulent transactions — transactions involving the same ATM card but different ATM machines that take place within 60 seconds of each other. *This is the query you will use in the next exercise against a live data stream*.

	Enter the following query and click **Test** to execute it:

	```sql
	SELECT W1.CardNumber as [Card Number],
	    W1.DeviceID as [ATM 1], W2.DeviceID as [ATM 2],
	    W1.TransactionTime as [Time 1], W2.TransactionTime as [Time 2]
	FROM Withdrawals W1 TIMESTAMP BY TransactionTime
	JOIN Withdrawals W2 TIMESTAMP BY TransactionTime
	ON W1.CardNumber = W2.CardNumber
	AND DATEDIFF(ss, W1, W2) BETWEEN 0 and 60
	WHERE W1.DeviceID != W2.DeviceID
	```

1. This time the output should contain just three rows, each representing two transactions performed with one ATM card at two different locations within 60 seconds of each other:

    ![Detecting potentially fraudulent transactions](Images/query-results-4.png)

    _Detecting potentially fraudulent transactions_

1. Click the **Save** button at the top of the blade to save the query. Then click **Yes** when asked to confirm.

    ![Saving the query](Images/save-query.png)

    _Saving the query_

With the query now formulated, tested against a set of sample data, and saved, it's time to deploy it against a live data stream to produce a running record of potentially fraudulent transactions.

<a name="Exercise6"></a>
## Exercise 6: Analyze a live data stream ##

Being able to run your queries and see the results in the portal is great for testing, but when Azure Stream Analytics is deployed against a live data stream, you need to specify a destination (or destinations) for the output. Stream Analytics supports a variety of output types, including blobs, Azure SQL databases, and even event hubs. One motivation for using blob storage is to create a persistent record from the output.

In this exercise, you will create a storage account and configure the Stream Analytics job to store output in blob storage. Then you will run the job against a live data stream and check the results by inspecting blob storage.

1. Return to the Azure Portal and click **+ New** in the ribbon on the left. Then click **Storage**, followed by **Storage account**.

    ![Adding a storage account](Images/new-storage-account.png)

    _Adding a storage account_

1. In the ensuing blade, enter a unique name for the new storage account and make sure a green check mark appears next to it. Select **Use existing** under **Resource group** and select the resource group named "StreamAnalyticsResourceGroup" so the storage account will belong to the same resource group as the Stream Analytics job and the event hub. Select the same **Location** you selected in previous exercises. Then click the **Create** button at the bottom of the blade.

	> Storage account names must be 3 to 24 characters in length and can only contain numbers and lowercase letters. In addition, the name you enter must be unique within Azure.

	![Creating a storage account](Images/create-storage-account.png)

    _Creating a storage account_

1. Click **Resource groups** in the ribbon on the left, and then click the "StreamAnalyticsResourceGroup" resource group.

    ![Opening the resource group](Images/open-resource-group.png)

    _Opening the resource group_

1. Click **ATMAnalytics** to open the Stream Analytics job in the portal.

    ![Opening the Stream Analytics job](Images/open-stream-analytics-job-2.png)

    _Opening the Stream Analytics job_

1. Click **Outputs**.

    ![Adding an output](Images/add-output-1.png)

    _Adding an output_

1. Click **+ Add**.

    ![Adding an output](Images/add-output-2.png)

    _Adding an output_

1.  Type "FlaggedWithdrawals" (without quotation marks) into the **Output alias** box. Set **Sink** to **Blob storage** and **Subscription** to **Use blob storage from current subscription**. Under **Storage account**, select the storage account you created earlier in this exercise. Set **Container** to **Create a new container** and type "output" (without quotation marks) into the second **Container** box. Type "{date}" (without quotation marks) into the **Path pattern** box, and set **Date format** to **DD-MM-YYYY**. Then click **Create**.

	> Each time you run a Stream Analytics job configured with a blob output, a new blob with a unique name is created. The purpose of **Path pattern** is to allow you to organize output blobs by date and time. In this example, the "output" container will contain folders whose names are the dates of the runs, and each folder will contain blobs with the output from those runs. 

    ![Creating an output](Images/create-output.png)

    _Creating an output_

1. Close the "Outputs" blade and return to the blade for the Stream Analytics job. Then click **Start**.

    ![Starting the Stream Analytics job](Images/start-stream-analytics-job-1.png)

    _Starting the Stream Analytics job_

1. Make sure **Job output start time** is set to **Now**, and then click the **Start** button to start running the job.

    ![Specifying the job start time](Images/start-stream-analytics-job-2.png)

    _Specifying the job start time_

1. Return to the Command Prompt or terminal window in which you ran eventgen.js and execute the following command to run it again:

	```
	node eventgen.js
	```

1. Wait 5 minutes or more to give the job time to start and eventgen.js time to transmit several hundred events. Then terminate eventgen.js and return to the browser window.

	> If you'd like, you can open several terminal windows and run eventgen.js in each one to increase the volume of events.

1. Return to the Stream Analytics job in the portal and click **Stop** to stop it. Then click **Yes** when asked to confirm that you want to stop the job.

    ![Stopping the Stream Analytics job](Images/stop-stream-analytics-job.png)

    _Stopping the Stream Analytics job_

1. Wait until the job is stopped. Then open the blade for the "StreamAnalyticsResourceGroup" resource group and click the storage account you created in Step 2.

    ![Opening the storage account](Images/open-storage-account.png)

    _Opening the storage account_

1. Click **Blobs**.

    ![Opening blob storage](Images/open-blob-storage.png)

    _Opening blob storage_

1. Click the container named "output."

    ![Opening the output container](Images/open-container.png)

    _Opening the output container_

1. Click the folder in the "output" container.

    ![Opening the output folder](Images/open-folder.png)

    _Opening the output folder_

1. Click the blob containing the Stream Analytics output.

	> If there is no output blob, wait a few minutes and check again. Sometimes a blob created by a Stream Analytics job appears immediately, and at other times, it may take a few minutes to show up.

	![Opening the output blob](Images/open-blob.png)

    _Opening the output blob_

1. Click **Download** to download the blob.

    ![Downloading the output blob](Images/download-blob.png)

    _Downloading the output blob_

1. Open the downloaded JSON file in your favorite text editor. Each object (row) in the output represents a potentially fraudulent transaction. Note that **the number of rows and the content of each row will vary from machine to machine as well as from one run to another**.

    ![JSON job output](Images/output-blob.png)

    _JSON job output_

Currently, the output from your Stream Analytics job is stored in blobs. In real life, you might prefer to view the output in a more convenient form, such as in a chart that's updated in real time. You could accomplish that by writing an application that monitors the blob and charts the data, or, better yet, by directing the output to an event hub and writing an application that subscribes to events from the event hub.

Microsoft recognizes that not everyone wants to write applications, and has provided an alternative in the form of [Microsoft Power BI](https://powerbi.microsoft.com/). With Power BI, you can create dashboards that render output from Stream Analytics jobs without writing any code. For more information, refer to [Stream Analytics & Power BI: A real-time analytics dashboard for streaming data](https://azure.microsoft.com/en-us/documentation/articles/stream-analytics-power-bi-dashboard/).

<a name="Summary"></a>
## Summary ##

Azure Stream Analytics is a powerful tool for analyzing live data streams from IoT devices or anything else that's capable of transmitting data. In this lab, you got a first-hand look at Stream Analytics as well as Azure event hubs. Among other things, you learned how to:

- Create an Azure event hub and use it as a Stream Analytics input
- Create a shared-access signature that allows event hubs to be called securely using REST APIs
- Create a Stream Analytics job and test queries on sample data streams
- Run a Stream Analytics job and perform queries on live data streams
- Create a rule (query) that detects anomalies in streaming data
- Use that rule to record anomalies in Azure blobs

One drawback to hard-coding rules into Stream Analytics is that rules don't "learn" from the data streams, which can lead to false positives in anomaly detection. If this concerns you, read the article entitled [Anomaly Detection – Using Machine Learning to Detect Abnormalities in Time Series Data](http://blogs.technet.com/b/machinelearning/archive/2014/11/05/anomaly-detection-using-machine-learning-to-detect-abnormalities-in-time-series-data.aspx) in the Azure team's Machine Learning blog. In it, they present an anomaly detection service accessible through a REST API that uses Azure Machine Learning to learn from the data presented to it. Imagine combining the power of Stream Analytics to extract information from real-time data streams with the power of Azure Machine Learning to learn from that information and refine the analytics on the fly. This is precisely the type of solution that Microsoft Azure empowers you to build!

---

Copyright 2017 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.
