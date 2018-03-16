# Machine learning hands-on lab (HOL) #
<a name="Overview"></a>
## Overview ##

In this hands-on lab (HOL), you are a newly hired data scientist for a company building an application named ContosoBNB, which is modeled after a short-term vacation rental platform like [Airbnb](https://www.airbnb.com/). Your goal is to begin building, training, and tuning a machine learning model to suggest a rental rate that maximizes revenue for rental property owners.

First, you will reduce the complexity of building your development environment by creating an instance of the Data Science Virtual Machine (DSVM): a virtual-machine (VM) image built specifically for data-science workloads. The DSVM is hosted in Microsoft Azure, and it has editions built for Windows Server, Ubuntu Linux, and CentOS Linux. The DSVM comes preconfigured with many popular open-source tools, including Jupyter and RStudio. This VM also contains scikit-learn, which is a free, open-source machine learning toolkit for Python programmers.

After you create a Linux operating system (OS)-based DSVM and connect to it, you will import a dataset and then use the scikit-learn API to create and refine an ML model to use with your dataset.

<a name="Objectives"></a>
### Objectives ###

In this HOL, you will learn how to:

- Create a Linux OS-based DSVM
- Connect to the DSVM using a remote-desktop client
- Save a data file from GitHub to the DSVM
- Save a Jupyter Notebook file from GitHub to the DSVM
- Use pandas to filter columns in a dataset
- Use pandas to quantize values in a column
- Use scikit-learn to split the data into separate datasets for training and testing
- Use scikit-learn to create an ML model
- Use scikit-learn to analyze the model's accuracy

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this HOL:

- An active Azure subscription; if you don't have one, [sign up for a free trial](http://aka.ms/WATK-FreeTrial)
- [X2Go](https://wiki.x2go.org/doku.php/download:start), an [Xfce](https://xfce.org/) remote-desktop client

<a name="Resources"></a>
### Resources ###

This lab uses an existing dataset (released under public domain) to model real-world property listings with their associated details. The complete dataset can be found [here](http://insideairbnb.com/get-the-data.html).

<a name="Exercises"></a>
## Exercises ##

This HOL includes the following exercises:

- [Exercise 1: Create a DSVM](#Exercise1)
- [Exercise 2: Connect to the DSVM](#Exercise2)
- [Exercise 3: Download a dataset and prepare a Jupyter notebook](#Exercise3)
- [Exercise 4: Import data, clean data, and make predictions using Python/scikit-learn in a Jupyter notebook](#Exercise4)

<a name="Exercise1"></a>
## Exercise 1: Create a DSVM ##

In this exercise, you will create an instance of the DSVM for Linux in Azure. The DSVM for Linux is a VM image in Azure that includes many preinstalled and configured data-science and development tools. You can read a longer description about the many tools and features available in the DSVM [here](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm-ubuntu). 

### Step 1: Creating the DSVM in Azure ###

1. In a web browser, open the [Azure portal](https://portal.azure.com/) at https://portal.azure.com, and then sign in with your Microsoft account.
2. From the left-side menu, click the **+** sign to add a new resource.

![CreateResource](images/CreateResource.jpg)

3. In the **Search** field, type **data science**. From the list of matching results, click **Data Science Virtual Machine for Linux (Ubuntu)**.

![FindDSVM](images/FindDSVM.jpg) 

4. Take a few moments to read the description of the DSVM for Linux (Ubuntu), and then click **Create**.

![CreateDSVM](images/CreateDSVM.jpg)

5. In the **Name** field, enter a name for your VM; for example, **MyDSVM**.

![CreateDSVM2](images/CreateDSVM2.jpg)

6. In the **VM disk type** field, select **SSD**.

7. In the **User Name** field, type a user name of your choice. Save this information, because you will use it to sign in to the VM later.

8. For **Authentication Type**, select **Password**.

9. In the **Password** field, enter a password of your choice that meets the following requirements:

   - Must be between 12 and 72 characters long 
   - Must contain 3 of the following:
     - 1 lowercase letter 
     - 1 uppercase letter 
     - 1 number 
     - 1 special character that is not ‘\’ or ‘-‘ 

   Save your username and password, because you will use it to sign in to the VM later. 

10. In the **Subscription** drop-down menu, select your subscription.

11. In the **Resource Group** section, leave **Create New** selected, and then enter a name of your choice for the resource group in the field below; for example, **DataScienceGroup1**.

    A resource group in Azure is a container for the resources used to run an application. Resource groups help administrators organize monitoring, access control, provisioning, and billing. Generally, items in one resource group are intended to have the same lifecycle, so you can easily deploy, update, and delete them as a group.

12. In the **Location** drop-down menu, ensure that a geographically close location is chosen.

13. Click **OK**.

At this stage, the Choose a Size page appears. Proceed to the next step.

### Step 2: Sizing the new VM and reviewing settings ###
1. On the **Choose A Size** page, click **View All**.

![ChooseSize](images/ChooseSize.jpg)

2. In the list of available VM types, select **DS1_V2 Standard**.

![ONE-002a](images/ONE-002a.jpg "DSVM")

3. Click **Select**.
4. On the **Settings** page that appears, review the default settings, and then click **OK**. The Create page appears, displaying offer details and summary information.
5. Click **Create**.
6. Wait a few minutes while the DSVM is deployed. After it is deployed, you will see a dashboard for your new VM. At the top of the dashboard, you will see controls.

![StartStop](images/StartStop.jpg "DSVM")

7. The **Start** button is not available, indicating that the new VM has already started.

<a name="Exercise2"></a>
## Exercise 2: Connect to the DSVM ##
In this exercise, you will use a local X2Go client to connect to your new VM in Azure.

1. If you have not already done so, download and install X2Go on your local device. (You can download it [here](https://wiki.x2go.org/doku.php/download:start).)
2. Open X2Go. If you see any security alerts related to firewalls, now or later during these exercises, click **Allow Access**.
3. If the Session Preferences dialog box does not open automatically, from the **Session** menu, click **New Session**.

![NewSession](images/NewSession.jpg)

4. Return to your web browser and to the Azure portal at https://portal.azure.com, which you opened in Exercise 1.
5. In the **Overview** section, which displays information about the new VM you have created, locate and copy the VM’s public IP address.
![ONE-006](images/ONE-006.jpg "DSVM")
6. Return to the **Session Preferences** dialog box in X2Go. Paste the IP address of the Azure VM, which you just copied, into the **Host** field.

![SessionPref](images/SessionPref.jpg)

7. In the **Login** field, type the user name you chose for your new VM in Exercise 1.
8. Change the **Session Type** setting to **XFCE**.
![17xfce](images/17xfce.jpg "DSVM")
9. Click **OK**.
10. In the X2Go client window, begin a new session by clicking on the name **New session** within the window on the right that displays the IP address you just pasted.

![NewSession2](images/NewSession2.jpg)

11. In the **New Session** window, supply the password you specified when you created the VM in Exercise 1, and then click **OK**.

![NewSession3](images/NewSession3.jpg)

12. If you see a message displaying a public key hash and asking whether you trust the host key, click **Yes**.

![Failed](images/Failed.jpg)

13. Wait a couple of minutes for a connection to the VM to establish. If you are on a Macintosh and are prompted to install XQuartz, follow the link provided to install XQuartz, log back off and then back on, and finally return to step 10. 

After the connection to the VM completes, a new window opens displaying the VM desktop and then a web page.

![NewVM](images/NewVM.jpg)

14. As needed, resize the window displaying the desktop of the DSVM. By default, a webpage is displayed that provides information about the DSVM.
15. Minimize the web browser, take a moment to review the icons on the desktop, and then proceed to Exercise 3.

![NewVM2](images/NewVM2.jpg)

<a name="Exercise3"></a>
## Exercise 3: Download a dataset and prepare a Jupyter notebook ##

In this exercise, you will copy a dataset and a Jupyter file from GitHub to a new /notebooks/BnB directory on your DSVM. These files will be used to perform the ML practice in a Jupyter notebook in Exercise 4.

Perform the following procedures in the X2Go session window that is connected to the DSVM hosted on Azure.

### Step 1: Copying and decompressing the dataset ###
1. In the DSVM, open a terminal emulator by clicking on the appropriate icon at the bottom of the screen.

![term](images/term.jpg "DSVM")

2. At the command prompt in the terminal emulator, create and switch to a new directory named **BnB** within the **~/notebooks** directory by entering the following three commands, one at a time:

```
cd notebooks
mkdir BnB
cd BnB
```

3. In the DSVM, open a web browser by clicking on the appropriate icon at the bottom of the screen.

![Browser](images/Browser.jpg "DSVM")

4. Browse to the following address: https://github.com/MSFTImagine/computerscience/tree/master/Azure%20University%20Tour/MachineLearningHOL/content
5. From the list of files in this directory, locate and click **listings.csv.gz**, and then click **Download** and **Save File** to save the file. The file will automatically save to the Downloads directory.
6. From the list of files in this same /content directory, locate and click **iPY_run_annotated.png**, and then click **Download**. Right-click the image in the browser and select **Save Image As**. Choose to save the file in the /notebooks/BnB/ directory.
7. In the DSVM, use **File Manager** (available at the bottom of the screen) to move the **listings.csv.gz** file from the **Downloads** directory to the **/notebooks/BnB/** directory.

![FileManager](images/FileManager.jpg "DSVM")

7. The **listings.csv.gz** file now needs to be decompressed. Return to the terminal emulator, and if necessary, use the **cd** command to navigate to the /notebooks/BnB/ directory. 
8. Type the following at the command prompt:

```
gunzip listings.csv.gz
```
The file **listings.csv** has now replaced **listings.csv.gz** in the /notebooks/BnB/ directory.

### Step 2: Saving the Jupyter Notebook file and opening the notebook ###

In this step, you will save a Jupyter Notebook document from GitHub to the /notebooks/BnB directory in your DSVM.

1. In the DSVM, return to the web browser, and then navigate to https://github.com/MSFTImagine/computerscience/tree/master/Azure%20University%20Tour/MachineLearningHOL/content
2. Click **Machine_Learning_HOL_Ex4.ipynb**, click **Raw** in the top-right portion of the screen, and then press Ctrl+S to save the file to the /notebooks/BnB/ directory.

![Raw](images/Raw.jpg "DSVM")

You will now open the Jupyter Notebook web application and then the notebook you just saved.

3. In the DSVM, minimize all active windows. On the desktop, locate and double-click the Jupyter desktop-configuration file.

![Jupyter](images/Jupyter.jpg "DSVM")

A UXTerm terminal opens, and then a webpage opens to http://localhost:8888/tree. Inside this webpage, the Jupyter Notebook web application displays the dashboard, which contains a number of directories and Jupyter notebooks.  The Jupyter Notebook dashboard maps to the /notebooks directory within the file structure of the DSVM.

![Jupyter2](images/Jupyter2.jpg "DSVM")

4. In the Jupyter Notebook dashboard displayed at http://localhost:8888, double-click to open the **/BnB** directory, and then double-click **Machine_Learning_HOL_Ex4.ipynb**.

![Jupyter3](images/Jupyter3.jpg "DSVM")

The Machine_Learning_HOL_Ex4.ipynb notebook will require a few moments to complete loading in the browser.

5. If you receive a Kernel Not Found message, select **Python 3.5** from the drop-down menu, and then click **Set Kernel**.

Once the notebook is fully displayed, continue to Exercise 4.

![Jupyter4](images/Jupyter4.jpg "DSVM")

<a name="Exercise4"></a>

## Exercise 4: Import data, clean data, and make predictions using Python/SciKit-Learn in a Jupyter notebook

*This exercise is performed in the Jupyter notebook you opened at the end of Exercise 3. The Jupyter notebook contains all of the instructions for the exercise, including a series of code samples to run.*

**Important: After you done with Exercise 4, be sure to shut down the DSVM in Azure.**

In this exercise, you will import data from the listings.csv file, clean the data, and then build a model to predict the price of a rental property. You should perform this entire exercise in the Jupyter notebook you opened at the end of Exercise 3.

### Stopping the DSVM
Before completing the lab, make sure you shut down the virtual machine you created in Microsoft Azure.

1. Close the X2Go window.

2. Return to the Azure portal at https://portal.azure.com. Locate and open the settings for the new DSVM that you created as part of this HOL.

3. In the controls, click **Stop** to stop the DSVM.

   ![StartStop2](images/StartStop2.jpg)

This brings us to the end of the Machine Learning HOL. 

### Important: Remember to shut down the virtual machine in the Azure portal after you have completed this HOL.
