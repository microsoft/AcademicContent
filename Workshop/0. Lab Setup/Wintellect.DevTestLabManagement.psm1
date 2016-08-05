<# 
    .Synopsis
    Provisions one or more VM's into an Azure DevTest Lab.

    .Description
    Adds instances of the indicated VM image to the specified lab.  Allows setting the size of the VM's, the number of copies to create, 
    the root name of each of the new VMs, the index to use for the first machine's naming, and the username & password to configure to allow 
    users to sign into each VM.

    .Parameter LabName
    The name of an existing Azure DevTest Lab instance lab where the new VMs will be created.

    .Parameter CustomImageName
    The name of the custom VM image to be used as a template for the VM's being provisioned.

    .Parameter VMSizeName
    The name of the size of the VMs to be created.  Limited to the available Azure VM sizes for the lab's region (use Get-AzureRmVmSize to determine options.)

    .Parameter NumberOfCopies
    (Optional) The number of VM's to create.  Must be 1 or greater.  Defaults to 1.

    .Parameter VMRootName
    The root name for each VM being created.

    .Parameter FirstMachineIndex
    (Optional) The index to use for the first machine in the set.  VM's are named by combining the root name and the index of each machine.  Defaults to '1'.

    .Parameter UserName
    The login user name to provision for the VM.

    .Parameter Password
    The login password to provision for the VM.

    .Parameter InitiallyStopVMs
    Switch that controls whether VM's that are added are immediately moved to a Stopped state (false by default)

    .Example
    Create 2 VM's in the Lab "MyLab" with the VM Size Standard D2-v2
    Add-DevTestLabVMs -LabName MyLab -CustomImageName MyCustomImage -NumberOfCopies 2 -VMSizeName Standard_D2_v2 -UserName Fred -Password Passw0rd!
#>
function Add-DevTestLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName,

        [Parameter(Mandatory=$true)]
        [String]
        $CustomImageName,

        [Parameter(Mandatory=$true)]
        [String]
        $VMSizeName,

        [Parameter()]
        [Byte]
        [ValidateScript({$_ -ge (1)})]
        $NumberOfCopies = 1,
        
        [Parameter(Mandatory=$true)]
        [String]
        $VMRootName,

        [Parameter()]
        [Byte]
        $FirstMachineIndex = 1,

        [Parameter(Mandatory=$true)]
        [String]
        $UserName,

        [Parameter(Mandatory=$true)]
        [SecureString]
        $Password,

        [Switch]
        $InitiallyStopVMs
    )

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    # Get the subscription ID (acts as a check to make sure user is signed in)
    $subscriptionId = _getSubscriptionId

    # Get the Resource Group Name for the lab
    $labResourceGroupName = _getLabResourceGroupName -LabName $LabName

    # Get the VM Size object from the specified VM Size Name
    $vmSize = _getAzureVMSizeFromName -VMSizeName $VMSizeName

    # Set the Custom Image Resource ID
    $customImageId = "/subscriptions/$subscriptionId/resourceGroups/$labResourceGroupName/providers/Microsoft.DevTestLab/labs/$LabName/customImages/$CustomImageName"

    # Add the VM's based on the custom image
    $message = "Adding $VMRootName #:$NumberOfCopies, Start:$FirstMachineIndex, Size: $($vmSize.Name) ($($vmSize.NumberOfCores * $NumberOfCopies)) total cores)"
    if ($PSCmdlet.ShouldProcess("Lab $LabName", "Add-DevTestLabVMs ($message)"))
    {
        Write-Verbose "Updating Lab $LabName - $message"
        $deploymentParams = @{
            TemplateFile=".\Template\azuredeploy.json"
            ResourceGroupName=$labResourceGroupName
            existingLabName=$LabName
            existingCustomImageId=$customImageId
            newVMSize=$vmSize.Name
            userName=$UserName
            password=$Password
            labRootVmName=$VMRootName
            numberOfCopies=$NumberOfCopies
            firstMachineIndex=$FirstMachineIndex
        }
        New-AzureRmResourceGroupDeployment @deploymentParams
    }

    # Stop the lab's VM's if requested
    if ($InitiallyStopVMs)
    {
        Write-Verbose "Stopping Lab VMs"
        $stopParams = @{
            LabName=$LabName
        }
        _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $stopParams
        Stop-DevTestLabVMs @stopParams
    }
}

<# 
    .Synopsis
    Removes all of the VM's from the specified lab.

    .Description
    Deletes all of the VMs from the specified DevTest lab instance.

    .Parameter LabName
    The name of an existing Azure DevTest Lab instance lab from which the VMs will be removed.

    .Example
    Remove all of the VM's from the Lab "MyLab"
    Remove-DevTestLabVMs -LabName MyLab
