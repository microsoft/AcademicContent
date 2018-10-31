# Using Docker Machine to provision a VM running Docker on Azure
_Docker Machine_ facilitates the creation and management of hosts running Docker engine [https://docs.docker.com/machine/overview/](https://docs.docker.com/machine/overview/) . This could be a host running within a VM on your local machine, via technologies such as Hyper-V or in a public cloud such as Microsoft Azure. Docker Machine uses _drivers_ to enable deployment to different platforms.

During this post we will provision a VM running Docker on Microsoft Azure using the Azure driver for Docker Machine which is documented here: [https://docs.docker.com/machine/drivers/azure/](https://docs.docker.com/machine/drivers/azure/) .

The PowerShell in this post are all included in the file [DockerMachineSteps.ps1](DockerMachineSteps.ps1) to reduce the need to copy/paste commands.

NOTE: The following process uses PowerShell which is currently in preview on Linux and Mac. I have tested the steps on Ubuntu 16.04 but as cross platform PowerShell support . The Azure CLI can be used as an alternative to PowerShell on none Windows platforms.

# Install Prerequisites
## PowerShell

If you haven't already got PowerShell installed on your system (potentially a you are using a none Windows OS) follow the instructions applicable for your operating system: [https://github.com/PowerShell/PowerShell](https://github.com/PowerShell/PowerShell)

## Azure PowerShell Module

1. Open a PowerShell prompt by typing ```powershell``` at a command prompt/terminal:

    ```
    powershell
    ```
2. Run the command:

    ```
    Install-Module AzureRM -Force
    ```
    
NOTE: If you have problems getting the above commands to work and are using a Linux/Mac OS please check out the following article:
[https://blogs.technet.microsoft.com/jessicadeen/azure/getting-started-with-powershell-core-and-azurerm-modules-on-ubuntu-and-os-x/](https://blogs.technet.microsoft.com/jessicadeen/azure/getting-started-with-powershell-core-and-azurerm-modules-on-ubuntu-and-os-x/)

## Docker

### Docker for Windows/Mac

Includes Docker CLI Client, Docker Engine, Docker Compose and Docker Machine:

- Windows: [https://docs.docker.com/machine/install-machine/](https://docs.docker.com/machine/install-machine/)
- Mac: [https://docs.docker.com/docker-for-mac/](https://docs.docker.com/docker-for-mac/)

### Linux:

Requires individual installation of Docker components

- Docker Engine: [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/)
- Docker Machine: [https://docs.docker.com/machine/install-machine/](https://docs.docker.com/machine/install-machine/)

# Retrieve your Azure Subscription ID

1. Log in to Azure:

    ```
    Login-AzureRmAccount
    ```

2. Retrieve your subscription ID:
    - If you only have one Azure subscription:
    
    ```
    $SubscriptionId = (Get-AzureRmSubscription).SubscriptionId
    ```
    
    - If you have multiple Azure subscriptions
        1. View list of subscriptions find the name of the subscription you wish to use:

        ```
        Get-AzureRmSubscription
        ```

        2. Replace <your_subscription_name> with the name of the subscription:
    
        ```
        $SubscriptionId= (Get-AzureRmSubscription-SubscriptionName '<your_subscription_name>').SubscriptionId
        ```

# Create a virtual machine on Azure running Docker Engine

1. To configure variables required to provision the VM run the following lines with your preferred values. A list of current Microsoft Azure regions can eb found here: https://azure.microsoft.com/regions/

    ```
    $DockerMachineVMName = '<vm_name>'

    $Region = '<azure_region>'

    $ResourceGroup = '<resource_group_name>'
    ```
    
    
2. To create the VM, run the following command. The parameters used  and additional parameters are documented here: [https://docs.docker.com/machine/drivers/azure/](https://docs.docker.com/machine/drivers/azure/) .

    ```
    docker-machine create --driver azure `
    --azure-subscription-id $SubscriptionId `
    --azure-location $Region `
    --azure-resource-group  $ResourceGroup `
    --azure-image "canonical:UbuntuServer:16.04.0-LTS:latest"  `
     $DockerMachineVMName
    ```
Please follow any instructions output by the command that may be required to authenticate with Azure. Wait while the virtual machine is provisioned. This may take 5 minutes or more.

# Connect to the VM

1. Run the following command to view the details required to connect Docker Machine to the VM:
 
    ```
    docker-machine env $DockerMachineVMName
    ```
2. To connect Docker machine to the new VM:

    ```
    docker-machine env $DockerMachineVMName | Invoke-Expression
    ```
3. Verify connected to Docker Engine on the VM:

    ```
    docker info
    ```
Congratulations you are now connected to your new Docker VM!