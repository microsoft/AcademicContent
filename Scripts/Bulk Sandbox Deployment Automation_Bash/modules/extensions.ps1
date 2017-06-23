Param (
    [string]$userName,
    [string]$userPassword,
    [string]$url
)

# prepare script for stud user and execute

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
