# Readme file - Azure CS University DS Sandboxes Project

## Description

Educators want a simple way to provide students with VMs based on a specific VM image (for example, [Data Science VM](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-ads.standard-data-science-vm?tab=Overview)), so students can learn the fundamentals of data science.
These scripts would not only be helpful in the education sector, but any environment where you need to quickly create many VM sandboxes.
The goal is to deploy a massive set of preconfigured VMs from prebuilt deployment scripts.  An alternative approach to this script is to use the Azure Copy function, but this has shown to not be performant when it comes to hundreds of identical VMs.
These scripts achieve the following user stories:

**Development Environment Epic**

*	Ability to deploy 300 DSVMs (Data Science Virtual Machine) in either Windows or Ubuntu
*	Ability to deploy VMs across one or multiple subscriptions (ie. Each VM can be in its own subscription)
*	Ability for each VM to have its own Resource Group  

**Administration Epic**

*	Ability to use a CSV file to configure a large number of DSVMs
*	Ability to validate inputs at run time
*	Ability to easily tag large numbers of resource groups & VMs (ex. to assign to a specific class)

This bash script is developed to allow creation of multiple VMs in Azure within different subscriptions.

Each VM is deployed in a separate resource group; all supporting infrastructure is deployed within the resource group (e.g. virtual network, managed disk, network interface card, public IP address, DNS, and NSG).

## Prerequisites

The following prerequisites must be met for the script to run appropriately:

