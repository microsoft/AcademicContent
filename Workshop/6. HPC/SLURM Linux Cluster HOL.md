<a name="HOLTitle"></a>
# Creating and Using a SLURM Cluster #

---

<a name="Overview"></a>
## Overview ##

The [Simple Linux Utility for Resource Management](https://computing.llnl.gov/linux/slurm/overview.html) (SLURM), also known as the *SLURM Workload Manager*, is a free and open-source job scheduler for Linux that excels at distributing heavy computing workloads across clusters of machines and processors. It is used on more than half of the world's largest supercomputers and High-Performance Computing (HPC) clusters, and it enjoys widespread use in the research community for jobs that require significant CPU resources.

Azure makes it easy to deploy SLURM clusters and size them to handle workloads large and small. In this lab, you will create a SLURM cluster consisting of three nodes (VMs) and run a Python script on it to convert a batch of color images to grayscale. You will get first-hand experience deploying HPC clusters in Azure as well as managing and using the nodes in a cluster. And you will learn how easy it is to bring massive computing power to bear on problems that require it when you use the cloud.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create a SLURM cluster using an Azure Resource Manager template
- Copy local resources to a SLURM cluster
- Remote into the nodes in a SLURM cluster
- Run jobs on a SLURM cluster
- Start and stop nodes in a SLURM cluster
- Use the Azure Resource Manager to delete a SLURM cluster

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- A Microsoft Azure subscription - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)
- The Microsoft Azure Storage Explorer (provided for you in the lab VM)
- PuTTY (provided for you in the lab VM)

