# Script: Bulk Create Users, Resource Groups and Assign RBAC Permissions - Proof of Concept 
#
# NOTE: Script does not have any error handling etc you need to ensure the CSV Files 
#       contain the correct headers and you enter the correct path when running the commands in powershell window. 
###########################################

#Import Azure Modules into Powershell

Import-Module azure
Import-Module msonline

#This function prompts the user for a username and password of the Azure Main Account Owner

function Set-Credentials {
    $Global:Cred = Get-Credential
}

#This function creates new users
#If you already have users existing in AAD or users have existing accounts do not run this
function New-Users {
 param
(
    [Parameter(Mandatory=$true, HelpMessage='Data Input')]
    [ValidateNotNull()]
    [string] $UserDataPath
)    
    $InputCsv = Import-Csv -Path $UserDataPath  
    Connect-MsolService -Credential $cred
    foreach ($row in $inputCsv){

        New-MsolUser -UserPrincipalName $row.UserPrincipalName -DisplayName $row.DisplayName -FirstName $row.FirstName -LastName $row.LastName -Password $row.Password -ForceChangePassword $false

    }
}

#This function add new Resources Groups
function New-ResourceGroups {
param
(
    [Parameter(Mandatory=$true, HelpMessage='Data Input')]
    [ValidateNotNull()]
    [string] $ResourceGroupsPath
)
    $InputCsv = Import-Csv -Path $ResourceGroupsPath
    Login-AzureRmAccount -Credential $cred
    foreach ($row in $InputCsv){
    
        New-AzureRmResourceGroup -Name $row.ResourceGroupName -Location $row.Location
        Write-Host "$($row.ResourceGroupName) was created successfully"
    }        
}

#This function uses Role Based Access Control to assign the users to resource groups
function Set-RBACPermissions {
param
(
    [Parameter(Mandatory=$true, HelpMessage='Data Input')]
    [ValidateNotNull()]
    [string] $RBACPermissions
)
    $InputCsv = Import-Csv -Path $RBACPermissions
    Login-AzureRmAccount -Credential $cred
    foreach ($row in $InputCsv){
        
        New-AzureRmRoleAssignment -SignInName $row.UserPrincipalName -ResourceGroupName $row.ResourceGroupName -RoleDefinitionName "Contributor"
        Write-Host "$($row.UserPrincipalName) was successfully added into the Contributor Role for $($row.ResourceGroupName)"
    }

}
