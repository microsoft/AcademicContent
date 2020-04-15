##Prerequisites for using Azure PowerShell
##Azure is a subscription-based platform. This means that a subscription is required to use the platform.
##The Azure PowerShell modules require Microsoft .NET Framework 4.5
##When you install the module, the installer checks your system for the required software and installs all dependencies, such as the correct version of Windows PowerShell and .NET Framework.
##How to: Install Azure PowerShell
##You can download and install the Azure PowerShell modules by running the Microsoft Web Platform Installer http://aka.ms/webpi-azps 
##If you are using this in an automation script and want to avoid any pop up window, use the following snippet 
##The method you use to open either console depends on the version of Windows you’re running:
##On a computer running at least Windows 8 or Windows Server 2012, you can use the built-in Search. From the Start screen, begin typing power. This returns a scoped list of apps that includes Windows PowerShell and Azure PowerShell. To open the console, click either app. (To pin the app to the Start screen, right-click the icon.)
##On a computer running a version earlier than Windows 8 or Windows Server 2012, use the Start menu. From the Start menu, click All Programs, click Azure, and then click Azure PowerShell.

##Scripts to list Azure Subscriptions 

##authenticate using the primary azure account
##this will launch a login prompt please ensure you choose the correct account when validating
##In the window, type the email address and password associated with your account.
##Azure authenticates and saves the credential information, and then closes the window.

Add-AzureAccount
##If you have an organizational account, you can type the following command to bypass the pop up window. This will pop up the standard Windows PowerShell credential window for you to enter your organizational account user name and password. 

$cred = Get-Credential
Add-AzureAccount -Credential $cred

##If you are using this in an automation script and want to avoid any pop up window, use the following snippet 

$userName = "<your organizational account user name>"
$securePassword = ConvertTo-SecureString -String "<your organizational account password>" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($userName, $securePassword)
Add-AzureAccount -Credential $cred 

##This command will list in a table your current azure subscriptions 

get-AzureSubscription | Format-table SubscriptionName,isCurrent,subscriptionid

