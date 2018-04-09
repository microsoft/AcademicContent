# Machine learning hands-on lab (HOL) #
<a name="Overview"></a>
## Overview ##

Machine learning (ML) has become a critical tool for organizations to use for predictive analytics. ML uses algorithms to classify data and then make sophisticated extrapolations through predictive models. But ML can be cumbersome for data scientists who need to build and configure development environments with all the software and tools required.

Microsoft helps reduce the complexity of this process by offering the Data Science Virtual Machine (DSVM): a virtual-machine (VM) image built specifically for data-science workloads. The DSVM is hosted in Microsoft Azure, and it has editions built for Windows Server, Ubuntu Linux, and CentOS. The DSVM comes preconfigured with many popular open-source tools, including Jupyter and RStudio.

In this hands-on lab (HOL), you will create a Linux operating system (OS)-based DSVM, import a dataset, and then use the scikit-learn API to create an ML model to use with your dataset.

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

![CreateResource](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/CreateResource.jpg)

3. In the **Search** field, type **data science**. From the list of matching results, click **Data Science Virtual Machine for Linux (Ubuntu)**.

![FindDSVM](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/FindDSVM.jpg) 

4. Take a few moments to read the description of the DSVM for Linux (Ubuntu), and then click **Create**.

![CreateDSVM](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/CreateDSVM.jpg)

5. In the **Name** field, enter a name for your VM; for example, **MyDSVM**.

![CreateDSVM2](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/CreateDSVM2.jpg)

6. In the **VM disk type** field, select **SSD**.
7. In the **User Name** field, type a user name of your choice. Save this information, because you will use it to sign in to the VM later.
8. For **Authentication Type**, select **Password**.
9. In the **Password** field, enter a password of your choice. Save this information, because you will use it to sign in to the VM later.
10. In the **Subscription** drop-down menu, select your subscription.
11. In the **Resource Group** section, leave **Create New** selected, and then enter a name of your choice for the resource group in the field below; for example, **DataScienceGroup1**.
12. In the **Location** drop-down menu, ensure that a geographically close location is chosen.
13. Click **OK**.

At this stage, the Choose a Size page appears. Proceed to the next step.

### Step 2: Sizing the new VM and reviewing settings ###
1. On the **Choose A Size** page, click **View All**.

![ChooseSize](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/ChooseSize.jpg)

2. In the list of available VM types, select **DS1_V2 Standard**.

![alt text](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/ONE-002a.jpg "DSVM")

3. Click **Select**.
4. On the **Settings** page that appears, review the default settings, and then click **OK**. The Create page appears, displaying offer details and summary information.
5. Click **Create**.
6. Wait a few minutes while the DSVM is deployed. After it is deployed, you will see a dashboard for your new VM. At the top of the dashboard, you will see controls.

![alt text](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/StartStop.jpg "DSVM")

7. The **Start** button is not available, indicating that the new VM has already started.

<a name="Exercise2"></a>
## Exercise 2: Connect to the DSVM ##
In this exercise, you will use a local X2Go client to connect to your new VM in Azure.

