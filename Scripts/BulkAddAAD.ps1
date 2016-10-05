$FilePath = 'C:\Microsoft\Documents\Faculty\AddContributors\data.txt'

Login-AzureRmAccount

# import csv - headers: SubscriptionID,Email
$data = Import-Csv -Path $FilePath

# cycle through users
foreach ($user in $data)
{
    Select-AzureRmSubscription -SubscriptionId $user.SubscriptionID
    New-AzureRmRoleAssignment -SignInName $user.Email -RoleDefinitionName 'Contributor' -Scope "/subscriptions/$($user.SubscriptionID)"
} 
