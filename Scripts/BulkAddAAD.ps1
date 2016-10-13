##Changing the default file path of where the Data.txt is located
$FilePath = 'C:\Microsoft\Documents\Faculty\AddContributors\data.txt'

Login-AzureRmAccount

##Changing the Azure Subscription to the Current Subscription replace Azure Subscription ID to the Subscription which you want the users to manage
Select-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-122221993796" -Current 

# import csv - headers: SubscriptionID,Email
$data = Import-Csv -Path $FilePath

# cycle through users
foreach ($user in $data)
{
    Select-AzureRmSubscription -SubscriptionId $user.SubscriptionID
    New-AzureRmRoleAssignment -SignInName $user.Email -RoleDefinitionName 'Contributor' -Scope "/subscriptions/$($user.SubscriptionID)"
} 
