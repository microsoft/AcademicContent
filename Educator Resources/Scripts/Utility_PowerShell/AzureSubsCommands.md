Purpose: Demonstrate how Azure Subscriptions work and how to change default and current subscription 
Description: Shows how to work with changing accounts, and subscriptions in Azure using PowerShell 

#Limitations/Prerequisite:  
 
* Must Run PowerShell
* Requires PowerShell Azure Module https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure 

#listing current Azure user
This will bring back user ID, Type, Subscriptions, Tenants

Get-AzureAccount

# Remove All Powershell Cached Credentials:  
this is especially helpful to get rid of old accounts that have expired! 
Get-AzureAccount | ForEach-Object { Remove-AzureAccount $_.ID -Force }  
 
# List Azure Subscriptions 
get-AzureSubscription | Format-table SubscriptionName, isDefault, isCurrent, DefaultAccount, subscriptionid 

#Add Cached creditional for AAD or MSA 
Add-AzureAccount   
 
# List Azure Subscriptions in a table
get-AzureSubscription | Format-table SubscriptionName, isDefault, isCurrent, DefaultAccount, subscriptionid 
 
#Setting An Azure Subscription
Set Subscription 

Set-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-22223321993796"               

Set As Default 
Select-AzureSubscription -Default -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-1111f21993796"   

Set as Current 
Select-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-122221993796" -Current  

 
