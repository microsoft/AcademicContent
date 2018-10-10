##Instructions

1. Open the base.parameters.json file and ensure you set the storageAccountName parameter to something globally unique.
2. You can call the resource group anything you want but make sure that in subsequent scripts you update their parameters files to reflect the new name for the baseresourcegroup.
3. Run the commands below:-

	Add-AzureRMAccount .\Build.ps1 -ResourceGroupName Base -ResourceGroupLocation "WestEurope"