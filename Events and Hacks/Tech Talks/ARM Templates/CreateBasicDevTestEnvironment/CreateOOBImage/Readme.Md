##Building a Infrastructure using Azure Resource Manager Templates

1. Open the CreateVM.parameters.json file and ensure the following entires are to your choosing:


- baseresourcegroup - This is the name of the resource group that holds your base VNet and StorageAccount.
- storageAccountName - This needs to be set the same as the StorageAccount created in the base resource group.
- virtualNetworkName - This needs to be set the same as the VirtualNetwork created in the base resource group.
- publisher, offer, sku - These together represent the VM you wish to build. See baseimagenames.txt for more info.
- virtualMachineName - name of the virtual machine you want to build. Must be unique with the resource group.
- virtualMachineSize - Size of the VM in standard Azure unit sizes, e.g. Standard_A4
- adminUsername & adminPassword - Any username except "admin". Password must be longer than 8 chars and must meet complexity requirements. Come on, you know what those are, password123 won't cut it!
- downloadfile1 - The URI to a publically accessible powershell file that will be downloaded after the machine has been built and run, e.g. "https://store45649fkwl.blob.core.windows.net/scripts/dowork.ps1"


2. Once these have been set, run the script like this:-

- Add-AzureRMAccount .\UploadPostBuildScript.ps1 -ResourceGroupName Servers -ResourceGroupLocation "WestEurope"

##Example

Get-AzureRmVMImagePublisher -location "westeurope"
...
MicrosoftSQLServer
...


Get-AzureRmVMImageOffer -location "westeurope" -publishername "MicrosoftSQLServer"
SQL2008R2SP3-WS2008R2SP1
SQL2008R2SP3-WS2012
SQL2012SP2-WS2012
SQL2012SP2-WS2012R2
SQL2012SP3-WS2012R2
SQL2012SP3-WS2012R2-BYOL
SQL2014-WS2012R2
SQL2014SP1-WS2012R2
SQL2014SP1-WS2012R2-BYOL
SQL2014SP2-WS2012R2
SQL2016-WS2012R2
SQL2016-WS2012R2-BYOL
SQL2016-WS2016
SQL2016CTP3-WS2012R2
SQL2016CTP3.1-WS2012R2
SQL2016CTP3.2-WS2012R2
SQL2016RC3-WS2012R2v2


Get-AzureRmVMImageSku -location "westeurope" -publishername "MicrosoftSQLServer" -Offer "SQL2012SP3-WS2012R2"
Enterprise
Express
Standard
Web


Examples - These parameters can be copied into the CreateVM.parameters.json file.
#################################################################################
#################################################################################


WS2012R2
########

	"publisher": {
      "value": "MicrosoftWindowsServer"
    },
    "offer": {
      "value": "WindowsServer"
    },
    "sku": {
      "value": "2012-R2-Datacenter"
    }


SQL 2014 with SP2 on WS2012R2
##############################

    "publisher": {
      "value": "MicrosoftSQLServer"
    },
    "offer": {
      "value": "SQL2014SP2-WS2012R2"
    },
    "sku": {
      "value": "Standard"
    }





