#!/bin/bash
# ------------------------------------------------------------------
# Title:
#     Azure CS University DS Sandboxes Project
#
# Description:
#     The script creates an image from the specified VM
#
# Dependency:
#     https://github.com/Azure/azure-cli
# ------------------------------------------------------------------

# Current Version
version="3.0.0"

#
# Purpose: Create new image
#
createImage() {
	local vmName=$1
	local resourceGroupName=$2
	local hostName=$3
	local userName=$4
	local rand=$(uuidgen -t)
	local outputFile=Image-$rand.log
	local osType=$(az vm show -g $resourceGroupName -n $vmName --query "storageProfile.osDisk.osType" -o tsv)
	local osDiskId=$(az vm show -g $resourceGroupName -n $vmName --query "storageProfile.osDisk.managedDisk.id" -o tsv)
	local location=$(az group show --n $resourceGroupName --query "location" -o tsv)
	local imageResourceGroupName=$resourceGroupName-images
	local plan=$(az vm show -g $resourceGroupName -n $vmName --query "plan.name" -o tsv)
	if [ -z "$plan" ]; then
		plan="Custom"
	fi
	local snapshotName=snap-$osType-$plan-$rand
	local imageName=image-$osType-$plan-$rand

	if [[ $osType == "Linux" ]]; then
		echo "Deprovision VM $vmName"
		ssh -t $userName@$hostName 'sudo waagent -deprovision+user -force;exit'
	else
		echo "For Windows OS, you must connect to the VM, run PowerShell as Administrator and execute:"
		echo "$(tput setaf 3)Start-Process -FilePath C:\Windows\System32\Sysprep\Sysprep.exe -ArgumentList '/generalize /oobe /shutdown /quiet'$(tput sgr 0)"

		read -p "Did you execute this command (y/n)? " answer

		if [ "$answer" = "y" ]; then
			echo
		else
			echo "Execute the required commands."
			exit 1
		fi
	fi

	echo "Deallocating VM $vmName"
	az vm deallocate --resource-group $resourceGroupName --name $vmName

	echo "Generalizing VM $vmName"
	az vm generalize --resource-group $resourceGroupName --name $vmName

	if [ -z "$osDiskId" ]; then
		osDiskId=$(az vm show -g $resourceGroupName -n $vmName --query "storageProfile.osDisk.vhd.uri" -o tsv)
	fi

	az group create --name $imageResourceGroupName --location $location 1>/dev/null

	echo "Creating snapshot $snapshotName"
	az snapshot create -g $imageResourceGroupName -n $snapshotName --source $osDiskId

	snapshotId=$(az snapshot show --name "$snapshotName" --resource-group "$imageResourceGroupName" --query [id] -o tsv)

	echo "Creating image $imageName"
	az image create --resource-group $imageResourceGroupName --name $imageName --source $snapshotId --os-type $osType

	imageId=$(az image show --name "$imageName" --resource-group "$imageResourceGroupName" --query [id] -o tsv)

	if [ $? -ne 0 ]; then
		echo "An error occurred during the image preparation" >>$outputFile
	else
		echo -n "
The image preparation was completed successfully!

To create a new VM, run the following script with parameters: 
$(tput setaf 2)./deploy-vm.sh -in input.csv -out output.csv -l westus -s Standard_DS3_v2 -st premium -d manage -m off -i $imageId$(tput sgr 0)
"
		echo $imageId >>$outputFile
	fi
}

#
# Purpose: Show help information
#
usage() {
	echo -n "$0 prepare vm and create Azure custom image

	Script [options] application [arguments]

Options:
	-vm, 	--vmname			The name of the Virtual Machine.
	-g,  	--group				Name of resource group. 
	-ht, 	--host				Public IP address or DNS url
	-u,  	--username			Virtual Machine username
	-subid, --subscriptionId	Subscription Id

	-h,  	--help        		Display this help and exit
	-v,  	--version     		Output version information and exit

$(tput setaf 4)Important for Windows VM type!$(tput sgr 0)
	To create an image of a virtual machine, you need to prepare the VM by generalizing the VM, deallocating, and then marking the source VM as generalized in Azure.
	
	Connect to the Windows VM, run PowerShell as Administrator and execute:
	$(tput setaf 3)Start-Process -FilePath C:\Windows\System32\Sysprep\Sysprep.exe -ArgumentList '/generalize /oobe /shutdown /quiet'$(tput sgr 0)

Example: 
	$0 -vm <Virtual Machine Name> -g <Resource Group Name> -ht <DNS or IP address> -u <User Name> -subid <Subscription Id>
"
}

#
# Purpose: Main section
#
main() {

	local vmName
	local resourceGroup
	local hostName
	local userName
	local subscriptionId

	if [ $# -eq 0 ]; then
		echo "No arguments supplied"
		usage
		exit 0
	fi

	#Check version
	if [ $1 == '-v' ] || [ $1 == '--version' ]; then
		echo "$(basename $0) ${version}"
		exit 0
	fi

	while test $# -gt 0; do
		case "$1" in
			-h | --help)
				usage
				exit 0
				;;
			-vm | --vmname)
				shift
				if test $# -gt 0; then
					vmName=$1
				else
					echo "no vm name specified"
					exit 1
				fi
				shift
				;;
			-g | --group)
				shift
				if test $# -gt 0; then
					resourceGroup=$1
				else
					echo "no resource group specified"
					exit 1
				fi
				shift
				;;
			-ht | --host)
				shift
				if test $# -gt 0; then
					hostName=$1
				else
					echo "no host name specified"
					exit 1
				fi
				shift
				;;
			-u | --username)
				shift
				if test $# -gt 0; then
					userName=$1
				else
					echo "no username specified"
					exit 1
				fi
				shift
				;;
			-subid | --subscriptionId)
				shift
				if test $# -gt 0; then
					subscriptionId=$1
				else
					echo "no subscriptionId specified"
					exit 1
				fi
				shift
				;;
			*)
				echo "Unknown parameter"
				usage
				exit 0
				;;
		esac
	done

	#Check arguments
	[[ "${vmName:?}" ]]
	[[ "${vmName:?}" ]]
	[[ "${resourceGroup:?}" ]]
	[[ "${hostName:?}" ]]
	[[ "${userName:?}" ]]
	[[ "${subscriptionId:?}" ]]

	#login to azure using your credentials if needed
	az account show 1>/dev/null

	if [ $? != 0 ]; then
		az login
	fi

	#Set the context to the subscription Id
	az account set --subscription $subscriptionId

	createImage "$vmName" "$resourceGroup" "$hostName" "$userName"

	return 0
}

main "$@"
