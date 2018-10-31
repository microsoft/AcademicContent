##############################
#.SYNOPSIS
#Azure CS University DS Sandboxes Project
#
#.DESCRIPTION
#This script is an addition to the templates.
#Current functions:
# 1. Create a new user
# 2. Downloading the file to the user's desktop
# 3. Execute other scripts
#
##############################

Param (
    [string]$userName,
    [string]$userPassword,
    [string]$url,
    [string]$postInstallFileName
)

function CreateUser () {

    $groupName = "Remote Desktop Users";

    Write-Host "Start creating user: $userName"
    NET USER $userName $userPassword /ADD

    Write-Host "Start adding user to '$groupName'"
    NET LOCALGROUP $groupName $userName /ADD

    Write-Host "User $userName created successfully"
}

function Download () {

    $fileName = [System.IO.Path]::GetFileName($url);
    $path = "C:\$userName\Data";

    if ((Test-Path $path) -eq $false) {
        New-Item -ItemType Directory -Path $path;
        Invoke-WebRequest -Uri $url -OutFile "$path\$fileName";
    }
}

# create new user
CreateUser | Out-Null

if ($url -eq "none") {
    Write-Host "url is empty"
}
else {
    # download file
    Download | Out-Null
}

if ($postInstallFileName -eq "none") {
    Write-Host "postInstallFileName is empty"
}
else {
    #execute other script
    & ((Split-Path $MyInvocation.InvocationName) + "\" + $postInstallFileName)
}