* Bash script should be run on Linux terminal or Bash on Ubuntu on Windows
	* Instructions on how to install Bash for Windows can be found [here](https://msdn.microsoft.com/en-us/commandline/wsl/about).
  * At this time the scripts won’t run on [Bash Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview) due to a few functions not being compatible.  Resolving these incompatibilities will be considered for future updates.
* Azure CLI 2.0 installed. 
	* Instructions on how to install Azure CLI 2.0 can be found [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
* User must have an active Azure account. 
* Subscription(s) should have sufficient budget allowing VMs to run.
* User needs to ensure no subscription / region component limits will be exceeded
	* Typically, public IDs, cores, NICs, and VMs soft limits need to be increased via a service desk request if trying to deploy 300 VMs. 
	* [Information about Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits). 

> **IMPORTANT NOTE:** 
> Before you proceed to use the script, you must accept the terms for the VM image (ex. Data Science Virtual Machine for Ubuntu) for every subscription utilized in the deployment. You can do this  by going to the VM you want to add and click the link about deploying the VM programmatically. See instructions for [reference](https://azure.microsoft.com/en-us/blog/working-with-marketplace-images-on-azure-resource-manager/).

Currently you can deploy the following VM’s:

 * Data Science Virtual Machine for Linux (Ubuntu) ([link](https://portal.azure.com/#create/microsoft-ads.linux-data-science-vm-ubuntulinuxdsvmubuntu))
 * Data Science Virtual Machine for Windows ([link](https://portal.azure.com/#create/microsoft-ads.standard-data-science-vmstandard-data-science-vm))


## Installation

 1. Make sure all prerequisites are met.
 2. Make sure you restarted the terminal after installing Azure CLI. You
    can do it by running  exec bash command.
 3. Log in to Azure from the Azure CLI by following the instructions
    from [here](https://docs.microsoft.com/en-us/azure/xplat-cli-connect).
 4. Copy files from the repository to the computer where you would like
    to run the script.
 5. Setting up a temporary VM in Azure in the same region will boost
    performance.
 6. Change permissions of the bash script file to be executable by
    running command:  
```sh
$ chmod +x deploy-vm.sh
```

## Input parameters

### Class & User Information

**File:** Input.csv 

**Purpose:** Allows for easy configuration of a massive deployment.  Example. One script can be used to deploy against multiple subscriptions, and users.

**Description:** Contains metadata about class and user information. Each line corresponds to one deployed VM.

**Field description:**

Field					| Required 	| Optional	| Description | Comments
----------------------- | --------- | --------- | ----------- | --------
Class Name 				| X | 	| Name of the class, (ex.  Computer Science 101) | May contain spaces. Just used to populate metadata tags
Subscription Name 		| 	| X | Name of the subscription to be used for deployment | Metadata to describe subscription ID. 
Subscription ID 		| X | 	| Azure Subscription ID | Each line can use different subscriptions which must be created beforehand. Subscription ID is on the Azure portal. 
Student Name 			| 	| X | Name of the student who is working on the VM | May contain spaces.
Student Email Address 	| 	| X | Valid student e-mail address | System does not test if valid
VM User Name 			| X | 	| Login used by the student to access the VM | No spaces allowed
MV User Password 		| X | 	| Password used by the student to login to the VM | No spaces allowed.
VM Admin Username 		| X | 	|Login used to access the VM as administrator | No spaces allowed.
VM Admin Password 		| X | 	| Password used by the student to login to the VM | No spaces allowed.
Comment 				| 	| X | Additional details to make it easier to manage CSV |

### Deployment

**File:** parameters.json 

**Purpose:** Pass parameters values required for deployment. 

**Description:** The file contains placeholders which will be replaced by exact values for each deployment and passed as a sting within az group deploy command. 

### VM Details

**File:** template*.json

**Purpose:** VM specific files that contain relevant parameters

**Description:** 

Currently we have the following files:

 * [template-standard-data-science-vm.json](../Bash Script/templates/data-science/template-standard-data-science-vm.json) – template for Data Science VM
   for windows.
 * [template-linux-data-science-vm-ubuntu.json](../Bash Script/templates/data-science/template-linux-data-science-vm-ubuntu.json)– template for Data
   Science VM for Ubuntu.

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


## Script Usage

The master script name is **deploy-vm.sh**.
The following are the different required arguments for the deploy script:

Argument        | Command       | Description | Example
--------------- | ------------- | ----------- | --------
-h, --help      | Help          | Show brief help | 
-v, --version   | Version       | Output version information | 
-in, --input    | Input file    | Specify the input file in csv format | input.csv
-out, --output  | Output file   | Specify the output file in csv format | output.csv
-p, --parameters| Parameters file | Specify parameters file in json format | parameters.json
-t, --template  | Template file | Specify template file in json format | template.json
-l, --location  | Location file | Specify location for the deployment | uswest

### Examples

```sh
$ ./Deploy-vm.sh -in input.csv -out output.csv -p param.json -t template.json -l westus
```
Examples of files (input.csv, output.csv, param.json, template.json) are included in this repository.

## Script Design

The script runs az group deployment create command with --no-wait option. This means that once the script is finished, the deployment will still be in process.  You can visit Azure portal and use ClassID tag to determine when all VMs were deployed. This approach is used to minimize the time for the deployment.

![Design](images/design.png)

## Logging

The script creates a log file for each deployment. The file can be found in the same folder as output.scv file. The file name of the log file includes time-based GUID generated for the specific deployment.

> **Example**: Deployment-c8f7dc5c-398e-11e7-a762-54ee759e9cc8.log

## Resource Tags

Resource groups have the following tags added during deployment from the <kbd>input.CSV</kbd> file:

* ClassID
* StudentLogin
* StudentEmail
* StudentName
* ClassName

Each VM has the following tags inherited from the <kbd>input.CSV</kbd> file:

## Known limitations

 * The script can only use existing subscriptions. It does not programmatically create new subscriptions based on subscription names/IDs in the input file.
 * Script does not verify infrastructure element availability before the deployment; deployment will partially succeed if limits are hit.
	* If the deployment requires infrastructure beyond the current subscription / region limit, the deployment will fail. User must ensure deployment infrastructure elements have not exceeded existingquota in the region of the deployment.
	* Typically, public IDs, cores, NICs, and VMs soft limits need to be increased via a service desk request if trying to deploy large amount of VMs.

## Script Performance
We recommend to spinning up a VM in Azure in the same region where you plan to do the deployement to use as a terminal to run the script. This accelerates script execution significantly.

Results of the performance testing (only one deployment were done per testing):

DSVM type   | Environment | Approx time to create 300 VMs
----------- | ------------| ---------
Windows     | Bash shell in Windows 10 local machine | 42 min 41 sec
Windows     | Ubuntu Jumpbox in deployment region (westus) | 18 min 17 sec

Please note that the performance of the execution depends on multiple factors including current load on Azure within the specified region and network bandwidth between terminal where script runs and Azure.

## Deploying different VM types

The script is accompanied with JSON files configured to deploy multiple VMs with Windows Data Science VM or Ubuntu Data Science VM.
The existing JSON filess can be updated at your own risk. If any changes are made, it is recommended to keep a reference to parameters specified in <kbd>parameter.json</kbd>. 

> **Example**: publicIpAddressName is defined in <kbd>parameters.json</kbd> and used in the <kbd>template-standard-data-science-vm.json</kbd> file. The value is assigned inside the script. If this value is removed from the <kbd>template.json</kbd> file, the IP name will be assigned automatically, potentially causing deployment issues.