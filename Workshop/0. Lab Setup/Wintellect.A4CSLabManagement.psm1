<# 
 .Synopsis
  Starts all of the VM's in the specified A4CS lab.

 .Description
  Starts up all of the VM's in the indicated A4CS lab.
#>
function Start-Azure4CSLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName)
        
    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    $startParams = @{
        LabName=$LabName
    }
    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $startParams
    Start-DevTestLabVMs @startParams


}

<# 
 .Synopsis
  Stops all of the VM's in the specified A4CS lab.

 .Description
  Transitions all of the VM's in the indicated A4CS lab to a Stopped/Deallocated state.
#>
function Stop-Azure4CSLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName)

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    $stopParams = @{
        LabName=$LabName
    }
    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $stopParams
    Stop-DevTestLabVMs @stopParams
}

<# 
 .Synopsis
  Resets the VMs in the specified A4CS lab.

 .Description
  Resets the specified Azure for Computer Science lab instance, deleting all of the VM's currently in the lab and reprovisioning new 
  VM's in their place.
#>
function Reset-Azure4CSLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName,

        [Parameter()]
        [String]
        $CustomImageName = "A4CSBase",

        [Parameter()]
        [ValidateSet('Standard_D1_v2','Standard_D2_v2','Standard_D3_v2','Standard_F1','Standard_F2','Standard_F4')]
        [String]
        $VMSizeName = "Standard_D2_v2",

        [Parameter()]
        [Byte]
        [ValidateScript({$_ -ge (0)})]
        $NumberOfCopies = 0,
        
        [Parameter()]
        [String]
        $VMRootName = "A4CSVM",

        [Parameter()]
        [Byte]
        $FirstMachineIndex = 1,

        [Parameter()]
        [String]
        $UserName = "AzureUser",

        [Parameter()]
        [SecureString]
        $Password,

        [Switch]
        $InitiallyStopVMs
    )

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    # Set password to default (secure string) if it is empty
    if (!$Password) 
    {
        $Password = ConvertTo-SecureString "Azure4cs!" -AsPlainText -Force
    }

    $resetParams = @{
        LabName=$LabName
        CustomImageName=$CustomImageName
        VMSizeName=$VMSizeName
        NumberOfCopies=$NumberOfCopies
        VMRootName=$VMRootName
        FirstMachineIndex=$FirstMachineIndex
        UserName=$UserName
        Password=$Password
        InitiallyStopVMs=$InitiallyStopVMs
    }

    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $resetParams
    Reset-DevTestLabVMs @resetParams
}

<# 
    .Synopsis
    Removes all of the VM's from the specified lab.

    .Description
    Deletes all of the VMs from the specified Azure for Computer Science lab instance.

    .Parameter LabName
    The name of an existing Azure DevTest Lab instance lab from which the VMs will be removed.
#>
function Remove-Azure4CSLabVMs
{
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName
    )

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    $removeParams = @{
        LabName=$LabName
    }
    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $removeParams
    Remove-DevTestLabVMs @removeParams
}

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
  (Optional) The name of the size of the VMs to be created.  Limited to a given subset of the available Azure VM sizes.  Defaults to Standard D2-v2

 .Parameter NumberOfCopies
  (Optional) The number of VM's to create.  Must be 1 or greater.  Defaults to 1.
  
 .Parameter VMRootName
  (Optional) The root name for each VM being created.  Defaults to 'A4CSVM'.

 .Parameter FirstMachineIndex
  (Optional) The index to use for the first machine in the set.  VM's are named by combining the root name and the index of each machine.  Defaults to '1'.

 .Parameter UserName
  (Optional) The login user name to provision for the VM.  Defaults to 'AzureUser'.

 .Parameter Password
  (Optional) The login password to provision for the VM.  Defaults to 'Azure4CS!'.

  .Parameter InitiallyStopVMs
  Switch that controls whether VM's that are added are immediately moved to a Stopped state (false by default)

 .Example
   # Create 2 VM's in the Lab "A4CSLab" with the default VM Size (Standard D2-v2)
   Add-Azure4CSLabVMs -LabName A4CSLab -NumberOfCopies 2
#>
function Add-Azure4CSLabVMs
{
    # [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [Parameter(Mandatory=$true)]
        [String]
        $LabName,

        [Parameter()]
        [String]
        $CustomImageName = "A4CSBase",

        [Parameter()]
        [ValidateSet('Standard_D1_v2','Standard_D2_v2','Standard_D3_v2','Standard_F1','Standard_F2','Standard_F4')]
        [String]
        $VMSizeName = "Standard_D2_v2",

        [Parameter()]
        [Byte]
        [ValidateScript({$_ -ge (1)})]
        $NumberOfCopies = 1,
        
        [Parameter()]
        [String]
        $VMRootName = "A4CSVM",

        [Parameter()]
        [Byte]
        $FirstMachineIndex = 1,

        [Parameter()]
        [String]
        $UserName = "AzureUser",

        [Parameter()]
        [SecureString]
        $Password,

        [Switch]
        $InitiallyStopVMs
    )

    _dumpCommand -CommandName $MyInvocation.MyCommand -BoundParams $PSBoundParameters

    #Set password to default (secure string) if it is empty
    if (!$Password) 
    {
        $Password = ConvertTo-SecureString "Azure4cs!" -AsPlainText -Force
    }

    $addParams = @{
        LabName=$LabName;
        CustomImageName=$CustomImageName;
        VMSizeName=$VMSizeName;
        NumberOfCopies=$NumberOfCopies;
        VMRootName=$VMRootName;
        FirstMachineIndex=$FirstMachineIndex;
        UserName=$UserName;
        Password=$Password;
        InitiallyStopVMs=$InitiallyStopVMs
    }

    _splatCmdletParams -BoundParams $PSBoundParameters -OutParams $addParams
    Add-DevTestLabVMs @addParams
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

Import-Module .\Wintellect.DevTestLabManagement.psm1 -Force

Export-ModuleMember -Function Add-Azure4CSLabVMs
Export-ModuleMember -Function Remove-Azure4CSLabVMs
Export-ModuleMember -Function Reset-Azure4CSLabVMs
Export-ModuleMember -Function Start-Azure4CSLabVMs
Export-ModuleMember -Function Stop-Azure4CSLabVMs
