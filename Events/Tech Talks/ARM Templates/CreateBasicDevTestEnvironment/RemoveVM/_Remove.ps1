Param(
    [string] [Parameter(Mandatory=$true)] $ResourceGroupName,
	[string] [Parameter(Mandatory=$true)] $VirtualMachineName,
	[bool] [Parameter(Mandatory=$true)] $RemoveVirtualDisks
	)

Write-Host -NoNewline "Now removing the $VirtualMachineName virtual machine from $ResourceGroupName resource group."

$vm = get-azurermvm -resourcegroup $ResourceGroupName -name $VirtualMachineName
$osDiskUri = $vm.StorageProfile.OSDisk.Vhd.Uri
$osDiskContainerName = $osDiskUri.Split('/')[-2]
$osDiskStorageAccount = ($osDiskUri.Split('/')[-3]).Split('.')[0]
$osDiskName = $osDiskUri.Split('/')[-1] 

$resources = (Find-AzureRmResource -TagName "i-am-used-in-server" -TagValue $VirtualMachineName)

$resources | remove-azurermresource -Confirm:$false -Force



Write-Host "Done."

# Remove orphaned disk in storage account - https://store45649fkwl.blob.core.windows.net/vhds/serverx20169614487.vhd
if($RemoveVirtualDisks) {
	Write-Host 'Removing OS disk...'
	
	$baseResourceGroup = (Find-AzureRmResource -Name $osDiskStorageAccount -ResourceType "Microsoft.Storage/storageAccounts").ResourceGroupName

	$osDiskStorageAcct = Get-AzureRmStorageAccount -ResourceGroupName $baseResourceGroup -Name $osDiskStorageAccount

	$osDiskStorageAcct | Remove-AzureStorageBlob -Container $osDiskContainerName -Blob $osDiskName
	#Write-Verbose -Message 'Removing the OS disk status blob...'
	#$osDiskStorageAcct | Get-AzureStorageBlob -Container $osDiskContainerName -Blob "$($vm.Name)*.status" | Remove-AzureStorageBlob

	Write-Host "Done."
}