1. If you have not already done so, download and install X2Go on your local device. (You can download it [here](https://wiki.x2go.org/doku.php/download:start).)
2. Open X2Go. If you see any security alerts related to firewalls, now or later during these exercises, click **Allow Access**.
3. If the Session Preferences dialog box does not open automatically, from the **Session** menu, click **New Session**.

![NewSession](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/NewSession.jpg)

4. Return to your web browser and to the Azure portal at https://portal.azure.com, which you opened in Exercise 1.
5. In the **Overview** section, which displays information about the new VM you have created, locate and copy the VM’s public IP address.
![alt text](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/ONE-006.jpg "DSVM")
6. Return to the **Session Preferences** dialog box in X2Go. Paste the IP address of the Azure VM, which you just copied, into the **Host** field.

![SessionPref](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/SessionPref.jpg)

7. In the **Login** field, type the user name you chose for your new VM in Exercise 1.
8. Change the **Session Type** setting to **XFCE**.
![alt text](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/17xfce.jpg "DSVM")
9. Click **OK**.
10. In the X2Go client window, begin a new session by clicking the **New Session** window on the right that displays the IP address you just pasted.

![NewSession2](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/NewSession2.jpg)

11. In the **New Session** window, supply the password you specified when you created the VM in Exercise 1, and then click **OK**.

![NewSession3](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/NewSession3.jpg)

12. If you see a message that the host key verification failed, click **Yes** to trust the host key.

![Failed](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Failed.jpg)

13. Wait a couple of minutes for a connection to the VM to establish.

After the connection to the VM completes, a new window opens displaying the VM desktop and then a web page.

![NewVM](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/NewVM.jpg)

14. As needed, resize the window displaying the desktop of the DSVM. By default, a webpage is displayed that provides information about the DSVM.
15. Minimize the web browser, take a moment to review the icons on the desktop, and then proceed to Exercise 3.

![NewVM2](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/NewVM2.jpg)

<a name="Exercise3"></a>
## Exercise 3: Download a dataset and prepare a Jupyter notebook ##

In this exercise, you will copy a dataset and a Jupyter file from GitHub to a new /notebooks/BnB directory on your DSVM. These files will be used to perform the ML practice in a Jupyter notebook in Exercise 4.

Perform the following procedures in the X2Go session window that is connected to the DSVM hosted on Azure.

### Step 1: Copying and decompressing the dataset ###
1. In the DSVM, open a terminal emulator by clicking on the appropriate icon at the bottom of the screen.

![alt text](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/term.jpg "DSVM")

2. At the command prompt in the terminal emulator, create and switch to a new directory named **BnB** within the **/notebooks** directory by entering the following three commands, one at a time:

```
cd notebooks
mkdir BnB
cd BnB
```

3. In the DSVM, open a web browser by clicking on the appropriate icon at the bottom of the screen.

![Browser](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Browser.jpg "DSVM")

4. Browse to the following address: https://github.com/ProwessInfo/AzureUniversityRedShirt/tree/master/Challenges/MachineLearningHOL/content
5. From the list of files in this directory, locate and click **listings.csv.gz**, and then click **Download** to save the file. The file will automatically save to the Downloads directory.
6. In the DSVM, use **File Manager** (available at the bottom of the screen) to move **listings.csv.gz** from the **Downloads** directory to the **/notebooks/BnB/** directory.

![FileManager](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/FileManager.jpg "DSVM")

7. The file now needs to be decompressed. Return to the terminal emulator, and type the following at the command prompt:

```
gunzip listings.csv.gz
```
The file listings.csv has now replaced listings.csv.gz in the /notebooks/BnB directory.

### Step 2: Saving the Jupyter Notebook file and opening the notebook ###

In this step, you will save a Jupyter Notebook document from GitHub to the /notebooks/BnB directory in your DSVM.

1. In the DSVM, return to the web browser, and then navigate to https://github.com/ProwessInfo/AzureUniversityRedShirt/tree/master/Challenges/MachineLearningHOL/content.
2. Click **Machine_Learning_HOL_Ex4.ipynb**, click **Raw** in the top-right portion of the screen, and then press Ctrl+S to save the file to the /notebooks/BnB/ directory.

![Raw](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Raw.jpg "DSVM")

You will now open the Jupyter Notebook web application and then the notebook you just saved.

3. In the DSVM, minimize all active windows. On the desktop, locate and double-click the Jupyter desktop-configuration file.

![Jupyter](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter.jpg "DSVM")

A UXTerm terminal opens, and then a webpage opens to http://localhost:8888/tree. Inside this webpage, the Jupyter Notebook web application displays the dashboard, which contains a number of directories and Jupyter notebooks.  The Jupyter Notebook dashboard maps to the /notebooks directory within the file structure of the DSVM.

**Note:** If Jupyter does not open for you, try the workaround steps in the [Appendix](#Appendix).

![Jupyter2](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter2.jpg "DSVM")

4. In the Jupyter Notebook dashboard displayed at http://localhost:8888, double-click to open the **/BnB** directory, and then double-click **Machine_Learning_HOL_Ex4.ipynb**.

![Jupyter3](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter3.jpg "DSVM")

The Machine_Learning_HOL_Ex4.ipynb notebook will require a few moments to complete loading in the browser.

5. If you receive a Kernel Not Found message, select **Python 3.5** from the drop-down menu, and then click **Set Kernel**.

Once the notebook is fully displayed, continue to Exercise 4.

![Jupyter4](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter4.jpg "DSVM")

<a name="Exercise4"></a>

## Exercise 4: Import data, clean data, and make predictions using Python/SciKit-Learn in a Jupyter notebook

*This exercise is performed in the Jupyter notebook you opened at the end of Exercise 3. The Jupyter notebook includes all of the instructions for the exercise, which includes a series of code samples to run.*

**Important: After you done with Exercise 4, be sure to shut down the DSVM in Azure.**

In this exercise, you will import data from the listings.csv file, clean the data, and then build a model to predict the price of a rental property. You should perform this entire exercise in the Jupyter notebook you opened at the end of Exercise 3.

### Stopping the DSVM
Before completing the lab, make sure you shut down the virtual machine you created in Microsoft Azure.

1. In a web browser, open the Azure Web Portal (http://portal.azure.com).
2. Close the X2Go window and then use the controls in the Azure Web Portal to stop the Data Science Virtual Machine. 
3. Close all open windows.

You have now completed the Machine Learning HOL.

<a name="Appendix"></a>

### Appendix: Alternate method to open your Jupyter notebook

There is a small chance that the steps outlined in Exercise 3, Step 2 for opening the Jupyter notebook might not work as intended. If that is the case for you, follow the steps in this workaround so that you can complete the lab:

1. Locate the Jupyter.desktop file on the desktop of the DSVM.

   ![Jupyter-fix-010](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-010.png "DSVM")

2. Right-click the Jupyter.desktop file and select **Open With > Open With“Visual Studio Code”**

   ![Jupyter-fix-020](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-020.png "DSVM")

3. Update `Path=` to `Path=$SDG_RUNTIME_DIR/jupyter`

   ![Jupyter-fix-030](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-030.png "DSVM")

4. Cut and paste `/anaconda/pkgs/notebook-5.4.0-py27_0/info/icon.png` over `/anaconda/pkgs/notebook-5.0.0-py27h3661c2b_2/info/icon.png`

   ![Jupyter-fix-040](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-040.png "DSVM")

5. The Jupyter shortcut will update on the desktop.

   ![Jupyter-fix-050](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-050.png "DSVM")

6. Open a terminal and run the following command: `jupyter notebook --generate-config`

   ![Jupyter-fix-060](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-060.png "DSVM")

7. Next, run the following command: `jupyter notebook password`

   ![Jupyter-fix-070](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-070.png "DSVM")

8. When requested, create a good password.

9. From the desktop, run the Jupyter server. Take note of the new URL.

   ![Jupyter-fix-080](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-080.png "DSVM")

10. Browse to <https://localhost:9999> and confirm the exception.

    ![Jupyter-fix-100](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-100.png "DSVM")

11. Log in using the password you created earlier.

    ![Jupyter-fix-110](https://github.com/ProwessInfo/AzureUniversityRedShirt/blob/master/Challenges/MachineLearningHOL/images/Jupyter-fix-110.png "DSVM")