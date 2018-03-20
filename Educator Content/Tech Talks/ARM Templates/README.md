##Instructions

These do the following:- 

- CreateBaseResources – This will create an Azure Virtual Network and Storage Account. You only need to run this once. 
- CreateOOBImage – This will create a virtual machine (Win2012R2) and add it to the above network and use the storage account for the main OS disk. You’ll run this whenever you need to build a new machine and add it to the network, however you’ll need to change some basic settings like machine name etc. in the parameters.json file each time you do. One of the more interesting things is that it’s configured with a custom script extension which will download a PowerShell script from a location you configure (in the parameters.json file) and run this once the VM has built. This was needed to trigger the post-configuration of the machine. 
- RemoveVM – This will remove (duh) a virtual machine from the network and clean-up the left over .vhd files from the storage account.

#Tips
- Inside each folder you’ll find some basic instructions on how to use each scripts along with a list of things you might want to change for each deployment 

#Resource on ARM
see https://blogs.msdn.microsoft.com/uk_faculty_connection/2016/11/14/using-azure-resource-manager-templates-with-the-azure-portal-automation-scripts/