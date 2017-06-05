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
version="1.0.0"

#
# Purpose: Print usage
#
usage() {
	echo -n "$0 managing Azure resources

	Script [options] application [arguments]

	Options:
	-id, --classid     CLASSID specify time-based GUID developed for the subscription
	-a,  --action      ACTION specify the task describes the action

	     Allowed actions:
		 -start        The operation to power off (stop) a virtual machine.
		 -stop         The operation to start a virtual machine.
		 -restart      The operation to restart a virtual machine.
		 -redeploy     The operation to redeploy a virtual machine.
		 -delete       The operation to delete a resource groups

	-h,  --help        Display this help and exit
	-v,  --version     Output version information and exit

    Example: $0 -id a1bd73741dda -a start

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
			echo start "$action"ing VMs: "$resourceGroups"
			az vm list --query "[?tags.ClassID == '$classId'][resourceGroup,name]" --out tsv | xargs -L1 bash -c 'az vm '$action' --no-wait -g $0 -n $1'
		fi
	done
}

#
# Purpose: Delete RGs by tag (classID)
#
delete() {
	local classId=$1
	local subscriptions=$2

	for sub in $subscriptions; do
		az account set --subscription "$sub"
		local resourceGroups=""
		resourceGroups=$(az group list --query "[?tags.ClassID == '$classId'].[name]" --output tsv)
		if [ ! -z "$resourceGroups" ]; then
			echo start deleting RGs: "$resourceGroups"
			for rg in $resourceGroups; do
				az group delete --no-wait --yes -n "$rg"
			done
		fi
	done
}

#
# Purpose: Provisioning State of deployment
#
status() {
	local classId=$1
	local subscriptions=$2

	for sub in $subscriptions; do
		az account set --subscription "$sub"
		az group list --tag ClassID=$classId --query '[].{Name:name,Location:location,State:properties.provisioningState}' --out table
	done
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
						echo "no input file specified"
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

	local subscriptions=$(az account list --query [].[id] --output tsv)

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
