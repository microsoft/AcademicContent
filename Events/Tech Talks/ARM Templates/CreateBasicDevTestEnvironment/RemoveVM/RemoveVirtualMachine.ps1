#
# remove.ps1
#

$resourceGroup=""
$virtualmachine=""
$removedisks = $false

Write-Host "Select the Resource Group from which you wish to remove a VM:-"
$resourceGroups = Get-AzureRMResourceGroup

if ($resourceGroups.Count -eq 0) {Write-Host "No resource groups where found in the current subscription."; exit}

for($count = 0;$count -lt $resourceGroups.Count;$count++)
{
	Write-Host "$count - $($resourceGroups[$count].ResourceGroupName)"
}

$input = Read-Host
$resourceGroup = $resourceGroups[$input].ResourceGroupName

Write-Host "Getting VMs for that Resource Group...."
$vms = Get-AzureRmVM -ResourceGroupName $resourceGroup

if ($vms.Count -eq 0) {Write-Host "No virtual machines where found in that resource group."; exit}


for($count = 0;$count -lt $vms.Count;$count++)
{
	Write-Host "$count - $($vms[$count].Name)"
}

$input = Read-Host
$virtualmachine = $vms[$input].Name

Write-Host "Do you wish to remove the virtual disks associated with $virtualmachine in $resourceGroup ? (Type YES in capitals to confirm)"
$input = Read-Host

if ($input -ceq 'YES') { $removedisks = $true }

.\_Remove.ps1 -ResourceGroupName $resourceGroup -VirtualMachineName $virtualmachine -RemoveVirtualDisks $removedisks








