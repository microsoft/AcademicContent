#!/bin/bash
# ------------------------------------------------------------------
# Title:
#     Azure CS University DS Sandboxes Project
#
# Description:
#     This script allows you to manage the VM in Azure within different subscriptions.
#
# Dependency:
#     https://github.com/Azure/azure-cli
# ------------------------------------------------------------------

# Current Version
version="1.0.4"

#
# Purpose: Print usage
#
usage() {
	echo -n "
Usage: $0 [options...] [arguments...]

This script allows you to manage the VM in Azure within different subscriptions

Options:
-id, --classid     CLASSID specify time-based GUID developed for the subscription
-a,  --action      ACTION specify the task describes the action
--------------------------------------------------------
 Actions related to the VMs:
 -start     The operation to power off (stop) a Virtual Machine
 -stop      The operation to start a Virtual Machine
 -restart   The operation to restart a Virtual Machine
 -redeploy  The operation to redeploy a Virtual Machine

 Actions related to the RGs:
 -status    The operation provisioning state of Deployment
 -delete    The operation deletes the Resource Group by ClassID tag
--------------------------------------------------------
-h,  --help        Display this help and exit
-v,  --version     Output version information and exit
--------------------------------------------------------

Examples:
- Manage VMs: 
$(tput setaf 4)$0 -id aa371ce6-c555-4c21-88b6-246742b8c61d -a start$(tput sgr 0)
- Manage RGs: 
$(tput setaf 4)$0 -id 25b5b6de-79f8-4131-90f1-1ab296ec3a7f -a delete$(tput sgr 0)
--------------------------------------------------------
"
}

#
# Purpose: Manage Virtual Machines
#
manage() {
	local classId=$1
	local action=$2
	local subscriptions=$3
	local resourceGroups=""

	for sub in $subscriptions; do
		az account set --subscription "$sub"
		resourceGroups=$(az vm list --query "[?tags.ClassID == '$classId'][resourceGroup,name]" --out tsv)
		if [ ! -z "$resourceGroups" ]; then
			echo running action: "$action"
			az vm list --query "[?tags.ClassID == '$classId'][resourceGroup,name]" --out tsv | xargs -L1 bash -c 'az vm '$action' -g $0 -n $1 --no-wait'
		fi
	done
	echo action "$action" in progress. Check Azure portal to verify the completion.
}

#
# Purpose: Delete RGs by tag (classID)
#
delete() {
	local classId=$1
	local subscriptions=$2
	local state=0

	for sub in $subscriptions; do
		az account set --subscription "$sub"
		local resourceGroups=""
		resourceGroups=$(az group list --query "[?tags.ClassID == '$classId'].[name]" --output tsv)
		if [ ! -z "$resourceGroups" ]; then
			for rg in $resourceGroups; do
				az group delete --no-wait --yes -n "$rg"
				echo $rg deleting in progress...
			done
			state=1
		fi
	done

	if [ $state == "1" ]; then
		echo Check Azure portal to verify the completion.
	else
		echo No resource groups for deletion
	fi
}

#
# Purpose: Provisioning State of deployment
#
status() {
	local classId=$1
	local subscriptions=$2
	local state=0

	for sub in $subscriptions; do
		az account set --subscription "$sub"
		local resourceGroups=""
		resourceGroups=$(az group list --query "[?tags.ClassID == '$classId'].[name]" --output tsv)
		if [ ! -z "$resourceGroups" ]; then
			echo ""
			echo "ResourceGroup | State"
			echo "-------------------------"
			for rg in $resourceGroups; do
				az group deployment list -g $rg --query '[].{ResourceGroup:resourceGroup,State:properties.provisioningState}' --out tsv
			done
			state=1
		fi
	done

	if [ $state == "0" ]; then
		echo "Resource Groups with ClassID: $classId not found"
	fi
}

main() {

	local classId=""
	local action=""

	{
		#Check version
		if [ $1 == '-v' ] || [ $1 == '--version' ]; then
			echo "$(basename $0) ${version}"
			exit 0
		fi

		#Check is number of arguments is not equal to 4 (2 parameters + 2 keys)
		if [ $# != 4 ]; then
			echo Number of arguments entered is not equal to number of argument expected or some of the values are missing
			usage
			exit 0
		fi

		while test $# -gt 0; do
			case "$1" in
				-h | --help)
					usage
					exit 0
					;;
				-id | --classid)
					shift
					if test $# -gt 0; then
						classId=$1
					else
						echo "no classId specified"
						exit 1
					fi
					shift
					;;
				-a | --action)
					shift
					if test $# -gt 0; then
						action=$1
					else
						echo "no action specified"
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
	}

	#login to azure using your credentials if needed
	az account show 1>/dev/null

	if [ $? != 0 ]; then
		az login
	fi

	local subscriptions=$(az account list --all --query [].[id] --output tsv)

	case "$action" in
		"delete")
			delete "$classId" "$subscriptions"
			;;
		"start" | "stop" | "restart" | "redeploy")
			manage "$classId" "$action" "$subscriptions"
			;;
		"status")
			status "$classId" "$subscriptions"
			;;
		*)
			echo "Unknown parameter"
			usage
			exit 0
			;;
	esac

	return 0
}
main "$@"
