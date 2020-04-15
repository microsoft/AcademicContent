This Powershell script will read a list of existing user o365 Azure Active Directory accounts and subscriptions from a txt file. It will assign an Azure subscription to each of the students or AAD Groups.

IMPORTANT NOTE:   
**Accounts created with this script will NOT be able to access the [Azure classic portal](https://manage.windowsazure.com)**   
This script creates accounts based on Role Based Access Control (RBAC) and puts limitations on the accounts created to a Contributor role. You can see a complete list of features available in 
the Azure portal vs the Azure classic portal in this [Azure portal availability chart](https://azure.microsoft.com/en-us/features/azure-portal/availability/)

#Powershell 
PowerShell is now open source, and available for Linux and Mac. You can download official packages from Microsoft for the 64-bit versions of Ubuntu 16.04, Ubuntu 14.04, CentOS 7, Red Hat Enterprise Linux 7, and Mac OS X 10.11.

#Powershell Getting startedx
Getting Started using Powershell on Linux https://msdn.microsoft.com/en-us/powershell/dsc/LnxGettingStarted 
Powershell on Windows https://msdn.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell 

##User Account Permissions
User running the script simply needs to be overall Azure Subscription Owner and a Member of the AAD which is the same as the users. 

##Create your data text file data.txt
Each line of the csv file should include the following fields in order:

For email this is the AAD useraccount @ domain not the users email alias so example it may be in the following format yiycc@***.ac.uk not Chris.Charles@***.ac.uk  

> SubscriptionID,Email
example 
SubscriptionID,Email
0786686c376-d76d-4704-b1f3-8505ffc999d5,flappaga@****.ac.uk
07892238361-d72d-4724-b143-8505ffc999d5,colina@****.ac.uk

##Changing the Azure Subscription to the Current Subscription replace Azure Subscription this changes the Admin to be in the subscription to allow accounts to be added.
Select-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-122221993796" -Current 

Save the location of the file and ensure you check $FilePath  and change the path $FilePath= 'C:\Microsoft\Documents\Faculty\AddContributors\data.txt' 

* RoleName specifies the [role] (https://azure.microsoft.com/en-us/documentation/articles/role-based-access-built-in-roles/) you want to assign to the user, usually this will be *Contributor* 

##Execute the script
Navigate to the directory where the script lives
PS> cd C:\my_path\yada_yada\ (enter)
Execute the script:
PS> .\BulkaddAAD.ps1 (enter)

Or: you can run the PowerShell script from cmd.exe like this:
powershell -noexit C:\my_path\yada_yada\BulkaddAAD.ps1 (enter)
