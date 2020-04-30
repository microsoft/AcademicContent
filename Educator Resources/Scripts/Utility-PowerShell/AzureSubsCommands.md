# Azure subscriptions commands

These examples show how to work with changing accounts, and subscriptions in Azure using PowerShell.

## Limitations/Prerequisites

* Must Run PowerShell
* Requires PowerShell Azure Module which can be installed from [here](https://docs.microsoft.com/powershell/azure/install-az-ps)

## List current Azure user

This will bring back user ID, Type, Subscriptions, Tenants

```ps
Get-AzureAccount
```

## Remove All Powershell Cached Credentials

This is especially helpful to get rid of old accounts that have expired!

```ps
Get-AzureAccount | ForEach-Object { Remove-AzureAccount $_.ID -Force }  
```

## List Azure Subscriptions

```ps
get-AzureSubscription | Format-table SubscriptionName, isDefault, isCurrent, DefaultAccount, subscriptionid
```

## Add Cached credentials for AAD or MSA

```ps
Add-AzureAccount
```

## List Azure Subscriptions in a table

```ps
get-AzureSubscription | Format-table SubscriptionName, isDefault, isCurrent, DefaultAccount, subscriptionid
```

## Set An Azure Subscription

### Set Subscription

```ps
Set-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-22223321993796"
```

### Set As Default

```ps
Select-AzureSubscription -Default -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-1111f21993796"
```

### Set as Current

```ps
Select-AzureSubscription -SubscriptionId "090fa8f2-cc0e-4d36-8cc7-122221993796" -Current  
```
