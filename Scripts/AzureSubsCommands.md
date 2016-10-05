Name: AzureSubsCommands
Purpose: Demonstrate how Azure Subscriptions work and how to change default and current subscription 
Description: Shows how to work with changing accounts, and subscriptions in Azure using PowerShell 
Limitations/Prerequisite:  
    * Must Run PowerShell
    * Requires PowerShell Azure Module https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure 
 ================================================================================ 

#Checking current Azure user
#This will bring back user ID, Type, Subscriptions, Tenants
Get-AzureAccount

# remove All Powershell Cached Credentials:  
# this is especially helpful to get rid of old accounts that have expired! 
Get-AzureAccount | ForEach-Object { Remove-AzureAccount $_.ID -Force }  
 
# List Azure Subscriptions 
get-AzureSubscription | Format-table SubscriptionName, isDefault, isCurrent, DefaultAccount, subscriptionid 
 
Add-AzureAccount   #  Add cached creds for @live 
# You could also use certificate based authentiacation, for details See...  
# more on adding accounts: https://channel9.msdn.com/Series/GuruPowerShell/Azure-Accounts-with-PowerShell 
Get-azureAccount  # List Azure Accounts 
 
# List Azure Subscriptions in a table
get-AzureSubscription | Format-table SubscriptionName, isDefault, isCurrent, DefaultAccount, subscriptionid 
# Note the IsCurrent and IsDefault fields 
 
#Setting An Azure Subscription
Set-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-457f21993796"              # Set Subscripton 
Select-AzureSubscription -Default -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-457f21993796"  # Set Default 
Select-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-457f21993796" -Current  # Set Current 

# Change Account AND Default & Current Subscription 
Add-AzureAccount   #  Add cached creds for @Microsoft 
Get-azureAccount  # List Azure Accounts 
 