# Readme file - Azure CS University DS Sandboxes Project

## Table of Contents

<!-- TOC -->

- [Readme file - Azure CS University DS Sandboxes Project](#readme-file---azure-cs-university-ds-sandboxes-project)
    - [Table of Contents](#table-of-contents)
    - [Description](#description)
    - [Prerequisites](#prerequisites)
        - [To enable programmatic deployment](#to-enable-programmatic-deployment)
    - [Installation](#installation)
    - [Input parameters](#input-parameters)
        - [Class & User Information](#class--user-information)
        - [Deployment](#deployment)
        - [VM Details](#vm-details)
    - [Output file](#output-file)
        - [Deployment Results](#deployment-results)
    - [Master Script](#master-script)
        - [Script Design](#script-design)
        - [Script Usage](#script-usage)
        - [Examples](#examples)
    - [Logging](#logging)
    - [Resource Tags](#resource-tags)
    - [Known limitations](#known-limitations)
    - [Script Performance](#script-performance)
    - [Deploying different VM types](#deploying-different-vm-types)
    - [Post-Deployment Scripts](#post-deployment-scripts)
    - [Additional scripts](#additional-scripts)
        - [Change state of View Status](#change-state-of-view-status)
            - [Script Usage](#script-usage-1)
            - [Examples](#examples-1)
        - [Create Image from Virtual Machines](#create-image-from-virtual-machines)
            - [Script Usage](#script-usage-2)
            - [Examples](#examples-2)
            - [Directions](#directions)
    - [Email Server setup](#email-server-setup)
        - [Mail Service Provider](#mail-service-provider)
        - [Directions to set up Email](#directions-to-set-up-email)
            - [To sign up for a SendGrid account](#to-sign-up-for-a-sendgrid-account)
        - [Integrating Email with Deployments](#integrating-email-with-deployments)
            - [To find your SendGrid API Key](#to-find-your-sendgrid-api-key)
            - [To find your SendGrid credentials](#to-find-your-sendgrid-credentials)
            - [Configure script file](#configure-script-file)
    - [Troubleshoot](#troubleshoot)
        - [Troubleshoot deploying Linux virtual machine issues in Azure](#troubleshoot-deploying-linux-virtual-machine-issues-in-azure)
            - [Top issues](#top-issues)
        - [Troubleshoot deployment issues when creating a new Windows VM in Azure](#troubleshoot-deployment-issues-when-creating-a-new-windows-vm-in-azure)
            - [Top issues](#top-issues-1)

<!-- /TOC -->

## Description

Educators want a simple way to provide students with VMs based on a specific VM image (for example, [Data Science VM](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.standard-data-science-vm?tab=Overview)), so students can learn the fundamentals of data science.
These scripts would not only be helpful in the education sector, but any environment where you need to quickly create many VM sandboxes.
The goal is to deploy a massive set of preconfigured VMs from prebuilt deployment scripts.  An alternative approach to this script is to use the Azure Copy function, but this has shown to not be performant when it comes to hundreds of identical VMs.
These scripts achieve the following user stories:

**Development Environment Epic**

*	Ability to deploy 300 DSVMs (Data Science Virtual Machine) in either Windows, Ubuntu, of Linux CentOS
*   Ability to deploy VMs from marketplace image, custom image, or DSVM
*	Ability to deploy VMs across one or multiple subscriptions (i.e. Each VM can be in its own subscription)
*	Ability for each VM to have its own Resource Group 
*   Ability to create a clean VM image from a VM  

**Administration Epic**

*	Ability to use a CSV file to configure a large number of DSVMs
*	Ability to validate inputs at run time
*	Ability to easily tag large numbers of resource groups & VMs (ex. to assign to a specific class)
*   Ability to execute scripts post deployment to modify all VMs in the deployment

**Data Storage Epic**
*	Ability to load zip files to VMs during deployment

**Cost Controls Epic**
*	Ability to see the status of deployments, pause, start and stop VMs

This bash script is developed to allow creation of multiple VMs in Azure within different subscriptions.

Each VM is deployed in a separate resource group; all supporting infrastructure is deployed within the resource group (e.g. virtual network, managed disk, network interface card, public IP address, DNS, and NSG).

## Prerequisites

The following prerequisites must be met for the script to run appropriately:

* Bash script should be run on Linux terminal or on [Bash Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview) or Bash on Ubuntu on Windows
	* Instructions on how to install Bash for Windows can be found [here](https://msdn.microsoft.com/en-us/commandline/wsl/about)
* Azure CLI 2.0 installed (Bash Azure Cloud Shell already contains Azure CLI)
	* Instructions on how to install Azure CLI 2.0 can be found [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* User must have an active Azure account
* Subscription(s) should have sufficient budget allowing VMs to run
* User needs to ensure no subscription / region component limits will be exceeded
	* Typically, public IDs, cores, NICs, and VMs soft limits need to be increased via a service desk request if trying to deploy 300 VMs
	* [Information about Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits)

> **IMPORTANT NOTE:** 
> Before you proceed to use the script, you must accept the terms for the VM image (ex. Data Science Virtual Machine for Ubuntu) for every subscription utilized in the deployment. You can do this  by going to the VM you want to add and click the link about deploying the VM programmatically. See instructions for [reference](https://azure.microsoft.com/en-us/blog/working-with-marketplace-images-on-azure-resource-manager/).

### To enable programmatic deployment
1. Log in to the [Azure Portal][Azure Portal].
1. In the menu on the left, click **New** and find Data Science VM.

    ![select-data-science-vm][select-data-science-vm]

1.  Select VM and click the **`Want to deploy programmatically? Get started ➔`**, choose subscription, change status to `Enable` and click `Save` button.

    ![enable-programmatic-deployment][enable-programmatic-deployment]

This only must be done once and can be done for all subscriptions in the same update.

Currently you can deploy the following Marketplace VM’s:

* Data Science Virtual Machine for Linux (Ubuntu) ([link to VM description](https://portal.azure.com/#create/microsoft-ads.linux-data-science-vm-ubuntulinuxdsvmubuntu))
* Data Science Virtual Machine for Windows 2012 ([link to VM description](https://portal.azure.com/#create/microsoft-ads.standard-data-science-vmstandard-data-science-vm))
* Data Science Virtual Machine for Windows 2016 ([link to VM description](https://portal.azure.com/#create/microsoft-ads.windows-data-science-vmwindows2016))
* Data Science Virtual Machine for Linux (Centos) ([link to VM description](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.linux-data-science-vm))
* Deep Learning toolkit for the DSVM ([link to toolkit description](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.dsvm-deep-learning))
* Other types of VMs created using the `create-vm-image.sh` script file

## Installation

 1. Make sure all prerequisites are met
 2. Make sure you restarted the terminal after installing Azure CLI. You can do it by running `exec` bash command
 3. Log in to Azure from the Azure CLI by following the instructions from [here](https://docs.microsoft.com/en-us/azure/xplat-cli-connect)
 4. Copy files from the repository to the computer where you would like to run the script by running command:  
    ```sh
    $ git clone https://github.com/MSFTImagine/computerscience.git
    ```
 5. To change directories, use the cd command:
    ```sh
    $ cd computerscience/Scripts/Bulk-Sandbox-Deployment-Automation-Bash
    ```
    > Note: git is already installed on the your system

 6. Setting up a temporary VM in Azure in the same region will boost performance
 7. Change permissions recursively of the bash script file to be executable by running command:  
    ```sh
    $ chmod -R +x *
    ```
 8. If you wish to set up email for post-deploy notifications, please see [Email Server Setup](#email-server-setup) near the end of this document.

## Input parameters

### Class & User Information

**File:** Input.csv 

**Purpose:** VMs are configured by input CSV files including subscription mapping, user and metadata. Example. One script can be used to deploy against multiple subscriptions, and users.

**Description:** Contains metadata about class and user information. Each line corresponds to one deployed VM.

**Field description:**

Field					| Required 	| Optional	| Description | Comments
----------------------- | :-------: | :-------: | ----------- | --------
Class Name 				| X | 	| Name of the class, (ex.  Computer Science 101) | May contain spaces. Just used to populate metadata tags
Subscription Name 		| 	| X | Name of the subscription to be used for deployment | Metadata to describe subscription ID
Subscription ID 		| X | 	| Azure Subscription ID | Each line can use different subscriptions which must be created beforehand. Subscription ID is on the Azure portal
Student Name 			| 	| X | Name of the student who is working on the VM | May contain spaces
Student Email Address 	| 	| X | Valid student e-mail address | System does not test if valid
VM User Name 			| X | 	| Login used by the student to access the VM | No spaces allowed
VM User Password 		| X | 	| Password used by the student to login to the VM | No spaces allowed
VM Admin Username 		| X | 	|Login used to access the VM as administrator | No spaces allowed
VM Admin Password 		| X | 	| Password used by the student to login to the VM | No spaces allowed
Comment 				| 	| X | Additional details to make it easier to manage CSV |

### Deployment

**File:** parameters.json 

**Purpose:** Passes parameters values required for deployment. 

**Description:** The file contains placeholders which will be replaced by exact values for each deployment and passed as a sting within az group deploy command.   

### VM Details

**File:** template-data-science.json

**Purpose:** Contains relevant metadata and parameters for specific DSVMs

**Description:** 

Currently we have the following types of DSVMs:

* Data Science VM for Windows (2012/2016)
* Data Science VM for Ubuntu
* Data Science VM for CentOS   

**File:** template-from-data-science-image.json

**Purpose:** Enables deployment from DSVM images and manages relevant metadata and parameters

**Description:** 

Currently we have the following types of DSVMs:

* Data Science VM for Windows (2012/2016)
* Data Science VM for Ubuntu
* Data Science VM for CentOS

**File:** template-from-custom-image.json

**Purpose:** Enables deployment from any custom VM image and manages relevant metadata and parameters

**Description:** 
This template enables you to use any image from a custom built VM for your deployment.  This enables use cases outside of data science, such as web development and deep learning.

**Storage Methods** (impacts availability, redundancy and fault tolerance approach)
* manage  - utilizes Azure Managed Disc
* unmanage – uses standard disc option

Information about data science VMs can be found [here](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview).

## Output file

### Deployment Results

**File:** Output.csv

**Purpose:** Maps results of deployment to the original deployment values.

**Description:** Contains metadata about class, user information (except user passwords) and VMs which were deployed. Each line corresponds to one deployed VM.

**Field description:**

Field					| Description                                  | Comments
----------------------- | -------------------------------------------- | --------
Class Name              | Name of the class (ex. Computer Science 101) | Inherited from input csv file
Class ID                | Time-based GUID developed for the subscription | 
Subscription Name       | Name of the subscription to be used for deployment | Inherited from input csv file
Subscription ID         | Azure Subscription ID | Inherited from input csv file
Student Name            | Name of the student who is working on the VM | Inherited from input csv file
Student Email Address   | Valid student e-mail address | Inherited from input csv file
VM UserName             | Login used by the student to access the VM | Inherited from input csv file
VM Admin UserName       | Login used to access the VM as administrator | Inherited from input csv file
Location                | Region of Azure server farm | Location from input line   
VM Name                 | Name of the VM deployed | 
Public DNS              | DNS of the VM which can be used for connecting to it | 
Resource Group Name     | Resource group where VM has been deployed | 
Security Group Name     | Security group where VM has been deployed | 
Comment                 |  | Inherited from input csv file


## Master Script

The master script file is `deploy-vm.sh`

You must choose to either deploy a Data Science VM or deploy from a custom image.

### Script Design

The script runs az group deployment create command with --no-wait option. This means that once the script is finished, the deployment will still be in process.  You can visit Azure portal and use ClassID tag to determine when all VMs were deployed. This approach is used to minimize the time for the deployment.

![design][design]

### Script Usage

The following are the different required arguments for the deploy script:

Argument        | Command       | Description | Example
--------------- | ------------- | ----------- | --------
-h, --help      | Help          | Show brief help | 
-v, --version   | Version       | Output version information | 
-in, --input    | Input file    | Specify the input file in csv format | input.csv
-out, --output  | Output file   | Specify the output file in csv format | output.csv
-l, --location  | Location file | Specify location for the deployment | uswest
-s, --size	    | VM size       | Specify the specific VM for the deployment (-h provides recommended versions) | Standard_DS2_V2
-st, --storage	| Storage type  | Configure Premium (HHD) or standard hard drives (SSD) | premium
-vm, --vmtype	| VM image      | Specify VM image for deployment | ds-vm-ubuntu
-d, --disk      | Disk type	    | Select managed or unmanaged disc | manage
-m, --sendemail	| Email toggle	| Email users following deployment with VM information | on
-u, --url	    | (Optional) Send | file |URL of file to send to desktop of VM | http://www.example.com/data.zip
-p, --postinstall | (Optional) PostDeployment script | Specify URL of file to be executed in post-deployment | http://www.example.com/post-install.sh
-t, --template  | (Optional) Template file | specify template file in json format | template.json
-i, --image     | Image         | Specify the URL to the file will be copied to the VM | /subscriptions/guid/resourceGroups/rgName/providers/Microsoft.Compute/images/imageName

### Examples

**Deploy Data Science Virtual Machine for Linux (Ubuntu)**
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location westus \
    --size Standard_DS3_v2 \
    --storage premium \
    --vmtype ds-vm-ubuntu \
    --disk manage \
    --sendemail off
```

**Deploy Data Science Virtual Machine for Linux (Centos)**
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location westus \
    --size Standard_DS3_v2 \
    --storage premium \
    --vmtype ds-vm-centos \
    --disk manage \
    --sendemail off
```

**Deploy Data Science Virtual Machine for Windows 2012**
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location westus \
    --size Standard_DS3_v2 \
    --storage premium \
    --vmtype ds-vm-windows \
    --disk manage \
    --sendemail off
```

**Deploy Data Science Virtual Machine for Windows 2016**
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location westus \
    --size Standard_DS3_v2 \
    --storage premium \
    --vmtype ds-vm-windows-2016 \
    --disk manage \
    --sendemail off
```

**Deploy VMs from image**
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location westus \
    --size Standard_DS3_v2 \
    --storage premium \
    --disk manage \
    --sendemail off \
    --image "/subscriptions/<guid>/resourceGroups/<Resource Group Name>/providers/Microsoft.Compute/images/<Image Name>"
```

**Deploy VMs using post install script**
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location westus \
    --size Standard_DS3_v2 \
    --storage premium \
    --vmtype  ds-vm-ubuntu \
    --disk manage \
    --sendemail off \
    --postinstall https://raw.githubusercontent.com/MSFTImagine/computerscience/master/Scripts/Bulk-Sandbox-Deployment-Automation-Bash/modules/post-install.sh
```

>**Important!**
>Post-deployment has limited time to run scripts. It takes 1 hour 30 minutes. After we had error message: "Provisioning of VM extension 'CustomScript' has timed out. Extension installation may be taking too long, or extension status could not be obtained."

**Deploy Deep Learning toolkit for the DSVM**

Deploying this toolkit requires access to Azure GPU NC-class instances. For availability of N-series VMs, see Products available by [region][region].

**NV instances**

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Maximum data disks |
| --- | --- | --- | --- | --- | --- |
| Standard_NV6 |6 |56 |380 | 1 | 8 |
| Standard_NV12 |12 |112 |680 | 2 | 16 |
| Standard_NV24 |24 |224 |1440 | 4 | 32 |

1 GPU = one-half M60 card.

**NC instances**

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | GPU | Maximum data disks |
| --- | --- | --- | --- | --- | --- |
| Standard_NC6 |6 |56 | 380 | 1 | 8 |
| Standard_NC12 |12 |112 | 680 | 2 | 16 |
| Standard_NC24 |24 |224 | 1440 | 4 | 32 |
| Standard_NC24r* |24 |224 | 1440 | 4 | 32 |

1 GPU = one-half K80 card.  
*RDMA capable*  


Deploy command:
```sh
$ ./deploy-vm.sh \
    --input input.csv \
    --output output.csv \
    --location eastus \
    --size Standard_NC6 \
    --storage premium \
    --vmtype ds-vm-windows \
    --disk manage \
    --sendemail off \
    --postinstall https://raw.githubusercontent.com/MSFTImagine/computerscience/master/Scripts/Bulk-Sandbox-Deployment-Automation-Bash/modules/deep-learningtoolkit/install.ps1
```

After provisioning the deep learning toolkit, see the README file in C:\dsvm\deep-learning, or on the desktop, for more information.

**Deploy VMs from your template**

You can make a copy of the `template-data-science.json` template and add new VM types. Your template can be specified in the arguments to the script.

1. Make a copy of the template file:

    ```sh
    $ cp template-data-science.json template-copy.json
    ```
1. Open the copied file and find the `variables` node: 

    ```json
    "variables": {
        "storageUri": "[concat('https://',parameters('storageAccountName'),'.blob.core.windows.net/')]",
        "images": {
            //elements....
        }
    ```
1. Add a new section to the `images` node:

    ```json
    "images": {
        "new-vm-type": {
            "publisher": "new-publisher",
            "offer": "new-offer",
            "sku": "new-sku",
            "version": "latest"
        },
    ```
1. Find the `plans` section in `variables` node and add new plan information:

    ```json
    "ds-vm-ubuntu": {
        "name": "new-name",
        "publisher": "new-publisher",
        "product": "new-product"
    },
    ```
1. Save the modified file. You can deploy using the following parameters:
    ```sh
    $ ./deploy-vm.sh \
        --input input.csv \
        --output output.csv \
        --location westus \
        --size Standard_DS3_v2 \
        --storage premium \
        --vmtype <your vm type> \
        --disk manage \
        --sendemail off \
        --template ./templates/template.json
    ```

>**Important!**
>It is not recommended to change the base templates, if you do not know.

Examples of files (input.csv, output.csv) are included in this repository.

## Logging

The script creates a log file for each deployment. The file can be found in the same folder as output.scv file. The file name of the log file includes time-based GUID generated for the specific deployment.

**Example**: Deployment-c8f7dc5c-398e-11e7-a762-54ee759e9cc8.log

## Resource Tags

Each Resource Groups and VMs have the following tags added during deployment from the `input.CSV` file:

* ClassID
* StudentLogin
* StudentEmail
* StudentName
* ClassName

## Known limitations

 * The script can only use existing subscriptions. It does not programmatically create new subscriptions based on subscription names/IDs in the input file.
 * Script does not verify infrastructure element availability before the deployment; deployment will partially succeed if limits are hit.
	* If the deployment requires infrastructure beyond the current subscription / region limit, the deployment will cancel. The script will validate existing quota in the region of the deployment.
	* Typically, public IDs, cores, NICs, and VMs soft limits need to be increased via a service desk request if trying to deploy large amount of VMs.

## Script Performance
We recommend to spinning up a VM in Azure in the same region where you plan to do the deployment to use as a terminal to run the script. This accelerates script execution significantly.

Results of the performance testing (only one deployment were done per testing):

DSVM type   | Environment | Approx time to create 300 VMs
----------- | ------------| ---------
Windows     | Bash shell in Windows 10 local machine | 42 min 41 sec
Windows     | Ubuntu Jumpbox in deployment region (westus) | 18 min 17 sec

Please note that the performance of the execution depends on multiple factors including current load on Azure within the specified region and network bandwidth between terminal where script runs and Azure.

## Deploying different VM types

The script is accompanied with JSON files configured to deploy multiple VMs with Windows Data Science VM, Ubuntu Data Science VM or CentOS Data Science VM.
The existing JSON files can be updated at your own risk. If any changes are made, it is recommended to keep a reference to parameters specified in `parameter.json`. 

> **Example**: publicIpAddressName is defined in `parameters.json` and used in the `template-*.json` files. The value is assigned inside the script. If this value is removed from the `template-*.json` files, the IP name will be assigned automatically, potentially causing deployment issues.

## Post-Deployment Scripts
Post-Deployment scripts can either be hosted on an Azure storage account with an URL or posted in the GitHub "PostDeployment Scripts".
If utilizing GitHub, select the "Raw" option and copy the URL to refer to in the deploy-vm.sh script.
Use cases for this feature include ensuring that the most up to date software is installed or configuring variables, etc.  
An alternative would be to do this in a custom VM, create an image, and deploy from the image.

## Additional scripts

### Change state of View Status

**File:** change-vm-state.sh

**Purpose:** Start, stop, restart and redeploy VMs. Get provisioning State of deployment.  Delete the resource group by ClassID tag.

**Description:** This script allows you to manage the VM in Azure within different subscriptions.

#### Script Usage

The master script file is `change-vm-state.sh`.

The following are the different required arguments for the script: 

Argument        | Command       | Description | Example
--------------- | ------------- | ----------- | --------
-id,            | --classid     | Specify time-based GUID developed for the subscription | aa371ce6-c555-4c21-88b6-246742b8c61d
-a,             | --action      | Specify the task describes the action	                 | delete
-h,             | --help        | Show brief help | 
-v,             | --version     | Output version information |

#### Examples

**Example for VMs:**
```sh
$ ./change-vm-state.sh -id aa371ce6-c555-4c21-88b6-246742b8c61d -a start
```

**Example for RGs:**
```sh 
$ ./change-vm-state.sh -id 25b5b6de-79f8-4131-90f1-1ab296ec3a7f -a delete
```

**Actions related to the VMs:**
- start        -  The operation to power off (stop) a virtual machine.
- stop         -  The operation to start a virtual machine.
- restart      -  The operation to restart a virtual machine.
- redeploy     -  The operation to redeploy a virtual machine.

**Actions related to the RGs:**
- status       -  The operation provisioning State of deployment.
- delete       -  The operation deletes the resource group by ClassID tag.

### Create Image from Virtual Machines

**File:** create-vm-image.sh

**Purpose:** Create an image from a custom built VM

**Description:** This script allows you to expand the capabilities of this script to any VM, not just DSVMs.

During the process of creating an image, the script will clean all user and personal data from the device so it is not propagated into future VMs.  
When VMs are created from these image, they get new IP addresses.
The VM which is used as a template will not be available after the image is created and should be deleted.

#### Script Usage
The following are the different required arguments for the script: 

Argument        | Command       | Description | Example
--------------- | ------------- | ----------- | --------
-vm,            | --vmname      | The name of the Virtual Machine. | myVMName
-g,             | --group       | Name of resource group. | myResourceGroup
-ht,            | --host        | Public IP address or DNS url | 13.91.88.167
-u,             | --username    | Virtual Machine username | vmadmin
-subid,         | --subscriptionId | Subscription | d4b70cdf-78d7-45f7-9009-81a22a173bdf
-h,             | --help        | Show brief help | 
-v,             | --version     | Output version information | 

#### Examples

**Creating a VM from a Linux machine:**
```sh
$ ./create-vm-image.sh -vm <Virtual Machine Name> -g <Resource Group Name> -ht <DNS or IP address> -u <User Name> -subid <Subscription Id>
```

#### Directions

The script processes following this direction:

![direction][direction]

>**Important!**  
>After running the script, the VM will no longer be available. The script is cleared of all sensitive information.
>In the third version the script can create a backup only for virtual machines that do not have a plan information.

## Email Server setup
We recommend using SendGrid on Azure for email.

Sequence of steps – high level
* [To sign up for a SendGrid account](#to-sign-up-for-a-sendgrid-account)
* [To find your SendGrid API Key](#to-find-your-sendgrid-api-key)
* [To find your SendGrid credentials](#to-find-your-sendgrid-credentials)
* [Configure script file](#configure-script-file)

### Mail Service Provider
This example utilizes SendGrid as the email service provider. To send emails, you should set up a `send-email.sh` script file.

SendGrid includes a free account for Azure customers that includes some free emails each month including access to advanced reporting, analytics, and all APIs (Web, SMTP, Event, Parse and more). See instructions for [reference](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/SendGrid.SendGrid).

### Directions to set up Email 

For information about additional services provided by SendGrid, visit the [SendGrid Solutions][SendGrid Solutions] page.

#### To sign up for a SendGrid account
1. Log in to the [Azure Portal][Azure Portal].
2. In the menu on the left, click **New**.

    ![command-bar-new][command-bar-new]
3. Click **Add-ons** and then **SendGrid Email Delivery**.

    ![sendgrid-store][sendgrid-store]
4. Complete the signup form and select **Create**.

    ![sendgrid-create][sendgrid-create]
5. Enter a **Name** to identify your SendGrid service in your Azure settings. Names must be between 1 and 100 characters in length and contain only alphanumeric characters, dashes, dots, and underscores. The name must be unique in your list of subscribed Azure Store Items.
6. Enter and confirm your **Password**.
7. Choose your **Subscription**.
8. Create a new **Resource group** or use an existing one.
9. In the **Pricing tier** section select the SendGrid plan you want to sign up for.

    ![sendgrid-pricing][sendgrid-pricing]
10. Enter a **Promotion Code** if you have one.
11. Enter your **Contact Information**.
12. Review and accept the **Legal terms**.
13. After confirming your purchase you will see a **Deployment Succeeded** pop-up and you will see your account listed in the **All resources** section.

    ![all-resources][all-resources]

    After you have completed your purchase and clicked the **Manage** button to initiate the email verification process, you will receive an email from SendGrid asking you to verify your account. If you do not receive this email, or have problems verifying your account, please [see this FAQ][SendGrid FAQ].

    ![manage][manage]

    **You can only send up to 100 emails/day until you have verified your account.**

    To modify your subscription plan or see the SendGrid contact settings, click the name of your SendGrid service to open the SendGrid Marketplace dashboard.

    ![settings][settings]

    To send an email using SendGrid, you must supply your API Key.

### Integrating Email with Deployments

#### To find your SendGrid API Key

1. Click **Manage**.

    ![manage][manage]
2. In your SendGrid dashboard, select **Settings** and then **API Keys** in the menu on the left.

    ![api-keys][api-keys]
3. Click the **Create API Key**.

    ![general-api-key][general-api-key]    
4. Provide the **Name of this key** and provide full access to **Mail Send** and select **Save & View**.

    ![access][access]
5. Your API will be displayed at this point one time. Please be sure to store it safely.

#### To find your SendGrid credentials
1. Click the key icon to find your **Username**.

    ![key][key]
2. The password is the one you chose at setup. You can select **Change password** or **Reset password** to make any changes.

    To manage your email deliverability settings, click the **Manage button**. This will redirect to your SendGrid dashboard.

    ![manage][manage]


#### Configure script file
Sending email requires that you supply your SendGrid API Key. If you need details about how to configure API Keys, please visit SendGrid's API Keys documentation.

Open the `./modules/send-email.sh` script file, find apiKey section and replace value with your API key. Specify the email address of the sender.
```sh
apiKey="<sendgrid_api_key>" # set your api key
emailFrom="<email_from>"    # set email from
```

## Troubleshoot

To troubleshoot virtual machine (VM) deployment issues in Azure, review the [top issues](#top-issues) for common failures and resolutions.

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

### Troubleshoot deploying Linux virtual machine issues in Azure


When you try to create a new Azure Virtual Machine (VM), the common errors you encounter are provisioning failures or allocation failures.. To start troubleshooting, review these steps:

#### Top issues

- [What Linux distributions/versions are supported on Azure?](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/troubleshoot-deploy-vm#what-linux-distributionsversions-are-supported-on-azure)
- [Is N-Series VMs available in my region?](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/troubleshoot-deploy-vm#is-n-series-vms-available-in-my-region)

### Troubleshoot deployment issues when creating a new Windows VM in Azure

#### Top issues

This article describes some of the most common error codes and messages you may encounter when you create or manage Windows virtual machines (VMs) in Azure. To start troubleshooting, review these steps:

- [Common virtual machine management errors](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/error-messages#common-virtual-machine-management-errors)
- [Are client images supported for N-Series?](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/troubleshoot-deploy-vm#are-client-images-supported-for-n-series)

---

<!--images-->

[command-bar-new]: ./images/sendgrid-sign-up/new-addon.png
[sendgrid-store]: ./images/sendgrid-sign-up/sendgrid-store.png
[sendgrid-create]: ./images/sendgrid-sign-up/sendgrid-create.png
[sendgrid-pricing]: ./images/sendgrid-sign-up/sendgrid-pricing.png
[all-resources]: ./images/sendgrid-sign-up/all-resources.png
[manage]: ./images/sendgrid-sign-up/manage.png
[settings]: ./images/sendgrid-sign-up/settings.png
[api-keys]: ./images/sendgrid-sign-up/api-keys.png
[general-api-key]: ./images/sendgrid-sign-up/general-api-key.png
[access]: ./images/sendgrid-sign-up/access.png
[key]: ./images/sendgrid-sign-up/key.png

[design]: ./images/design.png
[direction]: ./images/process.png

[enable-programmatic-deployment]: ./images/configure-programmatic-deployment/enable-programmatic-deployment.png
[select-data-science-vm]: ./images/configure-programmatic-deployment/select-data-science-vm.png

<!--Links-->

[SendGrid Solutions]: https://sendgrid.com/solutions
[Azure Portal]: https://portal.azure.com
[region]: https://azure.microsoft.com/en-us/regions/services
[SendGrid FAQ]: https://sendgrid.com/docs/Classroom/Basics/Account/account_sign_up_faq.html#How-long-does-the-verification-process-take