##Changing the default file path of where the Data.txt is located
$FilePath = 'C:\Microsoft\Documents\Faculty\AddContributors\data.txt'

Login-AzureRmAccount


# import csv - headers: SubscriptionID,Email
$data = Import-Csv -Path $FilePath

# cycle through users
foreach ($user in $data)
{
##Changing the Azure Subscription to the Current Subscription replace Azure Subscription ID to the Subscription which you want the users to manage
    Select-AzureRmSubscription -SubscriptionId $user.SubscriptionID -Current
##Adding user with Role of Contributor
    New-AzureRmRoleAssignment -SignInName $user.Email -RoleDefinitionName 'Contributor' -Scope "/subscriptions/$($user.SubscriptionID)"
} 