---
<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create a resource group to hold the SLURM cluster](#Exercise1)
- [Exercise 2: Create a SLURM cluster using an Azure Quickstart template](#Exercise2)
- [Exercise 3: Create storage containers and upload images](#Exercise3)
- [Exercise 4: Prepare the job scripts](#Exercise4)
- [Exercise 5: Copy the job scripts, configure the nodes, and run the job](#Exercise5)
- [Exercise 6: View the converted images](#Exercise6)
- [Exercise 7: Suspend the SLURM cluster](#Exercise7)
- [Exercise 8: Delete the SLURM cluster](#Exercise8)

Estimated time to complete this lab: **60** minutes.

<a name="Exercise1"></a>
## Exercise 1: Create a resource group to hold the SLURM cluster

In this exercise, you will create a resource group to contain the SLURM cluster and the Azure resources used by the cluster, which include virtual Network Interface Cards, IP addresses, storage accounts, and more. Resource groups are a feature of Microsoft Azure that allow you to combine the resources that comprise an application into a unit so entire applications can be deployed, managed, and even deleted with a few simple steps. It is considered best practice to place applications that contain multiple resources in a resource group.

1. Connect to the Visual Studio VM that you deployed in the first lab.

1. In the VM, open your browser and log in to the [Azure Portal](https://portal.azure.com).

1. In the portal, click **+ NEW -> Management -> Resource Group** to display the "Resource group" blade.

    ![Adding a new resource group](Images/create-resource-group-blade.png)

    _Adding a new resource group_

1. Enter a name for the resource group that you wish to create — for example, "SLURMLabResourceGroup" (without quotation marks). Resource-group names do not have to be globally unique as storage-account names do, but they must be unique to a subscription.

	After entering the name, click **Resource group location** and choose the location nearest you. Leave **Pin to dashboard** checked so the resource group appears on your dashboard in the Azure Portal. Once you're finished, click the **Create** button at the bottom of the blade.

	> If there are any input errors, such as spaces in the resource-group name, the fields containing the errors will be flagged with red excalamation points. Hover the mouse over an exclamation point for help resolving the error.

    ![Creating a resource group](Images/create-resource-group.png)

    _Creating a resource group_

1. After a few moments, the new resource group will appear in a blade in the Azure Portal.

    ![The new resource group](Images/empty-resource-group-blade.png)

    _The new resource group_

You created a resource group, but that group is currently empty. The next step is to create a cluster to go in it.

<a name="Exercise2"></a>
## Exercise 2: Create a SLURM cluster using an Azure Quickstart template

The Azure Resource Manager allows you to provision applications using declarative templates. A template contains a complete description of everything that makes up the application, including virtual machines, databases, Web apps, IP addresses, and other resources. Templates can include parameters that users will be prompted to fill in each time an application is deployed. Templates can also invoke scripts to initialize resources to a known and consistent state.

As an example, suppose you have built an HPC cluster that includes virtual machines and other Azure resources. With a template, you can script the creation of the entire application and optionally the data that goes with it. This makes it easy for others to spin up instances of the application. To learn more about Azure Resource Manager templates, you can read the [documentation](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/) online.

For this lab, you will use a deployment template built by the Azure team. You will find many useful templates on the [Azure Quickstart Templates](http://azure.microsoft.com/en-us/documentation/templates/) page and in the Quickstart templates [GitHub repository](https://github.com/Azure/azure-quickstart-templates). Most people prefer the GitHub location because it is updated more often and offers an easy way to browse changes made to the templates.

The template you are going to use, which you can [view here](https://github.com/Azure/azure-quickstart-templates/tree/master/slurm) on GitHub, is titled "Deploy a slurm cluster." It performs the following steps:

- Creates a storage account for the virtual machines
- Deploys three Ubuntu servers named "master," "worker0," and "worker1"
- Creates a private network for the three servers
- Creates a public IP address for master server
- Creates the same user account on all three servers
- Executes a shell script to configure ssh and install and configure SLURM on all three servers

Let's get started!

1. In your browser, navigate to [https://github.com/Azure/azure-quickstart-templates/tree/master/slurm](https://github.com/Azure/azure-quickstart-templates/tree/master/slurm). In the middle of the page, click the **Deploy to Azure** button. This will load the template into a new instance of the Azure Portal. You may be asked to sign in again; if so, sign in using your Microsoft account.

    ![Deploying from GitHub](Images/template-click-deploy-button.png)

     _Deploying from GitHub_

1. In the Azure Portal, you will be prompted to enter values for various parameters defined in the template:

    ![The "Parameters" blade](Images/template-parameters.png)

     _The "Parameters" blade_

	For **DNSNAME** and **NEWSTORAGEACCOUNTNAME**, enter names that are unique to Azure. *Remember that storage account names can only contain numbers and lowercase letters*. Make both names as unique as possible, even factoring in your initials, birth date, etc. A name that is unique right now might not be unique several minutes from now while the deployment is in progress.

	For **ADMINUSERNAME** and **ADMINPASSWORD**, enter a user name and password you can easily remember. You will need them to log into the cluster in subsequent exercises.

	> Limited error checking is performed on the user name and password you enter. For example, if you include a space in the user name or password, or enter a password that is less than 8 characters in length, the deployment will fail with a cryptic error message. In addition, user names and passwords should be at 8 least characters in length, but no longer than 32 characters.

	Accept the default values for **VMSIZE** and **SCALENUMBER**. The latter specifies the number of worker nodes in the cluster. The template automatically creates an additional VM to serve as the master node.

	For **LOCATION**, enter the same location that you selected for the resource group in Exercise 1.

	Once these values are entered, click the **OK** button at the bottom of the blade.

1. In the "Custom deployment" blade, under **Resource group**, select the resource group you created in Exercise 1. Under **Location**, select the same location that you selected for the resource group.

	Before you can create the cluster, you must accept the legal terms. Click **Review legal terms**, review the terms in the new blade that appears, and then click **Create** at the bottom of that blade to indicate that you accept the terms.

	Once that's done, click the **Create** button at the bottom of the "Custom deployment" blade to begin deploying your SLURM cluster.

    ![The "Custom deployment" blade](Images/custom-deployment.png)

     _The "Custom deployment" blade_

1. Deploying the SLURM cluster can take 10 minutes or more. You can monitor the status of the deployment by opening the resource group's blade. If you pinned the resource group you created in [Exercise 1](#Exercise1), click the tile on the dashboard to open the blade. If you did not pin the resource group, click **Resource group** in the ribbon on the left side of the portal, and then click the resource group name. Either way, you will see a blade like the one below. "Deploying" will change to "Succeeded" when the deployment has completed successfully.

    ![Checking the deployment](Images/template-status-in-resource.png)

     _Monitoring the deployment_

	> As a deployment occurs, you can get more information about what's happening by clicking the "Events" chart at the bottom of the blade.

1. When the deployment completes successfully, you'll see all the resources that comprise the cluster in the resource group.

    ![Successful deployment](Images/completed-deployment.png)

     _Successful deployment_

Congratulations! You just deployed a Linux cluster using an Azure Quickstart template. Now let's create a couple of storage containers to hold the color images that the cluster will process and the grayscale images that the cluster will generate from the color images.

<a name="Exercise3"></a>
## Exercise 3: Create storage containers and upload images

In [Exercise 5](#Exercise5), you will run a Python script on the cluster to generate grayscale images from color images. That script requires a set of color images as well as two blob storage containers: one for input and one for output. In this exercise, you'll use the cross-platform [Microsoft Azure Storage Explorer](http://storageexplorer.com/) to create the containers and upload the images.

1. Start the Microsoft Azure Storage Explorer, which is already installed in the VM you're using. If you're prompted for credentials, sign in with the user name and password for your Microsoft account.

1. In the Storage Explorer window, find the storage account that was created when you deployed the SLURM cluster. Expand the list of items underneath that storage account and click the small arrow next to **Blob Containers** to see a list of containers. There is already one blob container named "vhd." It was created when the cluster was deployed and holds the virtual hard disks (VHDs) for the nodes in the cluster.

	Right-click **Blob Containers** and select **Create Blob Container** from the menu.

    ![Creating a new container](Images/create-new-blob-container.png)

    _Creating a new container_

1. Type "input" (without quotation marks) and press **Enter** to create a container named "input."

1. Repeat this procedure to create a blob container named "output."

1. Double-click the "input" container to show its contents. Then click the **Upload** button and select **Upload Files** from the menu.

    ![Uploading images to the "input" container](Images/upload-images.png)

    _Uploading images to the "input" container_

1. Click the **...** button to the right of the field labeled "Files." In the ensuing dialog, navigate to this lab's "ColorImages" subdirectory and select all the files in that subdirectory. Then close the dialog and click  the **Upload** button.

    ![Uploading files to blob storage](Images/upload-files-dialog.png)

    _Uploading files to blob storage_

1. Confirm that all 49 files were uploaded to the "input" container.

    ![Uploaded images](Images/uploaded-images.png)

    _Uploaded images_

You now have containers to hold input and output and a collection of color images in the input container. The next step is to prepare the scripts needed to configure the cluster and process the images.

<a name="Exercise4"></a>
## Exercise 4: Prepare the job scripts

With the SLURM cluster up and running and the images uploaded to blob storage, you are now ready to modify the job scripts with information about the cluster's storage account and admin user. Here is a list of those scripts and a description of what they do:

- slurmdemo.py - The Python script that runs on the SLURM nodes to process the images
- slurmdemo.setup.sh - The script that configures the SLURM nodes with the dependencies and packages required by the Python script
- slurmdemo.sh - The SLURM control script that runs on each of the nodes to perform a single unit of work

You can use any text editor that you're comfortable with. There is no need to be concerned about how line breaks are encoded, because after uploading these scripts to the cluster's master node, you will run a utility to insert Linux-style line breaks into each script.

1. Return to the Azure Portal and open the resource group you created in [Exercise 1](#Exercise1). In the resource group's blade, click the storage account to open a blade for the storage account.

    ![Opening the storage account](Images/open-storage-account.png)

    _Opening the storage account_

1. In the storage-account blade, click the key icon to open the "Access keys" button. Leave the "Access keys" blade open in your browser as you work on the script files.

    ![Storage-account keys](Images/access-keys-from-storage.png)

    _Storage-account keys_

1. Navigate to this lab's "hpc-resources" subdirectory. Then open **slurmdemo.py** in a text editor and find the following section near the top of the file:

	<pre>
    #######################################################
    # Update these two variables to those for your account.
    #######################################################
    ACCOUNT_NAME = 'account_name'
    ACCOUNT_KEY = 'account_key'
    #######################################################
    </pre>

1. Switch back to the Azure Portal. In the "Access keys" blade, click the button to the right of the **STORAGE ACCOUNT NAME** field to copy the storage account's name to the clipboard.

1. In **slurmdemo.py**, replace *account_name* with the account name you just copied. Make sure the account name is enclosed in single quotes.

1. In the "Access keys" blade, copy the storage account's primary access key (KEY1) to the clipboard.

1. In **slurmdemo.py**, replace *account_key* with the key you just copied. Make sure it is enclosed in single quotes. The modified code will look something like this:

	<pre>
    #######################################################
    # Update these two variables to those for your account.
    #######################################################
    ACCOUNT_NAME = 'jrslurmlabstorage'
    ACCOUNT_KEY = 'jWdpHOyfIdJ+VdrtgJrz+8+qrunWbGym/ULY...'
    #######################################################
    </pre>

1. Save your changes to **slurmdemo.py** and close the text editor.

1. Still in the "hpc-resources" directory, open **slurmdemo.setup.sh** in your text editor. Search for all instances of *adminuser* and replace them with the ADMINUSERNAME property you specified in the template in [Exercise 2](#Exercise2). **There are six instances that need to be replaced**.

1. Save your changes to **slurmdemo.setup.sh** and close the text editor.

You've updated the script files with the necessary information. Now you're ready for the next step: configuring the SLURM cluster and using it to process the images.

<a name="Exercise5"></a>
## Exercise 5: Copy the job scripts, configure the nodes, and run the job

In this exercise, you will upload the slurmdemo.* files to the master node of the SLURM cluster and use those files to configure the cluster and run the job. To remote into the cluster, you'll use a popular Windows SSH client named PuTTY, which is already installed in your VM.

1. The deployment template that you used to create the SLURM cluster created an IP address and a publicly addressable Domain Name System (DNS) name for the master node. To find the node's DNS name, open the blade for the resource group you created in [Exercise 1](#Exercise1) in the Azure Portal. Then click **publicips**. Copy the DNS name from the "publicips" blade to the clipboard.

	> If you move the mouse to the right of the DNS name, a button will magically appear that lets you copy the DNS name to the clipboard.

    ![Finding the public DNS name for the master SLURM node](Images/copy-dns-name.png)

    _Finding the public DNS name for the master SLURM node_

1. Start PuTTY and paste the DNS name for the master node into the **Host Name (or IP address)** field. Then click the **Open** button to initiate a Secure Shell (SSH) connection.

	> Because this is the first time you have connected to the master node, you will be prompted with a warning dialog asking if you trust this host. Since the host is one you created, click **Yes**.

    ![Connecting with PuTTY](Images/copy-putty-host.png)

    _Connecting with PuTTY_

1. A PuTTY terminal window will appear and you will be prompted to **login as**. Log in with the user name and password you entered into the ADMINUSERNAME and ADMINPASSWORD fields of the deployment template in [Exercise 2](#Exercise2). After logging in, you should see something similar to the following:

    <pre>
    login as: XXXXXXXXXX
    XXXXXXXXXX@jrslurmlab.westus.cloudapp.azuire.com's password:
    Welcome to Ubuntu 15.04 (GNU/Linux 3.19.0-25-generic x86_64)

      Documentation:  https://help.ubuntu.com/

      System information as of Sun Aug  9 03:33:04 UTC 2015

      System load:  0.09              Processes:           104
      Usage of /:   4.3% of 28.42GB   Users logged in:     0
      Memory usage: 5%                IP address for eth0: 10.0.0.254
      Swap usage:   0%

      Graph this data and manage this system at:
        https://landscape.canonical.com/

      Get cloud support with Ubuntu Advantage Cloud Guest:
        http://www.ubuntu.com/business/services/cloud

    12 packages can be updated.
    2 updates are security updates.

    The programs included with the Ubuntu system are free software;
    the exact distribution terms for each program are described in the
    individual files in /usr/share/doc/*/copyright.

    Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
    applicable law.

    To run a command as administrator (user "root"), use "sudo <command>".
    See "man sudo_root" for details.
    </pre>

1. To copy files to the master node, you will use PuTTY's Secure Copy utility, pscp.exe. Open a Command Prompt window and navigate to the directory containing the scripts you modified in [Exercise 4](#Exercise4).
 
1. Execute the following command, replacing _adminuser_ (in two places) with the cluster's ADMINUSERNAME and _masterDNS_ with the DNS name on the clipboard. When prompted, enter your ADMINPASSWORD.

    <pre>
    "C:\Program Files (x86)\PuTTY\pscp" *.py sl*.sh <i>adminuser</i>@<i>masterDNS</i>:/home/<i>adminuser</i>
    </pre>

	If the copy is successful, you will see output similar to the following:

    <pre>
    azureuser@jrslurmwin.westus.cloudapp.azure.com's password:
    slurmdemo.py              | 5 kB |   5.1 kB/s | ETA: 00:00:00 | 100%
    slurmdemo.setup.sh        | 1 kB |   1.9 kB/s | ETA: 00:00:00 | 100%
    slurmdemo.sh              | 0 kB |   0.5 kB/s | ETA: 00:00:00 | 100%
    </pre>

1. To be certain that the script files contain Linux-style line endings ("/r" rather than "/r/n"), execute the following commands in the PuTTY terminal window to install and run the dos2unix conversion program:

    <pre>
    sudo apt-get install dos2unix
    dos2unix -k -o slurm*
    </pre>

1. Now execute the command below to configure the nodes in the cluster. It typically takes 5 to 10 minutes to run.

    <pre>
    sh slurmdemo.setup.sh
    </pre>

1. Once slurmdemo.setup.sh has finished, it is time to put the cluster to work converting the color images in the "input" container into grayscale images in the "output" container. Execute the following command in the PuTTY terminal window to start the job:

    <pre>
    python slurmdemo.py
    </pre>

	> As the job is running, you can use the **sinfo** command to check the status of the job.

Next, you'll check the output to verify that the job ran correctly.

<a name="Exercise6"></a>
## Exercise 6: View the converted images

If the job ran successfully, the grayscale images generated from the color images in the input container will be in the output container you created in [Exercise 3](#Exercise3). In this exercise, you will check the contents of that container.

1. Launch the Microsoft Azure Storage Explorer if it isn't already running.

1. In Storage Explorer, double-click the container named "output" to see its contents. Then double-click one of the blobs in the container.

    ![Contents of the output container](Images/job-output.png)

    _Contents of the output container_

1. When the downloaded image opens, confirm that it's a grayscale image, not a color image. To be sure, download a few other images, too. If the images are grayscale, congratulations! You have a working SLURM cluster.

You now know how to deploy and configure SLURM clusters and run jobs on them. But when those clusters aren't being used, you should shut them down to avoid incurring unnecessary charges. The next exercise explains how.

<a name="Exercise7"></a>
## Exercise 7: Suspend the SLURM cluster

When virtual machines are running, you are being charged — even if the VMs are idle. Therefore, it's advisable to stop virtual machines when they are not in use. You will still be charged for storage, but that cost is typically insignificant compared to the cost of an active VM. The Azure Portal makes it easy to stop virtual machines. VMs that you stop are easily started again later so you can pick up right where you left off.

1. In the Azure Portal, open the blade for the resource group you created in [Exercise 1](#Exercise1). Click "worker1" to open a blade for the virtual machine named "worker1." Then click the **Stop** button to stop the virtual machine.

    ![Stopping a virtual machine](Images/virtual-machine-stop.png)

    _Stopping a virtual machine_

1. Repeat this process for the virtual machines named "worker0" and "master."

You can stop and start virtual machines in the Azure portal, but if you have a lot of VMs, that's not very efficient. In the real world, you might prefer to use an Azure CLI script to enumerate all the VMs in a resource group and start or stop them all. For more information on scripting the Azure CLI, see the section entitled "How to script the Azure CLI for Mac, Linux, and Windows" in [Install and Configure the Azure CLI](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli/). If you prefer visual tools to command-line tools, you can use [Azure Automation](https://azure.microsoft.com/en-us/services/automation/) to automate VM operations.

<a name="Exercise8"></a>
## Exercise 8: Delete the SLURM cluster

In [Exercise 1](#Exercise1), you learned that resource groups are a useful feature of Azure because they let you manage groups of resources such as the virtual machines in a SLURM cluster. One of the most practical reasons to use resource groups is that deleting a resource group deletes all the resources it contains. Rather than delete those resources one by one, you can delete them all at once.

In this exercise, you'll delete the resource group you created in [Exercise 1](#Exercise1). Deleting the resource group deletes the SLURM cluster and prevents any further charges from being incurred for it.

1. In the Azure Portal, open the blade for the resource group you created in [Exercise 1](#Exercise1). Then click the **Delete** button at the top of the blade.

	![Deleting a resource group](Images/delete-blade.png)

	_Deleting a resource group_

1. For safety, you are required to type in the resource group's name. (Once deleted, a resource group cannot be recovered.) Type the name of the resource group.

1. Click the **Delete** button to remove all traces of this lab from your account.

### Summary ###

In this hands-on lab, you learned how to:

- Create a resource group for a SLURM cluster
- Create a SLURM cluster in that resource group using an Azure Resource Manager template
- Copy local resources to a SLURM cluster
- Remote into the nodes in a SLURM cluster
- Run jobs on a SLURM cluster
- Start and stop nodes in a SLURM cluster
- Delete a SLURM cluster by deleting the resource group containing it

It is **much** easier to deploy a SLURM cluster in Azure than to install and configure a physical SLURM cluster. This is one of the ways in which cloud computing benefits computer scientists: it allows you to quickly and easily deploy the resources you need, *when* you need them, pay only for the resources you use, and delete them when they are no longer necessary.

---

Copyright 2016 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the Apache License, Version 2.0. You may use it according to the license as is most appropriate for your project on a case-by-case basis. The terms of this license can be found in http://www.apache.org/licenses/LICENSE-2.0.
