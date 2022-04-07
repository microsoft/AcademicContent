#region Prep

Login-AzureRmAccount -ServicePrincipal -Tenant  "72f988bf-86f1-41af-91ab-2d7cd011db47" -Credential (Get-Credential -Message "Password" -UserName "74824f88-020e-446b-ba3e-35f75f376987" )
Select-AzureRmSubscription  -SubscriptionName "Demos"

Get-AzureRmResourceGroup -Name  DevOpsDemo-DockerDC  | Get-AzureRmVM | Start-AzureRMVM 
Start-AzureRMVM -Name VSTSBuildLinux -ResourceGroupName "DevEnvironment-VSTSBuildLinux-788587"  
Start-AzureRMVM -Name 2016-TP5-CORE -ResourceGroupName "DevOpsDemo-ContainerHosts"  

$SessionDir = "C:\Users\marrobi\Source\Repos\Microsoft-and-Containers"
cd $SessionDir 
$ServerCoreIP =  (Get-AzureRmPublicIpAddress -Name 2016-TP5-CORE-ip -ResourceGroupName DevOpsDemo-ContainerHosts).IpAddress

#cleanup previous demo

 $env:DOCKER_HOST = "tcp://$($ServerCoreIP):2375"
Get-Container  | Remove-Container -Force
Get-ContainerImage | Where-Object { $_.RepoTags -notlike '*microsoft/windowsservercore*' -notlike '*coreiis*'}  | Remove-ContainerImage

$env:DOCKER_HOST = "npipe://./pipe/docker_engine"
Get-Container  | Remove-Container -Force

# check UCP status
start-process 'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' -ArgumentList  "https://ddc-ctr.westeurope.cloudapp.azure.com/#/applications"


#endregion 

#region Windows Containers

# Connect Docker client to server core VM on Azure 
$env:DOCKER_HOST = "tcp://$($ServerCoreIP):2375"

# Show details of Docker engine connected to
docker info

# Show images, should just be core base image and coreiis
docker images


# Show Docker Hub
Start-Process 'https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=iis&starCount=0'

# How built
cd "CoreIIS"
& "C:\Program Files (x86)\Microsoft VS Code\Code.exe" .
# Already built this using: docker build --tag 'coreiis' .

#Nothing running on port 80...
Start-Process "http://$($ServerCoreIP):81"

# run container based on that image
docker run --name 'coreiis1' -d -p 81:80 'coreiis'

# view web output
Start-Process "http://$($ServerCoreIP):81"

# change to website demo
cd "..\CoreWindowsWebsite"
& "C:\Program Files (x86)\Microsoft VS Code\Code.exe" .

#build the windows website
docker build --tag 'windowswebsite' .

# view nothign on port 81
Start-Process "http://$($ServerCoreIP):82"

#start container based on new image on port 82
docker run --name 'windowswebsite2' -d -p 82:80 'windowswebsite'

# view output
Start-Process "http://$($ServerCoreIP):82"

# view all containers
docker ps -a

# powershell
Get-Container 
Get-Container | Remove-Container -Force

Get-Container

# Proof gone!
Start-Process "http://$($ServerCoreIP):82"

#endregion

#region Docker for Windows
# HAVE A LOOK at Hyper-V and GUI

# connect to Docker for Windows - as I was connected to server core in Azure
$env:DOCKER_HOST = "npipe:////./pipe/docker_engine"

# now connected to Linux OS
docker info

# Show Docker Hub
Start-Process 'https://hub.docker.com/search/?isAutomated=0&isOfficial=0&page=1&pullCount=0&q=nginx&starCount=0'

# show nothing on port 50001
Start-Process 'http://localhost:50001'

# Start instance of nginx
docker run -d -p 50001:80  --name 'nginx1'  nginx

# view running
Start-Process 'http://localhost:50001'

# show kitematic
Start-Process 'C:\Program Files\Docker\Kitematic\Kitematic.exe'

#endregion

#region VSTS
# View Azure Container solutions

Start-Process 'https://portal.azure.com/?feature.customportal=false'

# Docker datacenter
Start-Process  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' -ArgumentList   'https://ddc-ctr.westeurope.cloudapp.azure.com'
Start-Process  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' -ArgumentList   'https://ddc-dtr.westeurope.cloudapp.azure.com'


#Edit, commit and push changes
& "C:\Program Files (x86)\Microsoft VS Code\Code.exe" "C:\Users\marrobi\Source\Repos\example-voting-app"

# View changes on GitHub and view service arch.
Start-Process 'https://github.com/marrobi/example-voting-app/'

#View build and release on VSTS
Start-Process 'https://marrobi.visualstudio.com/Docker%20Example%20Voting%20App/'

# View in UCP
Start-Process  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe' -ArgumentList   'https://ddc-ctr.westeurope.cloudapp.azure.com/#/applications'

# View App
start-process "http://ddc-nlb.westeurope.cloudapp.azure.com:5000/"
start-process "http://ddc-nlb.westeurope.cloudapp.azure.com:5001/"

#endregion