#>
function Remove-DevTestLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName
    )

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    # Get the subscription ID (acts as a check to make sure user is signed in)
    $subscriptionId = _getSubscriptionId

    # Get the Resource Group Name for the lab
    $labResourceGroupName = _getLabResourceGroupName -LabName $LabName

    # Determine the lab VM resources to remove 
    $labVmResources = @(_FindResourcesByResourceGroupNameAndType -ResourceGroupName $labResourceGroupName -ResourceType "Microsoft.DevTestLab/labs/virtualMachines")

    # Remove the VM's by looping and executing the command in parallel, then waiting for them all to finish
    $message = "Removing $($labVmResources.count) VMs"
    if ($PSCmdlet.ShouldProcess("Lab $LabName", "Remove-DevTestLabVMs ($message)"))
    {
        Write-Verbose "Clearing Lab $LabName - $message"

        # The script to be run in parallel
        $sb = {
            param([String]$ResourceId)
            Remove-AzureRmResource -ResourceId $ResourceId -Force
        }

        #TODO - Work on making this parallel processing loop approachshareable instead of duplicated
        $jobInfos = @()
        foreach ($labVmResource in $labVmResources)
        {
            Write-Verbose "Removing $($labVmResource.ResourceId)"

            $ps = [Powershell]::Create()
            $job = $ps.AddScript($sb).AddParameter("ResourceId", $labVmResource.ResourceId)
            $status = $job.BeginInvoke()
            $jobInfos = $jobInfos + [PSCustomObject]@{item=$labVmResource.ResourceId;job=$job;status=$status}
        }

        foreach ($jobInfo in $jobInfos)
        {
            $result = $jobInfo.job.EndInvoke($jobInfo.status)
            Write-Verbose "Remove $($jobInfo.item) completed: $($jobInfo.status.IsCompleted)"
        }
    }
}

<# 
    .Synopsis
    Resets the Virtual Machines for the specified lab.

    .Description
    Resets the Virtual Machines forthe specified lab instance, deleting all of the VM's currently in the lab and reprovisioning new 
    VM's in their place.

    .Parameter LabName
    The name of an existing Azure DevTest Lab instance lab where the new VMs will be created.

    .Parameter CustomImageName
    The name of the custom VM image to be used as a template for the VM's being provisioned.

    .Parameter VMSizeName
    The name of the size of the VMs to be created.  Limited to the available Azure VM sizes for the lab's region (use Get-AzureRmVmSize to determine options.)

    .Parameter NumberOfCopies
    (Optional) The number of VM's to create.  Must be 0 or greater.  Defaults to 0.  A value of 0 indicates that the number of machines to create shoudl be the number 
    of VM's already in the lab prior to the reset.

    .Parameter VMRootName
    The root name for each VM being created.

    .Parameter FirstMachineIndex
    (Optional) The index to use for the first machine in the set.  VM's are named by combining the root name and the index of each machine.  Defaults to '1'.

    .Parameter UserName
    The login user name to provision for the VM.

    .Parameter Password
    The login password to provision for the VM.

    .Parameter InitiallyStopVMs
    Switch that controls whether VM's that are added are immediately moved to a Stopped state (false by default)

    .Example
    Reset the lab "MyLab" with the VM Size Standard D2-v2
    Reset-DevTestLabVMs -LabName MyLab -CustomImageName MyCustomImage -VMSizeName Standard_D2_v2 -UserName Fred -Password Passw0rd!
    
#>
function Reset-DevTestLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName,

        [Parameter(Mandatory=$true)]
        [String]
        $CustomImageName,

        [Parameter(Mandatory=$true)]
        [String]
        $VMSizeName,

        [Parameter()]
        [Byte]
        [ValidateScript({$_ -ge (0)})]
        $NumberOfCopies = 0,
        
        [Parameter(Mandatory=$true)]
        [String]
        $VMRootName,

        [Parameter()]
        [Byte]
        $FirstMachineIndex = 1,

        [Parameter(Mandatory=$true)]
        [String]
        $UserName,

        [Parameter(Mandatory=$true)]
        [SecureString]
        $Password,

        [Switch]
        $InitiallyStopVMs
    )

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    # Get the subscription ID (acts as a check to make sure user is signed in)
    $subscriptionId = _getSubscriptionId

    # Get the Resource Group Name for the lab
    $labResourceGroupName = _getLabResourceGroupName -LabName $LabName

    # Get the VM Size object from the specified VM Size Name
    $vmSize = _getAzureVMSizeFromName -VMSizeName $VMSizeName

    # Determine the lab VM resources to remove
    $labVmResources = @(_FindResourcesByResourceGroupNameAndType -ResourceGroupName $labResourceGroupName -ResourceType "Microsoft.DevTestLab/labs/virtualMachines")
    
    # If # of copies is zero, set # of copies to the current # of VM's already in the lab
    if ($NumberOfCopies -eq 0)
    {
        $NumberOfCopies = $labVmResources.count
    }

    # Clear the lab
    $removeParams = @{
        LabName=$LabName
    }
    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $removeParams
    Remove-DevTestLabVMs @removeParams

    # Add new machines to the lab
    $addParams = @{
	    LabName=$LabName
        CustomImageName=$CustomImageName
        VMSizeName=$vmSize.Name
        NumberOfCopies=$NumberOfCopies
        VMRootName=$VMRootName
        FirstMachineIndex=$FirstMachineIndex
        UserName=$UserName
        Password=$Password
        InitiallyStopVMs=$InitiallyStopVMs
    }
    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $addParams
    Add-DevTestLabVMs @addParams
}

