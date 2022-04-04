# Bulk add users via AAD in Powershell

This Powershell script will read a list of existing user o365 Azure Active Directory accounts and subscriptions from a txt file. It will assign an Azure subscription to each of the students or AAD Groups.

## Powershell

PowerShell is now open source, and available for Linux and Mac. You can download official packages from Microsoft for the 64-bit versions of Ubuntu 16.04, Ubuntu 14.04, CentOS 7, Red Hat Enterprise Linux 7, and Mac OS X 10.11.

## Powershell Getting started

[Getting Started using Powershell on Linux](https://docs.microsoft.com/powershell/scripting/install/installing-powershell-core-on-linux?WT.mc_id=academiccontent-github-cxa)
[Powershell on Windows](https://docs.microsoft.com/powershell/scripting/install/installing-powershell-core-on-windows?WT.mc_id=academiccontent-github-cxa)

## User Account Permissions

The user running the script simply needs to be overall Azure Subscription Owner and a Member of the AAD which is the same as the users.

## Create your data text file

Create a file called `data.txt`. Each line of the csv file should include the following fields in order:

```output
SubscriptionID, Email
```

> For email this is the AAD useraccount @ domain not the users email alias, for example it may be in the following format `yiycc@<somewhere>.ac.uk` not `Chris.Charles@<somewhere>.ac.uk`

### Example

```output
SubscriptionID,Email
0786686c376-d76d-4704-b1f3-8505ffc999d5,flappaga@****.ac.uk
07892238361-d72d-4724-b143-8505ffc999d5,colina@****.ac.uk
```

Update the `$FilePath` in the `BulkAddAAD.ps1` to point to this newly created file. This file also passes a parameter to the create command to specify the role to assign to the new users - `-RoleDefinitionName 'Contributor'`. Usually this will be `Contributor` but change this value in the script if you want to assign users a different role.

## Change the Azure Subscription to the Current Subscription

Run this command to set your current Azure subscription to the one you want to add accounts to:

```ps
Select-AzureSubscription -SubscriptionId "<subscription_id>" -Current
```

Replace `<subscription_id>` to the subscription you want to add accounts to.

## Execute the script

Navigate to the directory where the script lives

```ps
cd C:\my_path\yada_yada\
```

Execute the script:

```ps
.\BulkaddAAD.ps1
```

Or you can run the PowerShell script from the command prompt or terminal like this:

```sh
powershell -noexit C:\my_path\yada_yada\BulkaddAAD.ps1
```
