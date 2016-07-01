<a name="HOLTitle"></a>
# Deploying a SLURM Cluster using Docker and Azure Container Service #

---

<a name="Overview"></a>
## Overview ##

The [Simple Linux Utility for Resource Management](https://computing.llnl.gov/linux/slurm/overview.html) (SLURM), also known as the *SLURM Workload Manager*, is a free and open-source job scheduler for Linux that excels at distributing heavy computing workloads across clusters of machines and processors. It is used on more than half of the world's largest supercomputers and High-Performance Computing (HPC) clusters, and it enjoys widespread use in the research community for jobs that require significant CPU resources.

SLURM clusters can be built from real machines or virtual machines. Today, they can also be built from containers. A *container* is a self-contained package that includes everything needed to run a job, including code, run-time, system tools, and libraries. Containers are similar to VMs, but they feature lower overhead and faster startup times. The most popular container format in the world today is [Docker](https://www.docker.com/), which is an open-source containerization platform. Bundling your code in Docker containers provides portability between platforms such as Microsoft Azure and Amazon Web Services (AWS) and lets you avoid being tied to a specific cloud-platform vendor.

To simplify the use of Docker containers, Azure offers the [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) (ACS), which hosts Docker containers and includes an optimized configuration of popular open-source scheduling and orchestration tools, including [DC/OS](https://dcos.io/) and [Docker Swarm](https://www.docker.com/products/docker-swarm). The latter uses native clustering capabilities to turn a group of Docker engines into a single virtual Docker engine and is the perfect tool for the job of creating SLURM clusters from Docker containers. 
 
In this lab, you will create a SLURM cluster from a swarm of Docker container instances and run a Python script in those container instances to convert a batch of color images to grayscale. You will get first-hand experience deploying Docker containers to the Azure Container Service and using Docker Swarm to manage the nodes in the cluster.

<a name="Objectives"></a>
### Objectives ###

In this hands-on lab, you will learn how to:

- Create a SLURM cluster on Docker Swarm using Azure Container Services
- Remote swarm master and connect to the SLURM Nodes
- Run jobs on a SLURM cluster
- Use the Azure Resource Manager to delete a SLURM cluster

<a name="Prerequisites"></a>
### Prerequisites ###

The following are required to complete this hands-on lab:

- A Microsoft Azure subscription - [sign up for a free trial](http://aka.ms/WATK-FreeTrial)
- The Microsoft Azure Storage Explorer (provided for you in the lab VM)
- PuTTY and PuTTYGen (provided for you in the lab VM)
- Docker Toolbox (provided for you in the lab VM)

---
<a name="Exercises"></a>
## Exercises ##

This hands-on lab includes the following exercises:

- [Exercise 1: Create an Azure Container Service instance](#Exercise1)
- [Exercise 2: Deploy a SLURM Cluster to ACS](#Exercise2)
- [Exercise 3: Create a storage account and upload images](#Exercise3)
- [Exercise 4: Prepare the Python script](#Exercise4)
- [Exercise 5: Copy the job scripts, configure the nodes, and run the job](#Exercise5)
- [Exercise 6: View the converted images](#Exercise6)
- [Exercise 7: Suspend the ACS instance](#Exercise7)
- [Exercise 8: Delete the ACS instance](#Exercise8)

Estimated time to complete this lab: **60** minutes.


<a name="Exercise1"></a>
## Exercise 1: Create an Azure Container Service instance

The Azure Resource Manager allows you to provision applications using declarative templates. A template contains a complete description of everything that makes up the application, including virtual machines, databases, Web apps, IP addresses, and other resources. Templates can include parameters that users will be prompted to fill in each time an application is deployed. Templates can also invoke scripts to initialize resources to a known and consistent state.

As an example, suppose you have built an ACS Instance that includes virtual machines and other Azure resources. With a template, you can script the creation of the entire application and optionally the data that goes with it. This makes it easy for others to spin up instances of the application. To learn more about Azure Resource Manager templates, you can read the [documentation](https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-deploy/) online.

1. Before you can create an Azure Container Service instance, you need a public/private SSH key pair to authenticate with the virtual machines that ACS creates. On Windows, you can generate the key pair with the PuTTY Key Generator, also known as PuTTYGen.

	Launch PuTTYGen and click the Generate button. For the next few seconds, move your cursor around in the empty space under "Key" to help randomnize the keys that are generated.

 	![Generating a public/private key pair with PuTTYGen](Images/docker-puttygen1.png)

	_Generating a public/private key pair with PuTTYGen_

2. Once the keys are generated, click **Save public key** and save the public key to a text file. Then click **Save private key** and save the private key as well. When prompted to confirm that you want to save the private key without a passphrase, click **Yes**.

 	![Saving the public and private keys](Images/docker-puttygen2.png)

	_Saving the public and private keys_

1. Open the [Azure Portal](https://portal.azure.com) in your browser. Select **+ New -> Containers -> Azure Container Service**. Then click the **Create** button at the bottom of the "Azure Container Service" blade.

	![Creating an ACS instance](Images/docker-new-container.png)

	_Creating an ACS instance_

1. Click **Basics** in the "Azure Container Service" blade. In the "Basics" blade, enter the user name you will use to connect to ACS (be sure to remember the user name you enter!), the public key that you generated with PuTTYGen and saved to a text file, and the subscription you want to charge to. Select **Create new** under **Resource group** and enter the resource-group name "ACSLabResourceGroup" (without quotation marks). Select the location nearest you under **Location**, and then click the **OK** button.

	![ACS basic settings](Images/docker-acs-basics.png)

	_ACS basic settings_

1. In the "Framework configuration" blade, select **Swarm** as the orchestrator configuration. Then click OK.

	![ACS framework configuration settings](Images/docker-acs-framework-configuration.png)

	_ACS framework configuration settings_

1. In the "Azure Container service settings" blade, set **Agent count** to **2**, **Master count** to **1**, and enter "dockerslurm" (without quotation marks) into the **DNS prefix** box. Then click **OK**.

	![ACS service settings](Images/docker-acs-service-settings.png)

	_ACS service settings_

	> By default, Azure Container Service uses a standard D2 virtual machine for each agent. These are dual-core machines with 7 GB of RAM.

1. In the "Summary" blade, review the settings you selected. Then click **OK**.

	![Confirming ACS settings](Images/docker-acs-summary.png)

	_Confirming ACS settings_

1. In the ensuing "Purchase" blade, click the **Purchase** button to begin deploying a new ACS instance.

Deployment will take about 15 to 20 minutes. Take a short break and wait for the deployment to finish. Then proceed to Exercise 2.

<a name="Exercise2"></a>
## Exercise 2: Deploy a SLURM Cluster to ACS

SLURM can be run in Docker containers, with each container instance acting as a node in the SLURM cluster. Optimally, the containers will take advantage of a container per CPU. Depending on how many agents you spun up, you can multiply the number of agents times the number of cores per agent (in the case of D2, 2 cores) and use that has a baseline for the number of containers you will want. For instance, 2 agents with 2 cores would be 4 containers for the HPC cluster with SLURM.

1. After the Azure Container Service instance you created in Exercise 1 finishes deploying, click **Resource groups** on the left side of the portal to display a list of all the resource groups associated with your subscription. Then select the resource group you created for the ACS instance, and click the resource named "smarm-master-lb-xxxxxxxx." This is the master load balancer for the swarm.

	![Opening the master load balancer](Images/docker-open-master-lb.png)

	_Opening the master load balancer_

1. Click the IP address under "Public IP Address."

	![Opening the IP address](Images/docker-click-ip-address.png)

	_Opening the IP address_

1. Hover over the DNS name under "DNS Name." Wait for a **Copy** button to appear, and then click it to copy the master load balancer's DNS name to the clipboard.

	![Copying the DNS name](Images/docker-copy-dns-name.png)

	_Copying the DNS name_

1. Launch PuTTY and paste the DNS name on the clipboard into the **Host Name (or IP address)** box. Set the port number to **2200** and type "ACS" (without quotation marks) into the **Saved Sessions** box. Click the **Save** button to save these settings under that name.

	![Configuring a PuTTY session](Images/docker-putty1.png)

	_Configuring a PuTTY session_

1. In the treeview on the left, click **SSH**, and then click **Auth**. Click the  **Browse** button and select the private-key file that you created in Exercise 1.

	![Entering the private key](Images/docker-putty2.png)

	_Entering the private key_

1. Select **Tunnels** in the treeview. Then set **Source port** to **22375** and **Destination** to **127.0.0.1:2375**, and click the **Add** button.
	
	![Configuring the SSH tunnel](Images/docker-putty3.png)

	_Configuring the SSH tunnel_

1. Click **Session** at the top of the treeview. Click the **Save** button to save your configuration changes, and then click **Open** to create a secure SSH tunnel between the ACS instance and the local computer. If you are warned that the server's host key isn't cached in the registry and asked to confirm that you want to connect anyway, click **Yes**.

	![Opening a connection to the ACS instance](Images/docker-putty4.png)

	_Opening a connection to the ACS instance_

1. An SSH window will open and prompt you to log in. Enter the user name that you specified when you created the ACS instance in Exercise 1. Then press the **Enter** key. If you successfully connected, you'll see a screen that looks like this:

	![Successful connection](Images/docker-putty5.png)

	_Successful connection_

	> Observe that you didn't have to enter a password. That's because the connection was authenticated using the public/private key pair you generated in Exercise 1. Key pairs tend to be much more secure than passwords because they are virtually unbreakable.

1. Launch a Windows Command Prompt and use a CD command to navigate to this lab's "docker-resources" folder. Then execute the following command to show a list of Docker containers running in the ACS instance you are connected to. (There are currently no containers running, so the list will be empty.)

	<pre>
	docker -H 127.0.0.1:22375 ps -a
	</pre>

1. At the command prompt, execute the following command:

	<pre>
	create-slurm
	</pre>

	This runs a batch file provided for you in the "docker-resources" folder. It will take 5 to 10 minutes to run. The batch file builds a Docker image with everything needed for the lab. Then it deploys the image to ACS nine times to create a SLURM master in one container and SLURM nodes in eight other containers.

1. When the batch file finishes running, execute the following command:

	<pre>
	docker -H 127.0.0.1:22375 ps -a
	</pre>

	Confirm that there are now nine Docker container instances running:

	![Docker container instances](Images/docker-container-instances.png)

	_Docker container instances_

Congratulations! You just created a SLURM cluster in a series of Docker containers running in Azure Container Service.

<a name="Exercise3"></a>
## Exercise 3: Create a storage account and upload images

In [Exercise 5](#Exercise5), you will run a Python script on the cluster to generate grayscale images from color images. That script requires a set of color images as well as two blob storage containers: one for input and one for output. In this exercise, you will use the Azure Portal to create a storage account to hold the images. Then you will use the cross-platform [Microsoft Azure Storage Explorer](http://storageexplorer.com/) to create containers in that storage account and upload the images.

1. Return to the [Azure Portal](https://portal.azure.com) and click **Resource groups** in the ribbon on the left. Then click the resource group that holds the Azure Container Service instance you created in Exercise, and click **+ Add** in the resource group's blade.

	![Adding a resource to ACSLabResourceGroup](Images/docker-add-storage-account-to-resource-group.png)

	_Adding a resource to ACSLabResourceGroup_

1. Type "Storage account" (without quotation marks) into the search box to filter the list of resources. Select **Storage account** from the search results. (There will probably be two instances of "Storage account" in the search results. Select the one that says "Web + Mobile" on the far right.) Then click the **Create** button at the bottom of the "Storage account" blade.

	![Adding a storage account](Images/docker-add-storage-account.png)

	_Adding a storage account_

1. Fill in the "Create storage account" blade as shown below, substituting a unique storage account name for the one shown (remember that storage account names must be unique within Azure) and selecting the location nearest you. Then click the **Create** button.

	![Creating a new storage account](Images/docker-create-storage-account.png)

	_Creating a new storage account_

1. Start the Microsoft Azure Storage Explorer, which is already installed in the VM you're using. If you're prompted for credentials, sign in with the user name and password for your Microsoft account.

1. In the Storage Explorer window, find the storage account that you just created. Expand the list of items underneath that storage account. Then right-click **Blob Containers** and select **Create Blob Container** from the menu.

    ![Creating a new container](Images/docker-create-new-blob-container.png)

    _Creating a new container_

1. Type "input" (without quotation marks) and press Enter to create a container named "input."

1. Repeat this procedure to create a blob container named "output."

1. Double-click the "input" container to show its contents. Then click the **Upload** button and select **Upload Files** from the menu.

    ![Uploading images to the "input" container](Images/docker-upload-images.png)

    _Uploading images to the "input" container_

1. Click the **...** button to the right of the field labeled "Files." In the ensuing dialog, navigate to this lab's "ColorImages" subdirectory and select all the files in that subdirectory. Then close the dialog and click the **Upload** button.

    ![Uploading files to blob storage](Images/docker-upload-files-dialog.png)

    _Uploading files to blob storage_

1. Confirm that all 49 files were uploaded to the "input" container.

    ![Uploaded images](Images/docker-uploaded-images.png)

    _Uploaded images_

You now have containers to hold input and output and a collection of color images in the input container. The next step is to prepare the scripts needed to configure the cluster and process the images.

<a name="Exercise4"></a>
## Exercise 4: Prepare the Python script

With the SLURM cluster up and running in Docker containers and the color images uploaded to blob storage, the next task is to modify the Python script that will process the images with information about the storage account you just created.

1. Return to the Azure Portal and open the blade for the storage account you created in [Exercise 3](#Exercise3). In the storage-account blade, click the key icon.

    ![Accessing the storage account's access keys](Images/docker-storage-account-blade.png)

    _Accessing the storage account's access keys_

1. In the "Access keys" blade, click the **Copy** button to copy the storage account's primary access key to the clipboard.

    ![Copying the primary access key to the clipboard](Images/docker-access-keys-blade.png)

    _Copying the primary access key to the clipboard_

1. Navigate to this lab's "docker-resources" directory. Open **slurmdemo.py** in a text editor and find the following section near the top of the file:

	<pre>
    #######################################################
    # Update these two variables to those for your account.
    #######################################################
    ACCOUNT_NAME = 'account_name'
    ACCOUNT_KEY = 'account_key'
    #######################################################
    </pre>

1. Replace *account_name* with the name of the storage account you created for the images. Make sure the account name is enclosed in single quotes.

1. Replace *account_key* with the access key you just copied. Make sure it is enclosed in single quotes. The modified code will look something like this:

	<pre>
	#######################################################
	# Update these two variables to those for your account.
	#######################################################
	ACCOUNT_NAME = 'acslabstorage'
	ACCOUNT_KEY = '4CUfFk2wTcE+...+mNCGCn9ln23F0PFzxwi8Q=='
	#######################################################
    </pre>

1. Save your changes to slurmdemo.py and close the text editor.

You've updated the Python script with the information it needs to access the storage account. Now comes the fun part: generating grayscale images from the color images in the "input" container.

<a name="Exercise5"></a>
## Exercise 5: Copy the job scripts, configure the nodes, and run the job

1. Return to the Command Prompt that's open to the lab's "docker-resources" directory and run the following command to copy scripts from the local computer to the SLURM nodes:

	<pre>
	copy-scripts
	</pre>

1. Now use the following command to run slurmdemo.py on the cluster and do the image conversions:

	<pre>
	docker -H 127.0.0.1:22375 exec -it linux0 python /slurmdemo.py
	</pre>
	
After a second or two, the command should complete. Note that it might take 30 seconds or more for the Python script, which is running in the cloud in the various container instances, to convert all the images. 

<a name="Exercise6"></a>
## Exercise 6: View the converted images

If the job ran successfully, the grayscale images generated from the color images in the input container will be in the output container you created in [Exercise 3](#Exercise3). In this exercise, you will check the contents of that container.

1. Launch the Microsoft Azure Storage Explorer if it isn't already running.

1. In the Storage Explorer, double-click the container named "output" to see its contents.
 
    ![Contents of the output container](Images/docker-job-output.png)

    _Contents of the output container_

1. Double-click one of the blobs in the container. When the downloaded image opens, confirm that it's a grayscale image, not a color image. To be sure, download a few other images, too. If the images are grayscale, congratulations! You have a working SLURM cluster.

You now know how to deploy and configure SLURM clusters and run jobs on them. But when those clusters aren't being used, you should shut them down to avoid incurring unnecessary charges. The next exercise explains how.

<a name="Exercise7"></a>
## Exercise 7: Suspend the SLURM cluster

When virtual machines are running, you are being charged — even if the VMs are idle. Therefore, it's advisable to stop virtual machines when they are not in use. You will still be charged for storage, but that cost is typically insignificant compared to the cost of an active VM. Your ACS instance contains a master virtual machine that needs to be stopped when you're not using the cluster. The Azure Portal makes it easy to stop virtual machines. VMs that you stop are easily started again later so you can pick up right where you left off.

1. Return to the Command Prompt window and ensure that you are still in the lab's "docker-resources" directory. Then run the following command:

	<pre>
	stop-slurm
	</pre>

	This command is actually a batch file that shuts down all of the container instances, effectively shutting down the SLURM cluster. You can use the **start-slurm** command to restart the container instances at any time.

1. In the Azure Portal, open the blade for the resource group you created in [Exercise 1](#Exercise1). Click the virtual machine whose name begins with "swarm-master-" to open a blade for the master virtual machine.

	![Opening a blade for the master virtual machine](Images/docker-open-vm.png)
	
	 _Opening a blade for the master virtual machine_

1. Click the **Stop** button to stop the VM. Answer **Yes** when prompted to verify that you wish to stop it.

	![Stopping the master virtual machine](Images/docker-stop-vm.png)
	
	_Stopping the master virtual machine_

There is no need to stop the "swarm-agent-" virtual machines. These aren't actually VMs; they are an Azure Virtual Machine Scale Set that spins VMs up and down on demand. Note that if you wish to start the cluster again, you will need to restart the master VM before executing a **start-slurm** command.

<a name="Exercise8"></a>
## Exercise 8: Delete the ACS Resource Group

Resource groups are a useful feature of Azure because they let you manage groups of resources. One of the most practical reasons to use resource groups is that deleting a resource group deletes all the resources it contains. Rather than delete those resources one by one, you can delete them all at once.

In this exercise, you'll delete the resource group you created in [Exercise 1](#Exercise1) when you created the Azure Container Services instance. Deleting the resource group deletes everything in it and prevents any further charges from being incurred for it.

1. In the Azure Portal, open the blade for the resource group you created in [Exercise 1](#Exercise1). Then click the **Delete** button at the top of the blade.

	![Deleting a resource group](Images/docker-delete-resource-group.png)

	_Deleting a resource group_

1. For safety, you are required to type in the resource group's name. (Once deleted, a resource group cannot be recovered.) Type the name of the resource group.

1. Click the **Delete** button to remove all traces of this lab from your account.

### Summary ###

In this hands-on lab, you learned how to:

- Create an instance of Azure Container Services
- Create a SLURM cluster on Azure Container Services
- Run jobs on a SLURM cluster
- Start and stop nodes in a SLURM cluster
- Delete a SLURM cluster by deleting the resource group containing it

It is **much** easier to deploy a SLURM cluster in Azure than to install and configure a physical SLURM cluster. This is one of the ways in which cloud computing benefits computer scientists: it allows you to quickly and easily deploy the resources you need, *when* you need them, pay only for the resources you use, and delete them when they are no longer necessary.

---

Copyright 2016 Microsoft Corporation. All rights reserved. Except where otherwise noted, these materials are licensed under the terms of the Apache License, Version 2.0. You may use it according to the license as is most appropriate for your project on a case-by-case basis. The terms of this license can be found in http://www.apache.org/licenses/LICENSE-2.0.