<# 
    .Synopsis
    Starts all of the VM's in the specified lab.

    .Description
    Starts up all of the VM's in the indicated lab.

    .Parameter LabName
    The name of an existing Azure DevTest Lab instance lab where the VMs will be started.
#>
function Start-DevTestLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName)

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters
    
    # Get the subscription ID (acts as a check to make sure user is signed in)
    $subscriptionId = _getSubscriptionId

    # Get the Resource Group Name for the lab
    $labResourceGroupName = _getLabResourceGroupName -LabName $LabName

    # Determine the lab VM resources to start
    $labVmResources = @(_FindResourcesByResourceGroupNameAndType -ResourceGroupName $labResourceGroupName -ResourceType "Microsoft.DevTestLab/labs/virtualMachines")

    # Start the VM's by looping and executing the command in parallel, then waiting for them all to finish
    $message = "Starting $($labVmResources.count) VMs"
    if ($PSCmdlet.ShouldProcess("Lab $LabName", "Start-DevTestLabVMs ($message)"))
    {
        Write-Verbose "Starting Lab $LabName - $message"

        # The script to be run in parallel
        $sb = {
            param([String]$VMName, [String]$ResourceGroupName)
            Start-AzureRmVM -Name $VMName -ResourceGroupName $ResourceGroupName
        }

        #TODO - Work on making this parallel processing loop approachshareable instead of duplicated
        $jobInfos = @()
        foreach ($labVmResource in $labVmResources)
        {
            Write-Verbose "Starting $($labVmResource.ResourceId)"

            $vmName = $labVmResource.ResourceId.split("/")[-1] #VM Name is the last entry in the resource ID
            $vmResource = _FindResourceByResourceNameAndType -ResourceName $vmName -ResourceType "Microsoft.Compute/virtualMachines"

            $ps = [Powershell]::Create()
            $job = $ps.AddScript($sb).AddParameter("VMName", $vmResource.Name).AddParameter("ResourceGroupName", $vmResource.ResourceGroupName)
            $status = $job.BeginInvoke()
            $jobInfos = $jobInfos + [PSCustomObject]@{item=$vmResource.Name;job=$job;status=$status}
        }

        foreach ($jobInfo in $jobInfos)
        {
            $result = $jobInfo.job.EndInvoke($jobInfo.status)
	        Write-Verbose "Start $($jobInfo.item) completed: $($jobInfo.status.IsCompleted)"
        }
    }
}

<# 
    .Synopsis
    Stops all of the VM's in the specified lab.

    .Description
    Transitions all of the VM's in the indicated lab to a Stopped/Deallocated state.

    .Parameter LabName
    The name of an existing Azure DevTest Lab instance lab where the VMs will be stopped.
#>
function Stop-DevTestLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName)

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters
    
    # Get the subscription ID (acts as a check to make sure user is signed in)
    $subscriptionId = _getSubscriptionId

    # Get the Resource Group Name for the lab
    $labResourceGroupName= _getLabResourceGroupName -LabName $LabName

    # Determine the lab VM resources to stop
    $labVmResources = @(_FindResourcesByResourceGroupNameAndType -ResourceGroupName $labResourceGroupName -ResourceType "Microsoft.DevTestLab/labs/virtualMachines")

    # Stop the VM's by looping and executing the command in parallel, then waiting for them all to finish
    $message = "Stopping $($labVmResources.count) VMs"
    if ($PSCmdlet.ShouldProcess("Lab $LabName", "Stop-DevTestLabVMs ($message)"))
    {
        Write-Verbose "Stopping Lab $LabName - $message"

        # The script to be run in parallel
        $sb = {
            param([String]$VMName, [String]$ResourceGroupName)
            Stop-AzureRmVM -Name $VMName -ResourceGroupName $ResourceGroupName -Force
        }

        #TODO - Work on making this parallel processing loop approachshareable instead of duplicated
        $jobInfos = @()
        foreach ($labVmResource in $labVmResources)
        {
            Write-Verbose "Stopping $($labVmResource.ResourceId)"

            $vmName = $labVmResource.ResourceId.split("/")[-1] #VM Name is the last entry in the resource ID
            $vmResource = _FindResourceByResourceNameAndType -ResourceName $vmName -ResourceType "Microsoft.Compute/virtualMachines"

            $ps = [Powershell]::Create()
            $job = $ps.AddScript($sb).AddParameter("VMName", $vmResource.Name).AddParameter("ResourceGroupName", $vmResource.ResourceGroupName)
            $status = $job.BeginInvoke()
            $jobInfos = $jobInfos + [PSCustomObject]@{item=$vmResource.Name;job=$job;status=$status}
        }

        foreach ($jobInfo in $jobInfos)
        {
            $result = $jobInfo.job.EndInvoke($jobInfo.status)
            Write-Verbose "Stop $($jobInfo.item) completed: $($jobInfo.status.IsCompleted)"
        }
    }
}

