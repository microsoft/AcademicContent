![](Images/header.png)

[Image classification](https://en.wikipedia.org/wiki/Contextual_image_classification) is a common application for [machine learning](https://en.wikipedia.org/wiki/Machine_learning). The classic use case involves training a computer to recognize cat images — or, if you're fan of the TV show [Silicon Valley](https://www.hbo.com/silicon-valley), hot-dog images. In real life, image classification serves a variety of purposes ranging from analyzing images for adult content to identifying defective parts produced by manufacturing processes. It was recently used to [help search-and-rescue drones](https://blogs.technet.microsoft.com/canitpro/2017/05/10/teaching-drones-to-aid-search-and-rescue-efforts-via-cognitive-services/?WT.mc_id=academiccontent-github-cxa) identify objects such as boats and life vests in large bodies of water and recognize potential emergency situations in order to notify a rescue squad without waiting for human intervention.

Image-classification models are typically built around [convolutional neural networks](https://en.wikipedia.org/wiki/Convolutional_neural_network) that "learn" from the thousands (or tens or hundreds of thousands) of labeled images they are trained with. Such networks are frequently built using [Apache Spark](https://spark.apache.org/) and [Spark ML](http://spark.apache.org/docs/latest/ml-guide.html). The [Microsoft Machine Learning Library for Apache Spark](https://github.com/Azure/mmlspark), also known as MMLSpark, is an open-source library that simplifies machine learning in Spark by abstracting many of Spark ML's lower-level APIs and providing near-seamless integration between Spark ML pipelines and popular Deep Neural Network (DNN) libraries such as the [Microsoft Cognitive Toolkit](https://www.microsoft.com/research/product/cognitive-toolkit/?WT.mc_id=academiccontent-github-cxa), also known as the Computational Network Toolkit, or simply CNTK.

In this lab, the first of four in a series, you will use the Azure CLI to create an Azure SQL database in the cloud. Then you will use [Azure Machine Learning Workbench](https://docs.microsoft.com/azure/machine-learning/preview/quickstart-installation?WT.mc_id=academiccontent-github-cxa) to run a Python script that uses the [Bing Image Search API](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/?WT.mc_id=academiccontent-github-cxa) to search the Web for images of paintings by famous artists and write the results to the Azure SQL database. In [Lab 2](../2%20-%20Process), you will clean the data, and in [Lab 3](../3%20-%20Predict), you will use MMLSpark to build an image-classification model that can identify the artists of famous paintings. Finally, in [Lab 4](../4%20-%20Visualize), you will operationalize the model and build an app that uses it.

![](Images/road-map-1.png)

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Use the Azure CLI to create an Azure SQL database
- Search the Web for images using Bing Image Search
- Write to an Azure SQL database using Python

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- An active Microsoft Azure subscription. If you don't have one, [sign up for a free trial](https://aka.ms/WATK-FreeTrial).
- A computer running Windows 10, Windows Server 2016, macOS Sierra, or macOS High Sierra
- [Azure Machine Learning Workbench](https://docs.microsoft.com/azure/machine-learning/preview/quickstart-installation?WT.mc_id=academiccontent-github-cxa)
- The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?WT.mc_id=academiccontent-github-cxa)
- [Docker](https://www.docker.com/)

<a name="Cost"></a>
### Cost ###

![](Images/cost-2.png)

The cost of this lab series is **moderate**. For an overview of cost ratings, refer to [Explanation of Costs](../../../Costs.md).

<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create an Azure SQL database](#Exercise1)
- [Exercise 2: Get a Bing Search API key](#Exercise2)
- [Exercise 3: Create a Docker container image](#Exercise3)
- [Exercise 4: Populate the database](#Exercise4)
- [Exercise 5: View the contents of the database](#Exercise5)

Estimated time to complete this lab: **40** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create an Azure SQL database ##

In this exercise, you will use the Azure CLI to create an Azure SQL database in the cloud. This database will ultimately serve as a source of data for a machine-learning model that performs image classification. Note that you can also create Azure SQL databases using the [Azure Portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa). Whether to use the CLI or the portal is often a matter of personal preference.

1. If the Azure CLI 2.0 isn't installed on your computer, go to https://docs.microsoft.com/cli/azure/install-azure-cli and install it now. You can determine whether the CLI is installed — and what version is installed — by opening a Command Prompt or terminal window and typing the following command:

	```
	az -v
	```

	If the CLI is installed, the version number will be displayed. If the version number is less than 2.0.19, download and install the latest version.

	> As an alternative to installing the Azure CLI, you can use the [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/?WT.mc_id=academiccontent-github-cxa) available in the [Azure Portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa). Simply open the portal in your browser and click the **Cloud Shell** button in the toolbar at the top of the page. One of the benefits of using the Cloud Shell is that you're *always* running an up-to-date version. Note that you can use **Shift+Insert** to paste commands into the Cloud Shell, and **Ctrl+Insert** to copy text from the Cloud Shell to the clipboard.

	![Opening the Azure Cloud Shell](Images/cloud-shell.png)

	_Opening the Azure Cloud Shell_

1. The next task is to create a resource group to hold the database and other Azure resources that you will create in this lab. Execute the following command in a Command Prompt window or terminal window to create a resource group named "mmlsparklab-rg" in Azure's South Central US region:

	```
	az group create --name mmlsparklab-rg --location southcentralus
	```

	> If the CLI responds by saying you must log in to execute this command, type ```az login``` and follow the instructions on the screen to log in to the CLI. In addition, if you have multiple Azure subscriptions, follow the instructions at https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli to set the active subscription — the one that the resources you create with the CLI will be billed to.

1. Now use the following command to create a database server in the "mmlsparklab-rg" resource group. Replace SERVER_NAME with the name you wish to assign the database server, and replace ADMIN_USERNAME and ADMIN_PASSWORD with the user name and password for an admin user. **Remember the user name and password** that you enter, because you will need them later.

	```
	az sql server create --name SERVER_NAME --resource-group mmlsparklab-rg --location southcentralus --admin-user ADMIN_USERNAME --admin-password ADMIN_PASSWORD
	```

	> The server name must be unique within Azure, and the admin password must be at least 8 characters long. The user name cannot be one that is reserved in SQL Server such as "admin" or "sa." The user name "adminuser" is valid if you want to use that.

1. Use the following command to create a firewall rule that allows the database server to be accessed externally from any IP address. Once more, replace SERVER_NAME with the server name you specified in Step 3.

	```
	az sql server firewall-rule create --resource-group mmlsparklab-rg --server SERVER_NAME -n AllowAll --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
	```

	> In practice, you would limit access to your own IP address or a narrow range of IP addresses. To avoid issues with dynamic IP addresses, however, here you are allowing access from any IP address.

1. Use the following command to create a database assigned the [S0 service tier](https://docs.microsoft.com/azure/sql-database/sql-database-service-tiers?WT.mc_id=academiccontent-github-cxa). Replace DATABASE_NAME with the name you wish to assign the database, and SERVER_NAME with the server name you specified in Step 3.

	```
	az sql db create --resource-group mmlsparklab-rg --server SERVER_NAME --name DATABASE_NAME --service-objective S0
	```

You now have a resource group that contains a database and a database server. If you would like to verify that they were created, open the [Azure Portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa) in your browser, click **Resource groups** in the ribbon on the left side of the portal, and then click the resource group named "mmlsparklab-rg." The resource group should contain two resources, as pictured below. The resource names will differ depending on how you named the database and database server.

![Contents of the "mmlsparklab-rg" resource group](Images/resource-group.png)

_Contents of the "mmlsparklab-rg" resource group_

<a name="Exercise2"></a>
## Exercise 2: Get a Bing Search API key ##

The [Bing Image Search API](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/?WT.mc_id=academiccontent-github-cxa) is part of the [Microsoft Cognitive Services](https://azure.microsoft.com/services/cognitive-services/?WT.mc_id=academiccontent-github-cxa) suite of services and APIs for building intelligent applications. In [Exercise 4](#Exercise4), you will use the Bing Image Search API from a Python script to search the Web for images of paintings by famous artists. But in order to invoke the Bing Image Search API, you need an API key. In this exercise, you will use the Azure Portal to acquire an API key.

1. Open the [Azure Portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa) in your browser. If asked to log in, do so using your Microsoft account.

1. In the Azure Portal, click **+ Create a resource**. Type "bing search" (without quotation marks) into the search box and select **Bing Search v7 APIs** from the drop-down list. Then click the **Create** button at the bottom of the ensuing blade.

    ![Creating a new Bing Search API subscription](Images/new-search-api.png)

    _Creating a new Bing Search API subscription_

1. Type "bing-search-api" into the **Name** box and select **S1** as the **Pricing tier**. Select the same **Location** that you selected for the database server in the previous exercise. Under **Resource group**, select **Use existing** and select the "mmlsparklab-rg" resource group that you created in [Exercise 1](#Exercise1). Check the **I confirm** box, and then click **Create**.

    ![Subscribing to the Bing Search API](Images/create-search-api.png)

    _Subscribing to the Bing Search API_

1. Click **Resource groups** in the ribbon on the left side of the portal, and then click the "mmlsparklab-rg" resource group to view its contents. Now click the Bing Search subscription that you created a moment ago.

    ![Opening the subscription](Images/open-search-api.png)

    _Opening the subscription_

1. Click **Keys** in the menu on the left. Then click the **Copy** button to the right of **KEY 1** to copy the API key to the clipboard.

    ![Copying the API key](Images/copy-search-key.png)

    _Copying the API key_

Finish up by pasting the key that is on the clipboard into your favorite text editor so you can easily retrieve it in [Exercise 4](#Exercise4).

<a name="Exercise3"></a>
## Exercise 3: Create a Docker container image ##

In [Exercise 4](#Exercise4), you will use a Python script to search the Web for images of paintings by famous artists and write the results to the database you created in [Exercise 1](#Exercise1). The script will run in a Docker container and use a popular Python package named [pyodbc](https://github.com/mkleehammer/pyodbc) to connect to the database. That package only works, however, if the [Microsoft ODBC Driver for SQL Server](https://docs.microsoft.com/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?WT.mc_id=academiccontent-github-cxa) is installed as well. In this exercise, you will create a Docker container image that includes the Microsoft ODBC Driver for SQL Server.

1. If Docker isn't installed on your computer, go to https://www.docker.com/ and download and install [Docker for Windows](https://www.docker.com/docker-windows) or [Docker for Mac](https://www.docker.com/docker-mac). If you are not sure whether Docker is installed on your computer, open a Command Prompt or terminal window and type the following command:

	```
	docker -v
	```

	If a Docker version number is displayed, then Docker is installed. If Docker is not installed, restart your PC after installing it.

1. Create a directory on your hard disk and name it anything you want. Then add a text file named **Dockerfile** (no file-name extension) to that directory and insert the following statements:

	```dockerfile
	FROM microsoft/mmlspark:plus-0.9.9
	USER root
	RUN apt-get update && apt-get install -y \
	    curl apt-utils apt-transport-https debconf-utils gcc build-essential g++-5\
	    && rm -rf /var/lib/apt/lists/* && \
	    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
	    curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
	    apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql unixodbc-dev && \
	    apt-get update && ACCEPT_EULA=Y apt-get install -y mssql-tools && \
	    echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc && \
	    /bin/bash -c "source ~/.bashrc" && \
	    apt-get install -y locales && \
	    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
	```

	This **Dockerfile** contains instructions for building a Docker container image. It uses [microsoft/mmlspark](https://hub.docker.com/r/microsoft/mmlspark/) as the base image and adds the Ubuntu version of the Microsoft ODBC Driver for SQL Server.

1. Open a Command Prompt or terminal window and navigate to the directory you created in the previous step (the directory that contains the **Dockerfile**). Then execute the following command to build a custom container image named ```spark-sql```:

	```
	docker build -t spark-sql .
	```

1. Wait until the command completes (it will probably take a few minutes) and confirm that it completed successfully.

The container image has been created and cached on the local machine. If you would like to be absolutely certain that it was created and cached, execute a ```docker images``` command in the Command Prompt or terminal window and verify that the list of images includes one named ```spark-sql```.

<a name="Exercise4"></a>
## Exercise 4: Populate the database ##

In this exercise, you will use Azure Machine Learning Workbench to execute a Python script that uses the Bing Image Search API to find images of paintings by famous artists such as Picasso, Van Gogh, and Monet and record information about the images, including their URLs, in the Azure SQL database that you created in [Exercise 1](#Exercise1).

1. If Azure Machine Learning Workbench isn't installed on your computer, go to https://docs.microsoft.com/azure/machine-learning/preview/quickstart-installation and follow the instructions there to install it, create a Machine Learning Experimentation account, and sign in to Machine Learning Workbench for the first time. The experimentation account is required in order to use Azure Machine Learning Workbench.

1. Launch Azure Machine Learning Workbench if it isn't already running. Then click the **+** sign in the "Projects" panel and select **New Project**.

	![Creating a new project](Images/new-project-1.png)

	_Creating a new project_

1. Enter a project name such as "MMLSpark-Lab" and a project description. For **Project directory**, specify the location where you would like for the project directory to be created. Make sure **Blank Project** is selected as the project type, and then click the **Create** button.

	![Creating a new project](Images/new-project-2.png)

	_Creating a new project_

1. Click the folder icon in the ribbon on the left to display all the files in the project. Then expand the treeview to show the files in the "aml_config" directory and click **docker.runconfig**. This file contains configuration information used when the project is executed in a Docker container.

	![Opening docker.runconfig](Images/open-run-config.png)

	_Opening docker.runconfig_

1. Click the down-arrow next to **Edit** and select **Edit as text in Workbench** to enter editing mode.

	![Editing docker.runconfig](Images/edit-run-config.png)

	_Editing docker.runconfig_

1. On line 30 of **docker.runconfig**, change the value of ```PrepareEnvironment``` from false to true:

	```
	PrepareEnvironment: true
	```

	This configures the project to automatically prepare the environment by loading dependencies when the project is run.

1. Select **Save** from the **File** menu to save the modified **docker.runconfig** file.

1. Open **docker.compute** for editing in Machine Learning Workbench. Then change the value of ```baseDockerImage``` on line 8 to "spark-sql," as shown here:

	```
	baseDockerImage: "spark-sql"
	```

	This changes the base Docker image used for the Docker container to the custom image that you built in the previous exercise.

1. Use the **File** > **Save** command to save the modified **docker.compute** file.

1. Open **conda_dependencies.yml** for editing in Machine Learning Workbench. Add the following lines to the ```dependencies``` section, which starts on line 16:

	```yml
	- pyodbc
	- pillow
	- sqlalchemy
	- scikit-image
	```

	Then add these lines to the ```- pip``` section of the file:

	```yml
	- dhash
	- azure-storage-blob
	- https://cntk.ai/PythonWheel/CPU-Only/cntk-2.3.1-cp35-cp35m-linux_x86_64.whl
	```

	The modified ```dependencies``` section should look something like this:

	```yml
	dependencies:
	  - pyodbc
	  - pillow
	  - sqlalchemy
	  - scikit-image
	
	  # The python interpreter version.
	  # Currently Azure ML Workbench only supports 3.5.2.
	  - python=3.5.2
	
	  # Required for Jupyter Notebooks.
	  - ipykernel=4.6.1
	  
	  - pip:
	    # The API for Azure Machine Learning Model Management Service.
	    # Details: https://github.com/Azure/Machine-Learning-Operationalization
	    - azure-ml-api-sdk==0.1.0a10
	    - dhash
	    - azure-storage-blob
	    - https://cntk.ai/PythonWheel/CPU-Only/cntk-2.3.1-cp35-cp35m-linux_x86_64.whl
	
	    # Helper utilities for dealing with Azure ML Workbench Assets.
	    - https://azuremldownloads.blob.core.windows.net/wheels/latest/azureml.assets-1.0.0-py3-none-any.whl?sv=2016-05-31&si=ro-2017&sr=c&sig=xnUdTm0B%2F%2FfknhTaRInBXyu2QTTt8wA3OsXwGVgU%2BJk%3D
	```

	When you run this project, Azure Machine Learning Workbench builds a Docker image containing the packages listed in the ```dependencies``` section of **conda_dependencies.yml**. The packages you added include the database libraries [pyodbc](https://github.com/mkleehammer/pyodbc) and [SQLAlchemy](http://docs.sqlalchemy.org/en/latest/core/engines.html), imaging libraries named [Pillow](https://pypi.python.org/pypi/Pillow) and [Scikit-image](http://scikit-image.org/), libraries for interacting with Azure Storage, and a version of the [Microsoft Cognitive Toolkit](https://www.microsoft.com/research/product/cognitive-toolkit/?WT.mc_id=academiccontent-github-cxa) that doesn't require a GPU, among others.

1. Use the **File** > **Save** command to save the modified **conda_dependencies.yml** file.

1. Click the **+** sign in the project panel and use the **New Item** command to add a file named **load.py** to the project.

	![Adding a file to the project](Images/new-file.png)

	_Adding a file to the project_

1. Open **load.py** for editing in Machine Learning Workbench and paste in the following Python code:

	```python
	# HTTP and JSON support
	import http.client, urllib.parse, json, requests
	
	# SQL Alchemy for full relational power
	# http://docs.sqlalchemy.org/en/latest/core/engines.html
	from sqlalchemy import create_engine
	import pyodbc
	
	# Pandas for DataFrame
	# https://pypi.python.org/pypi/pandas
	import pandas as pd
	
	# dhash and PIL for image feature generation
	# https://pypi.python.org/pypi/dhash
	# https://pypi.python.org/pypi/Pillow
	import dhash
	from PIL import Image
	
	# BytesIO to obtain from URL
	# https://wiki.python.org/moin/BytesIO
	from io import BytesIO
	
	server = 'SERVER_NAME'
	database = 'DATABASE_NAME'
	username = 'ADMIN_USERNAME'
	password = 'ADMIN_PASSWORD'
	
	api_key = 'API_KEY'
	host = 'api.cognitive.microsoft.com'
	path = '/bing/v7.0/images/search'
	max_results = 150
	
	def bing_image_search(df, dict, artist_name):
	    headers = { 'Ocp-Apim-Subscription-Key' : api_key }
	    conn = http.client.HTTPSConnection(host)
	    query = urllib.parse.quote(artist_name)
	    conn.request('GET', path + '?q=' + query + '&count=' +str(max_results), headers=headers)
	    response = conn.getresponse()
	
	    # Bytes Operations
	    # https://docs.python.org/3/library/stdtypes.html#bytes-and-bytearray-operations
	    result = response.read().decode(errors='replace')
	    paintings = json.loads(result)['value']
	
	    # Artist values are the same for all paintings
	    artist_number = dict[artist_name]
	
	    # Remove spaces for later file processing
	    artist_name = artist_name.replace(' ', '')
	
	    for painting in paintings:
	        width = painting['thumbnail']['width']
	        height = painting['thumbnail']['height']
	        encodingFormat = painting['encodingFormat']
	        name = painting['name'].replace("'", "''")
	        url = painting['thumbnailUrl']
	
	        # Generate dhashes
	        response = requests.get(url)
	        image = Image.open(BytesIO(response.content))
	        row8, col8 = dhash.dhash_row_col(image, size=8)
	        DHashHex8 = dhash.format_hex(row8, col8, size=8)
	        row7, col7 = dhash.dhash_row_col(image, size=7)
	        DHashHex7 = dhash.format_hex(row7, col7, size=7)
	        row6, col6 = dhash.dhash_row_col(image, size=6)
	        DHashHex6 = dhash.format_hex(row6, col6, size=6)
	        row5, col5 = dhash.dhash_row_col(image, size=5)
	        DHashHex5 = dhash.format_hex(row5, col5, size=5)
	        row4, col4 = dhash.dhash_row_col(image, size=4)
	        DHashHex4 = dhash.format_hex(row4, col4, size=4)
	        row3, col3 = dhash.dhash_row_col(image, size=3)
	        DHashHex3 = dhash.format_hex(row3, col3, size=3)     
	        row2, col2 = dhash.dhash_row_col(image, size=2)
	        DHashHex2 = dhash.format_hex(row2, col2, size=2)     
	        row1, col1 = dhash.dhash_row_col(image, size=1)
	        DHashHex1 = dhash.format_hex(row1, col1, size=1)                    
	
	        # Add a row to the DataFrame
	        df.loc[len(df.index)] = [artist_name, artist_number, width, height, encodingFormat, name, url, \
	            DHashHex8, DHashHex7, DHashHex6, DHashHex5, DHashHex4, DHashHex3, DHashHex2, DHashHex1]
	
	# Use Bing Image Search to find images and build a DataFrame
	searchDictionary = { 'Picasso Painting':0, 'Van Gogh Painting':1, 'Monet Painting':2 }
	
	df = pd.DataFrame(columns=['Artist', 'ArtistNumber', 'Width', 'Height', 'EncodingFormat', 'Name', 'URL',
	    'DHashHex8', 'DHashHex7', 'DHashHex6', 'DHashHex5', 'DHashHex4', 'DHashHex3', 'DHashHex2', 'DHashHex1'])
	
	for key, value in searchDictionary.items():
	    print('Searching Images for ' + key)
	    bing_image_search(df, searchDictionary, key)
	
	# Write the DataFrame to the database
	engine = create_engine('mssql+pyodbc://' + username + ':' + password + '@' + \
	    server + '.database.windows.net:1433/' + database + '?driver=ODBC+Driver+13+for+SQL+Server')
	
	df.to_sql('Paintings', engine, if_exists='replace', index=False)
	```

	This script invokes the Bing Image Search API three times to search the Web for images of paintings by famous artists, each time passing your Bing Search API key in an HTTP header. For each painting that it finds, it creates a series of [perceptual image hashes](https://www.pyimagesearch.com/2017/11/27/image-hashing-opencv-python/) of various bit depths. Perceptual hashes are useful for detecting images that are similar (but not necessarily identical) to each other, and are extremely useful for eliminating images that are too similar from image sets used to train image-classification models. You will learn more about perceptual image hashing in the next lab.

	Information about the images, including their widths, heights, URLs, and hashes, is assembled in memory in a [Pandas DataFrame](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html). Once the search is complete, the DataFrame is written to a table named "Paintings" in the Azure SQL database. The "Paintings" table is created if it doesn't exist, or replaced if it already exists.

1. Replace the following values in **load.py**. Then save the file.

	- Replace SERVER_NAME on line 23 with the server name you specified in Exercise 1, Step 3
	- Replace DATABASE_NAME on line 24 with the database name you specified in Exercise 1, Step 5
	- Replace ADMIN_USERNAME on line 25 with the server name you specified in Exercise 1, Step 3
	- Replace ADMIN_PASSWORD on line 26 with the server name you specified in Exercise 1, Step 3
	- Replace API_KEY on line 28 with the API key you copied in Exercise 2, Step 5

1. Select **Docker** from the Run Configuration drop-down and **load.py** from the Script drop-down to configure Workbench to run **load.py** in a Docker container. Then click the **Run** button.

	![Running load.py](Images/run-script.png)

	_Running load.py_

1. Wait for the run to complete and confirm that it completed successfully. It will probably take several minutes to run the first time since a Docker container image has to be built from a remote base image.

	![Successful run](Images/run-completed.png)

	_Successful run_

After the run, the Azure SQL database that you created in [Exercise 1](#Exercise1) holds the data that the script generated. in the next exercise, you will confirm that this is the case by examining the database.

<a name="Exercise5"></a>
## Exercise 5: View the contents of the database ##

In this exercise, you will use the Azure Portal to view the information regarding paintings by famous artists that was written to the Azure SQL database by the Python script in the previous exercise.

1. Return to the [Azure Portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa) in your browser and open the "mmlsparklab-rg" resource group that you created in [Exercise 1](#Exercise1). Then click the database that you created in the same exercise.

	![Opening the database](Images/open-database.png)

	_Opening the database_

1. Click **Query editor** in the menu on the left. Then click **Login** at the top of the blade, select **SQL server authentication** as the authorization type, enter the user name and password you specified in Exercise 1, and click **OK** to log in to the database.

	![Logging in to the database](Images/login-to-database.png)

	_Logging in to the database_

1. Type "SELECT * FROM dbo.Paintings" (without quotation marks) into the query window and click the **Run** button. Confirm that several database rows appear in the results window underneath.

	![Running a query](Images/run-query.png)

	_Running a query_

Scroll horizontally and vertically in the results window and examine the data displayed there. The results should include several hundred rows, each containing information about a painting by Picasso, Van Gogh, or Monet. This is the raw data that you will use to train a machine-learning model in [Lab 3](../3%20-%20Predict) after cleaning and preparing it in [Lab 2](../2%20-%20Process).

<a name="Summary"></a>
## Summary ##

In this lab, you created a dataset that will later be used to train a machine-learning model to recognize the artists of famous paintings. But before the model can be trained, the data requires cleaning. Among other things, it needs to be deduped so that the model isn't trained with multiple images of the same painting. You may now proceed to the next lab in this series — [Using the Microsoft Machine Learning Library for Apache Spark (MMLSpark) to Perform Image Classification, Part 2](../2%20-%20Process) — to get the cleaning process started.

---

Copyright 2018 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.
