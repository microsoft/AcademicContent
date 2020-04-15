##Changing the default file path of where the Data.txt is located
$FilePath = 'C:\Microsoft\Documents\Faculty\AddContributors\data.txt'

##This command logs you into Azure Resoure Manager
Login-AzureRmAccount

# import csv - headers: SubscriptionID,Email
$data = Import-Csv -Path $FilePath

# cycle through users within the txt file
foreach ($user in $data)
{
##Azure Subscription ID to the Subscription which you want the users to manage
    Select-AzureRmSubscription -SubscriptionId $user.SubscriptionID 
##Adding user in the txt file with Role of Contributor to Azure Subscription
    New-AzureRmRoleAssignment -SignInName $user.Email -RoleDefinitionName 'Contributor' -Scope "/subscriptions/$($user.SubscriptionID)"
} 