function _FindResourceByResourceNameAndType
{
    param
    (
        [Parameter(Mandatory=$true)]
        [String]
        $ResourceName,

        [Parameter(Mandatory=$true)]
        [String]
        $ResourceType
    )

    # Use WarningAction = Silently continue to suppress warning about searching by Tags (which is not being done here anyway)
    $resources = @(Find-AzureRmResource -ResourceName $ResourceName -ResourceType $ResourceType -WarningAction:SilentlyContinue)
    $matchedResources = @($resources | Where-Object {$_.ResourceName -eq $ResourceName})
    $matchedResources[0]
}

function _FindResourcesByResourceGroupNameAndType
{
    param
    (
        [Parameter(Mandatory=$true)]
        [String]
        $ResourceGroupName,

        [Parameter(Mandatory=$true)]
        [String]
        $ResourceType
    )

    # Use WarningAction = Silently continue to suppress warning about searching by Tags (which is not being done here anyway)
    $resources = Find-AzureRmResource -ResourceGroupName $ResourceGroupName -ResourceType $ResourceType -WarningAction:SilentlyContinue
    $resources
}

function _splatCmdletParams([Parameter(Mandatory=$true)][Hashtable] $BoundParams, [Parameter(Mandatory=$true)][Hashtable] $OutParams)
{
    if ($BoundParams["Verbose"]){ $OutParams.Add("Verbose", $true) }
    if ($BoundParams["Confirm"]){ $OutParams.Add("Confirm", $true) }
    if ($BoundParams["WhatIf"]){ $OutParams.Add("WhatIf", $true) }
}

function _dumpCommand([Parameter(Mandatory=$true)][String] $CommandName, [Parameter(Mandatory=$true)][Hashtable] $BoundParams)
{
    Write-Verbose $CommandName 
    $BoundParams.GetEnumerator() | ForEach { Write-Verbose `t"[$($_.Key), $($_.Value)]" }
}

function _getSubscriptionId()
{
    # Get the current context to pull the subscription ID - raise an error and stop if there's a problem getting the context (eg not signed in)
    try 
    {
        Write-Verbose "Determining the Subscription ID"
        $context = Get-AzureRmContext
        $subscriptionId = $context.Subscription.SubscriptionId
        Write-Verbose "Subscription ID = $subscriptionId"
        return $subscriptionId
    }
    catch 
    {
        #Write-Error "Error: $_"
        throw
    }
}

function _getLabResourceGroupName([Parameter(Mandatory=$true)][String]$LabName)
{
	Write-Verbose "Determining the Lab Resource Group Name"
    $labResource = _FindResourceByResourceNameAndType -ResourceName $LabName -ResourceType "Microsoft.DevTestLab/labs"
    if ($labResource)
    {
        $labResourceGroupName = $labResource.ResourceGroupName
        Write-Verbose "Lab Resource Group Name = $labResourceGroupName"
        return $labResourceGroupName
    }
    else
    {
        throw "Information for lab $LabName could not be found.  Please check the lab exists in the current subscription."
        #return
    }
}

function _getAzureVMSizeFromName([Parameter(Mandatory=$true)][String]$VMSizeName)
{
	# Get the VM Size object from the specified VM Size Name
    Write-Verbose "Checking VM Size"
    $vmSize = Get-AzureRmVMSize -Location EastUS | Where Name -eq $VMSizeName
    if ($vmSize -eq $null)
    {
        throw "The chosen VM Size $VMSizeName is not available.  Use the command Get-AzureRmVmSize to determine the available VM sizes in the current lab region."
    }
    return $vmSize
}

Export-ModuleMember -Function Add-DevTestLabVMs
Export-ModuleMember -Function Remove-DevTestLabVMs
Export-ModuleMember -Function Reset-DevTestLabVMs
Export-ModuleMember -Function Start-DevTestLabVMs
Export-ModuleMember -Function Stop-DevTestLabVMs
