#!/bin/bash
# ------------------------------------------------------------------
# Title:
#     Azure CS University DS Sandboxes Project
#
# Description:
#     This bash script is developed to allow the capability of spinning multiple VMs 
#     in Azure within different subscriptions.
#
# Dependency:
#     https://github.com/Azure/azure-cli
# ------------------------------------------------------------------

# Current Version
version="1.0.0"

#
# Purpose: Deploys resource groupd with one VM and all supporting infrastructure
#
deploy-vm() {

	#iteration
	local i="$1"
	local vmLocation="$2"
	local outputFile="$3"
	local templateFilePath="$4"
	local inputParameterFile="$5"
	local classNameID="$6"
	local className="$7"
	local vmNameTemplate="$7"
	#replace spaces with - so we could construct resource names
	vmNameTemplate=$(echo $vmNameTemplate | sed 's/ /-/g')
	local subscriptionName="$8"
	local subscriptionID="$9"
	local studentName="${10}"
	local studentEmailAddress="${11}"
	local studentLogin="${12}"
	#can be deleted vmUserName
	local vmUserName=$studentLogin
	local studentPassword="${13}"
	local adminUsernameValue="${14}"
	local vmAdminUserName=$adminUsernameValue
	local adminPasswordValue="${15}"
	local comment="${16}"
	local resourceGroupName=$vmNameTemplate-$i-rg
	#define log file name, the log will be written in same folder as output file
	local logFile="${17}"
	#define VM name
	local VmName=$vmNameTemplate-$i
	local publicIpAddressNameValue=$vmNameTemplate-$i-ip
	local dnsprefix=$vmNameTemplate-$i-"dnsprefix"
	dnsprefix="${dnsprefix,,}" #make dnsprefix lower case
	local virtualNetworkNameValue=$vmNameTemplate-$i-vnet
	local networkInterfaceNameValue=$vmNameTemplate-$i-net
	local networkSecurityGroupNameValue=$vmNameTemplate-$i-nsg

	echo Resource Group $resourceGroupName started to deploy

	#set the default subscription id
	az account set --subscription "$subscriptionID"

	if [ $? != 0 ]; then
		echo Subscription $subscriptionID does not exist. Deployment of the resource group $resourceGroupName will be skipped
		return 1
	fi

	## Create one resource group per VM
	az group create --name $resourceGroupName --location $vmLocation --tags ClassID=$classNameID StudentLogin=$studentLogin StudentEmail=$studentEmailAddress StudentName="$studentName" ClassName="$className" >>$logFile

	if [ $? != 0 ]; then
		echo ResourceGroup $resourceGroupName was not able to deploy due to errors, see $logFile. Deployment of the resource group $resourceGroupName will be skipped
		return 1
	fi

	#generate parameters string using parameters.json file which was received as an input
	param=$(cat $inputParameterFile | sed s#virtualMachineNameValue#"$VmName"#g;)
	param=$(echo $param | sed s#locationValue#$vmLocation#g;)  
	param=$(echo $param | sed s#publicIpAddressNameValue#$publicIpAddressNameValue#g;) 
	param=$(echo $param | sed s#virtualNetworkNameValue#$virtualNetworkNameValue#g;) 
	param=$(echo $param | sed s#networkInterfaceNameValue#$networkInterfaceNameValue#g;)  
	param=$(echo $param | sed s#networkSecurityGroupNameValue#$networkSecurityGroupNameValue#g;)  
	param=$(echo $param | sed s#adminPasswordValue#$adminPasswordValue#g;)
	param=$(echo $param | sed s#studentPasswordValue#$studentPassword#g;)	
	param=$(echo $param | sed s#resourcegroupnamevalue#$resourceGroupName#g;)
	param=$(echo $param | sed s#dnsprefixvalue#$dnsprefix#g;)
	param=$(echo $param | sed s#classIDValue#$classNameID#g;)
	#string with spaces is allowed
	param=$(echo $param | sed s#classNameValue#"$className"#g;)
	param=$(echo $param | sed s#studentEmailValue#$studentEmailAddress#g;)  
	param=$(echo $param | sed s#studentLoginValue#$studentLogin#g;)
	#string with spaces is allowed 
	param=$(echo $param | sed s#studentNameValue#"$studentName"#g;)
	param=$(echo $param | sed s#adminUsernameValue#$adminUsernameValue#g;)  

	## Deploy VMs
	az group deployment create -g $resourceGroupName --template-file $templateFilePath --parameters "$param" --no-wait >>$logFile #2>&1

	outputString="$className","$classNameID","$subscriptionName","$subscriptionID","$studentName","$studentEmailAddress","$vmUserName","$vmAdminUserName","$vmLocation","$VmName","$dnsprefix","$resourceGroupName","$networkSecurityGroupNameValue","$comment"

	#Pass output parameters to output.csv file specifyed by user
	echo $outputString >>$outputfile

	#delete resource group
	#az group delete --name $resourceGroupName --yes --no-wait
}

#
# Purpose: Print usage
#
usage() {
  echo -n "$0 deploys multiple VMs

	Script [options] application [arguments]

	Options:
	-in, --input       INPUTFile specify the input file in csv format (see example: input.csv)
	-out,--output      OUTPUTFILE specify the output file in csv format (see example: output.csv)
	-p,  --parameters  PARAMETERSFILE specify parameters file in json format (see parameters.json)
	-t,  --template    TEMPLATEFILE specify template file in json format (see template.json)
	-l,  --location    LOCATION specify location for the deployment, for example: uswest
	-h,  --help        Display this help and exit
	-v,  --version     Output version information and exit

    Example: $0 -in input.csv -out output.csv -p param.json -t template.json -l westus

	"
}

#
# Purpose: Main function
#
main() {
	local inputfile
	local outputfile
	local templatefile
	local parameterfile
	local location

	#Check version
	if [ $1 == '-v' ] || [ $1 == '--version' ]; then
		echo "$(basename $0) ${version}"
		exit 0
	fi

	#Check is number of arguments is not equal to 10 (5 parameters + 5 keys)
	if [ $# != 10 ]; then
		echo Number of arguments entered is not equal to number of argument expected or some of the values are missing
		usage
		exit 0
	fi

	#Check if every required parameter has been passed as an input
	while test $# -gt 0; do
		case "$1" in
			-h | --help)
				usage
				exit 0
				;;
			-in | --input)
				shift
				if test $# -gt 0; then
					inputfile=$1
				else
					echo "no input file specified"
					exit 1
				fi
				shift
				;;
			-out | --output)
				shift
				if test $# -gt 0; then
					outputfile=$1
				else
					echo "no output file specified"
					exit 1
				fi
				shift
				;;
			-p | --parameters)
				shift
				if test $# -gt 0; then
					parameterfile=$1
				else
					echo "no param file specified"
					exit 1
				fi
				shift
				;;
			-t | --template)
				shift
				if test $# -gt 0; then
					templatefile=$1
				else
					echo "no template file specified"
					exit 1
				fi
				shift
				;;
			-l | --location)
				shift
				if test $# -gt 0; then
					location=$1
				else
					echo "no location specified"
					exit 1
				fi
				shift
				;;
			*)
				echo Unknown parameter
				usage
				exit 0
				;;
		esac
	done

	#Check is files specifyed as inputs exist
	if [ ! -f "$templatefile" ]; then
		echo "Template file: $templatefile not found"
		exit 1
	fi

	if [ ! -f "$parameterfile" ]; then
		echo "Parameter file: $parameterfile not found"
		exit 1
	fi

	if [ ! -f "$inputfile" ]; then
		echo "Input file: $inputfile not found"
		exit 1
	fi

	#login to azure using your credentials if needed
	az account show 1>/dev/null

	if [ $? != 0 ]; then
		az login
	fi

	local classNameID=$(uuidgen -t) #generate time based GUID
	echo Time-based generated GUID for deployment was created:$classNameID. This value will be included in tags of the resource groups and VMs.

	local logFileName=""

	if [[ "$outputfile" == *\/* ]]; then
		logFileName="${outputfile%\/*}/""Deployment-"$classNameID.log
	else
		logFileName="Deployment-"$classNameID.log
	fi

	echo Time-based generated GUID for deployment was created:$classNameID. This value will be included in tags of the resource groups and VMs. >$logFileName

	#Generate columns for input.csv and output.csv
	local columnsInput="ClassName SubscriptionName SubscriptionID StudentName StudentEmailAddress VMUserName VMUserPassword VMAdminUserName VMAdminPassword Comment"
	local columnsOutput="Class Name,Class ID, Subscription Name, Subscription ID,Student Name,Student Email Address,VM UserName,VM Admin UserName,Location,VM Name,Public DNS,Resource Group Name,Security Group Name,Comment"

	#calculate how many VM's we have to provision
	numVMs=0
	while IFS=, read $columnsInput; do
		((numVMs++))
	done <$inputfile

	#deploy RG, VM's and all resources needed
	local i=0
	while IFS=, read $columnsInput; do
		if [ $i -eq 0 ]; then #skip header of the csv file
			#create a header for output file
			echo $columnsOutput >"$outputfile"
		else
			#deploy VM 
			deploy-vm "$i" "$location" "$outputfile" "$templatefile" "$parameterfile" "$classNameID" "$ClassName" "$SubscriptionName" "$SubscriptionID" "$StudentName" "$StudentEmailAddress" "$VMUserName" "$VMUserPassword" "$VMAdminUserName" "$VMAdminPassword" "$Comment" "$logFileName"
		fi
		((i++))

	done <$inputfile

	echo VM deployment is in progress. Check Azure portal to verify the completion.
	echo See logs in $logFileName

	return 0
}

main "$@"
