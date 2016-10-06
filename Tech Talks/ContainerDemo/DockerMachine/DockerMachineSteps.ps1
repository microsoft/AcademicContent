# Install the Azure Resource Manager modules from the PowerShell Gallery
Install-Module AzureRM -Force

# Loging to your Azure Account
Login-AzureRmAccount

# To view all subscriptions for your account
Get-AzureRmSubscription

# Get Subscription ID - Single subscription 
$SubscriptionId = (Get-AzureRmSubscription).SubscriptionId

# Get Subscription ID - Multiple subscriptions
#Get-AzureRmSubscription
#$SubscriptionId = (Get-AzureRmSubscription -SubscriptionName "<your_subscription_name>").SubscriptionId


# Create Azure VM using Docker Machine
# Example:
# $DockerMachineVMName = "DockerMachineVM1"
# $Region = "West Europe"
# $ResourceGroup = "Docker"

$DockerMachineVMName = "<vm_name>"
$Region = "<azure_region>"
$ResourceGroup = "<resource_group_name>"

# Example:
# $DockerMachineVMName = "dockermachinevm"
# $Region = "West Europe"
# $ResourceGroup = "Docker"

docker-machine create --driver azure `
    --azure-subscription-id $SubscriptionId `
    --azure-location $Region `
    --azure-resource-group  $ResourceGroup `
    --azure-image "canonical:UbuntuServer:16.04.0-LTS:latest"  `
     $DockerMachineVMName


#View connection details
docker-machine env $DockerMachineVMName

#To connect Docker Client to the new VM
docker-machine env $DockerMachineVMName | Invoke-Expression

# Verify connected
docker info