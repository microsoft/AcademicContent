<a name="HOLTitle"></a>
# Getting Started with Azure #

---

<a name="Overview"></a>
## Overview ##

The entry point to Azure is the [Azure Portal](https://portal.azure.com), which you will become familiar with as you work through the labs. In order to use the portal, you must have an Azure subscription. When you consume Azure services through the portal — when, for example, you store data in a storage account or deploy a high-performance computing (HPC) cluster — those services are billed against your subscription. A free subscription has been provided for you, along with unique credentials for logging into the portal and using that subscription. These credentials and the subscription associated with them have been provided specifically for the purpose of working these labs. To work with Azure outside the scope of these labs, you will need to associate an Azure subscription with your personal Microsoft account or with a work/school account (also known as an *Office 365 account*) provided by your school or organization.

Although Azure services can be accessed from any operating system running on an any device, some of the tools you will use for today's labs require Microsoft Windows. Therefore, a virtual machine (VM) running Windows 10 and preconfigured with all the tools you will need has been provided for you. The purpose of this lab is to connect to the lab VM, log in to the Azure Portal, and confirm that you have a working subscription. In subsequent labs, you will use this subscription to create storage accounts, deploy Web apps, create machine-learning models, run Docker containers in Azure, and much more. 

> You can work the labs in this course without a VM if you have an active Azure subscription and are running Windows 10 with the proper tools installed. Each lab lists the tools required as well as links for downloading them. Moreover, all of the required tools are free. Here's a complete list in case you would like to configure a Windows 10 PC or laptop with everything needed for the labs:

>- [Visual Studio 2015 Community edition](https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx) or higher
- [Visual Studio Code](https://code.visualstudio.com/download)
- [PHP for Windows](http://windows.php.net/download/)
- [Microsoft Azure Storage Explorer](http://storageexplorer.com/)
- [Git](https://git-scm.com/downloads) version 2.0 or higher
- [Node.js](https://nodejs.org/en/download/) version 4 or higher
- [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)
- [Docker client for Windows](https://get.docker.com/builds/Windows/x86_64/docker-latest.zip)

> In each case, it is recommended that you install the latest stable release of the tools to ensure compatibility with the lab exercises.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will:

- Connect to the lab VM
- Log in to the Azure Portal
- View the Azure subscription associated with your account

<a name="Prerequisites"></a>
### Prerequisites ###

The following is required to complete this hands-on lab:

- An HTML5 browser such as Chrome 16 or higher, Firefox 11 or higher, Internet Explorer 10 or higher, or Microsoft Edge
- A URL provided by the instructor for accessing the lab VM

For a complete list of requirements for connecting to and using the lab VM, visit https://microsoftevents.learnondemand.net/Lab/HyperVSupport.

---
<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Connect to the lab VM](#Exercise1)
- [Exercise 2: Access the Azure Portal and view subscription information](#Exercise2)

Estimated time to complete this lab: **15** minutes.

---

<a name="Exercise1"></a>
## Exercise 1: Connect to the lab VM ##

In this exercise, you will use your browser to connect to a Windows 10 virtual machine (VM) that has been prepared for you. The VM contains all the tools you need to work the labs in this course, including Visual Studio 2015, Visual Studio Code, Node.js, and others.

1. Open your browser and navigate to the lab URL provided to you by the instructor.

1. After a few moments, the VM's Windows 10 desktop appears in your browser. If you are asked whether you want "your PC" (the virtual machine) to be discoverable on the network, click **No**.

    ![The virtual-machine desktop](Images/desktop.png)

    _The virtual-machine desktop_

1. If you would like for the VM to occupy the entire screen, click **Display** in the menu bar at the top of the page and select **Full Screen**. (You can exit full-screen mode at any time by clicking **Display** again and selecting **Exit Full Screen**.)

1. In the "Content" tab on the right side of the screen are the credentials you will use to log in to the Azure portal and access the subscription that has been set up for you. Make note of these credentials, because you will need them in the next exercise and any time you go to the Azure Portal and are asked to log in.

    ![Your Azure credentials](Images/credentials.png)

    _Your Azure credentials_

Now that you are connected to the lab VM, the next task is to log in to the Azure Portal and confirm that a subscription has been created for you.

<a name="Exercise2"></a>
## Exercise 2: Access the Azure Portal and view subscription information ##

In this exercise, you will log in to the Azure Portal and learn how to view the subscriptions associated with your account.

1. In the VM, click the Edge icon in the task bar at the bottom of the desktop to open Microsoft Edge.

    ![Opening Microsoft Edge](Images/edge-icon.png)

    _Opening Microsoft Edge_

1. Type "portal.azure.com" (without quotation marks) into the browser's address bar to go to the Azure Portal.

1. When asked to log in, enter the user name and password displayed in the "Content" tab on the right side of the screen under "Azure Credentials." Then click the **Sign In** button.

    ![Logging in to the Azure Portal](Images/sign-in.png)

    _Logging in to the Azure Portal_

1. Click **Subscriptions** in the ribbon on the left side of the page.

    ![Viewing Azure subscriptions](Images/azure-portal.png)

    _Viewing Azure subscriptions_

1. Confirm that **Azure Pass** appears among the list of subscriptions associated with your account, and that the subscription status is **Active**.

    ![Your Azure Pass subscription](Images/subscriptions.png)

    _Your Azure Pass subscription_

You can click a subscription to retrieve billing and usage information for it. However, since your Azure Pass subscription is brand new, no data is presently available. Make a note to return to the "Subscriptions" blade later today and see if there is billing and usage information available for your Azure Pass.

### Summary ###

In this hands-on lab, you learned how to:

- Log in to the Azure Portal
- View the Azure subscriptions associated with your account

The portal will be your home for everything Azure and your gateway for using the cloud.

---

Copyright 2016 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the MIT License. You may use them according to the license as is most appropriate for your project. The terms of this license can be found at https://opensource.org/licenses/MIT.