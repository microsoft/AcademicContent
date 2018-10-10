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
version="1.0.4"

# Show or hide debug information
debugMode=""

# Import modules
import() {
	source "./modules/validators.sh"
}

#
# Purpose: Deploys resource groups with one VM and all supporting infrastructure
#
deploy-vm() {

	#arguments
	#iteration
	local i="$1"
	local vmLocation="$2"
	local outputFile="$3"
	local inputParameterFile="$4"
	local classNameID="$5"
	local className="$6"
	local vmNameTemplate="$6"
	#replace spaces with - so we could construct resource names
	vmNameTemplate=$(echo $vmNameTemplate | sed 's/ /-/g' | sed 's/_/-/g')
	local subscriptionName="$7"
	local subscriptionID="$8"
	local studentName="$9"
	local studentEmailAddress="${10}"
	local studentLogin="${11}"
	#can be deleted vmUserName
	local vmUserName=$studentLogin
	local studentPassword="${12}"
	local adminUsernameValue="${13}"
	local vmAdminUserName=$adminUsernameValue
	local adminPasswordValue="${14}"
	local comment="${15}"
	local resourceGroupName=$vmNameTemplate-$i-rg
	#define log file name, the log will be written in same folder as output file
	local logFile="${16}"
	#define VM size
	local vmSize="${17}"
	local storageType="${18}"
	local downloadFileUrl="${19}"
	local vmType="${20}"
	local disk="${21}"
	local mail="${22}"
	local image="${23}"
	local postInstallFileUri="${24}"
	local templateFolder="${25}"
	local templateFile="${26}"
	local postInstallFileName="none"
	local rand=$(cat /proc/sys/kernel/random/uuid)
	local storageName="storage"${rand:0:8}
	storageName="${storageName,,}"
	#define VM name
	local vmName=$vmNameTemplate-$i
	vmName=${vmName:0:15}
	local publicIpAddressNameValue=$vmNameTemplate-$i-ip
	#define DNS prefix
	local dnsprefix=data-science-${rand:0:6}
	dnsprefix="${dnsprefix,,}"
	local virtualNetworkNameValue=$vmNameTemplate-$i-vnet
	local networkInterfaceNameValue=$vmNameTemplate-$i-net
	local networkSecurityGroupNameValue=$vmNameTemplate-$i-nsg	
	local createOption="FromImage"
	local osType="Unknown"
	#define template type
	local dsTemplate=$templateFolder"template-data-science.json"
	local dsCustomTemplate=$templateFolder"template-from-data-science-image.json"
	local customTemplate=$templateFolder"template-from-custom-image.json"
	local templateFilePath=""
	if [[ -z "$templateFile" ]]; then
		templateFilePath=$dsTemplate
	else
		templateFilePath=$templateFile	
	fi
	local dataDiskType=$disk

	# e.g: https://contoso.com/scripts/ (there are extensions script files)
	local extensionsScriptPathUri="https://raw.githubusercontent.com/MSFTImagine/computerscience/master/Scripts/Bulk-Sandbox-Deployment-Automation-Bash/modules/"
	local fileUris=""

	if [[ $extensionsScriptPathUri == "<extensions_script_path_uri>" ]]; then 
		error "Deployment failed: please specify <extensions_path_uri>"
		return 1
	fi

	#check image type and determine the OS type
	if [[ $image != "none" ]]; then
		#empty option for data disk
		createOption="Empty"
		if [[ $image =~ "linuxdsvmubuntu" ]] ; then
			osType="linux"
			vmType="ds-vm-ubuntu"
			templateFilePath=$dsCustomTemplate
		elif [[ $image =~ "linuxdsvm" ]]; then
			osType="linux"
			vmType="ds-vm-centos"
			templateFilePath=$dsCustomTemplate
		elif [[ $image =~ "standard-data-science-vm" ]]; then
			osType="windows"
			vmType="ds-vm-windows"
			templateFilePath=$dsCustomTemplate
		elif [[ $image =~ "windows2016" ]]; then
			osType="windows"
			vmType="ds-vm-windows-2016"
			templateFilePath=$dsCustomTemplate
		elif [[ $image =~ "Custom" ]]; then
			dataDiskType="empty"
			templateFilePath=$customTemplate
			if [[ $image =~ "Linux" ]] ; then 
				osType="linux"
			elif [[ $image =~ "Windows" ]]; then
				osType="windows"
			fi
		fi
	else
		#define os type from VM
		if [[ $vmType =~ "ubuntu" || $vmType =~ "centos" || $vmType =~ "linux" ]] ; then 
			osType="linux"
		elif [[ $vmType =~ "windows" ]]; then
			osType="windows"
			createOption="Empty"
		fi
	fi

	if [ $osType == "windows" ]; then
		extensionsScriptPathUri=$extensionsScriptPathUri"extensions.ps1"
	else
		extensionsScriptPathUri=$extensionsScriptPathUri"extensions.sh"
	fi

	# validate URLs
	validateUrl "$extensionsScriptPathUri"

	if [[ $postInstallFileUri == "none" ]]; then
		fileUris=$extensionsScriptPathUri
		postInstallFileName="none"
	else
		postInstallFileName=$(basename "$postInstallFileUri")
		validateUrl "$postInstallFileUri"
		fileUris="$extensionsScriptPathUri $postInstallFileUri"
	fi

	if [[ $downloadFileUrl != "none" ]]; then
		validateUrl "$downloadFileUrl"
	fi

	#check for template file
	validateFile "$templateFilePath"

	echo Resource Group $resourceGroupName started to deploy

	#set the default subscription id
	az account set --subscription "$subscriptionID"

	if [ $? != 0 ]; then
		error Subscription $subscriptionID does not exist. Deployment of the resource group $resourceGroupName will be skipped
		return 1
	fi

	#check for existing RG
	local existRg=$(az group show --name $resourceGroupName --query "id" --output tsv)
	if [ -z "$existRg" ]; then
		#create one resource group per VM
		az group create --name $resourceGroupName --location $vmLocation --tags ClassID=$classNameID StudentLogin=$studentLogin StudentEmail=$studentEmailAddress StudentName="$studentName" ClassName="$className" >>$logFile
	else
		echo "A resource group with the $resourceGroupName name already exists in the selected subscription $subscriptionName." >>$logFile
		error "Resource Group $resourceGroupName was not able to deploy due to errors, see $logFile. Deployment of the resource group $resourceGroupName will be skipped"
		return 1
	fi

	#generate parameters string using parameters.json file which was received as an input
	param=$(cat $inputParameterFile | sed s#virtualMachineNameValue#"$vmName"#g;)
	param=$(echo $param | sed s#virtualMachineSizeValue#$vmSize#g;)
	param=$(echo $param | sed s#storageAccountNameValue#$storageName#g;)
	param=$(echo $param | sed s#storageAccountTypeValue#$storageType#g;)
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
	param=$(echo $param | sed s#downloadFileUrlValue#$downloadFileUrl#g;)
	param=$(echo $param | sed s#vmTypeValue#$vmType#g;)
	param=$(echo $param | sed s#diskTypeValue#$disk#g;)
	param=$(echo $param | sed s#imageIdValue#$image#g;)
	param=$(echo $param | sed s#createOptionValue#$createOption#g;)
	param=$(echo $param | sed s#osTypeValue#$osType#g;)
	param=$(echo $param | sed s#dataDiskTypeValue#$dataDiskType#g;)
	param=$(echo $param | sed s#fileUrisValue#"$fileUris"#g;)
	param=$(echo $param | sed s#postInstallFileNameValue#"$postInstallFileName"#g;)

	if [ $? -ne 0 ]; then
		error "An error occurred during the deployment"
		return 1
	fi

	# Deploy VMs
	az group deployment create -g $resourceGroupName --template-file $templateFilePath --parameters "$param" $debugMode --no-wait >>$logFile #2>&1

	outputString="$className","$classNameID","$subscriptionName","$subscriptionID","$studentName","$studentEmailAddress","$vmUserName","$vmAdminUserName","$vmLocation","$vmName","$dnsprefix","$resourceGroupName","$networkSecurityGroupNameValue","$comment"
	
	if [ $mail == "on" ]; then
		#check for send email file
		validateFile "./modules/send-email.sh"
		#Send email to student
		./modules/send-email.sh "$studentEmailAddress" "$studentName" "$vmName" "$osType" "$dnsprefix" "$vmLocation" "$studentLogin" "$studentPassword"
	fi

	#Pass output parameters to output.csv file specifyed by user
	echo $outputString >>$outputfile
}

#
# Purpose: Print text in red color
#
error() {
	echo "$(tput setaf 1)Error! $1$(tput sgr 0)"
}

#
# Purpose: Print usage
#
usage() {
	echo -n "
Usage: $0 [options...] [arguments...]

Sript is developed to allow the capability of spinning multiple VMs in Azure within different subscriptions.

Options:
$(tput setaf 3)Required Parameters:$(tput sgr 0)
-in,   --input         INPUTFILE specify the input file in csv format (see example: input.csv)
-out,  --output        OUTPUTFILE specify the output file in csv format (see example: output.csv)
-l,    --location      LOCATION specify location for the Deployment, for example: westus
-s,    --size          SIZE specify the size for the Virtual Machines, for example: Standard_DS3_v2
---------------------------------------------------------------------
Preferred machine sizes:
  Linux + Windows:
  - Standard_DS2_v2
  - Standard_DS3_v2
  - Standard_DS4_v2
  Windows:
  - Standard_DS11_v2

  Available sizes:
  - Find out more on the available VM sizes in each region at https://aka.ms/azure-regions
---------------------------------------------------------------------

-st, --storage          STORAGETYPE specify the storage type for the Virtual Machines, for example: premium
Available types:
- premium  (SSD-based)
- standard (HDD-based)

-d,  --disk             DISK this feature to have Azure automatically manage the availability of disks to provide data redundancy and fault tolerance
Available types:
- manage
- unmanage

-m,  --sendemail        SENDEMAIL specify send e-mails to every student with the corresponding NDS and other info about the machine
Available types:
- on
- off

$(tput setaf 6)Deployment type (Marketplace VM or VM Image):$(tput sgr 0)
---------------------------------------------------------------------
Marketplace VM:
-vm, --vmtype           VMTYPE Virtual Machine with tools for the data science modeling and development
  Available types:
  - ds-vm-ubuntu       (based on Ubuntu)
  - ds-vm-centos       (based on CentOS)
  - ds-vm-windows      (based on Windows 2012)
  - ds-vm-windows-2016 (based on Windows 2016)

Image:
-i,  --image           IMAGE Create & Deploy a VM from custom image
---------------------------------------------------------------------

$(tput setaf 3)Optional Parameters:$(tput sgr 0)
-t,  --template         TEMPLATEFILE specify template file in json format
-u,  --url              URL specify URL of file to send to desktop of VM
-p,  --postinstall      POSTINSTALL specify other script file name
$(tput setaf 4)
---------------------------------------------------------------------
-h,  --help        Display this help and exit
-v,  --version     Output version information and exit
     --debug       Enable debugging messages (for developers)
---------------------------------------------------------------------
$(tput sgr 0)
Examples:
---------------------------------------------------------------------
- Deploy Data Science VMs:
$(tput setaf 2)$0 -in input.csv -out output.csv -l westus -s Standard_DS3_v2 -st premium -u http://www.example.com/data.zip -vm ds-vm-ubuntu -d manage -m on$(tput sgr 0)
- Deploy VMs from image:
$(tput setaf 2)$0 -in input.csv -out output.csv -l westus -s Standard_DS3_v2 -st premium -d manage -m off -i /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>providers/Microsoft.Compute/images/<imageName>$(tput sgr 0)
- Deploy VMs from your template:
$(tput setaf 2)$0 -in input.csv -out output.csv -l westus -s Standard_DS3_v2 -st premium -d manage -m off -vm <your vm type> -t ./templates/template.json$(tput sgr 0)
- Deploy VMs using post install script:
$(tput setaf 2)$0 -in input.csv -out output.csv -l westus -s Standard_DS3_v2 -st premium -d manage -m off -vm ds-vm-ubuntu -p http://www.example.com/post-install.sh$(tput sgr 0)
---------------------------------------------------------------------
"
}

#
# Purpose: Main function
#
main() {
	
	local inputfile
	local outputfile
	local location
	local size
	local storage
	local url="none"
	local vmtype
	local disk
	local mail
	local image="none"
	local postInstallFileUri="none"
	local templateFolder="./templates/"
	local parameterfile=$templateFolder"parameters.json"
	local templateFile

	import

	if [ $# -eq 0 ]; then
		error "No arguments supplied"
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
			-v | --version)
				shift
				echo "$(basename $0) ${version}"
				exit 0
				shift
				;;
			-t | --template)
				shift
				if test $# -gt 0; then
					templateFile=$1
				fi
				shift
				;;
			-in | --input)
				shift
				if test $# -gt 0; then
					inputfile=$1
				else
					error "no input file specified"
					exit 1
				fi
				shift
				;;
			-out | --output)
				shift
				if test $# -gt 0; then
					outputfile=$1
				else
					error "no output file specified"
					exit 1
				fi
				shift
				;;
			-l | --location)
				shift
				if test $# -gt 0; then
					location=$1
				else
					error "no location specified"
					exit 1
				fi
				shift
				;;
			-s | --size)
				shift
				if test $# -gt 0; then
					size=$1
				else
					error "no size specified"
					exit 1
				fi
				shift
				;;
			-st | --storage)
				shift
				if test $# -gt 0; then
					if [ $1 == "premium" ]; then
						storage="Premium_LRS"
					elif [ $1 == "standard" ]; then
						storage="Standard_LRS"
					else
						error "Unknown storage type"
						usage
						exit 0
					fi
				else
					error "no storage specified"
					exit 1
				fi
				shift
				;;
			-u | --url)
				shift
				if test $# -gt 0; then
					url=$1
				fi
				shift
				;;
			-vm | --vmtype)
				shift
				if test $# -gt 0; then
					vmtype=$1
				fi
				shift
				;;
			-d | --disk)
				shift
				if test $# -gt 0; then
					disk=$1
				else
					error "no disk specified"
					exit 1
				fi
				shift
				;;
			-m | --sendemail)
				shift
				if test $# -gt 0; then
					mail=$1
				else
					error "no sendemail specified"
					exit 1
				fi
				shift
				;;
			-i | --image)
				shift
				if test $# -gt 0; then
					image=$1
				fi
				shift
				;;
			-p | --postinstall)
				shift
				if test $# -gt 0; then
					postInstallFileUri=$1
				fi
				shift
				;;
			--debug)
				shift
				debugMode="--debug"
				shift
				;;
			*)
				error "Unknown parameter $1"
				usage
				exit 0
				;;
		esac
	done
	
	#Check for files
	validateFile "$inputfile"
	validateFile "$parameterfile"

	# if image contains data set vmtype = fromimage
	if [[ $image != "none" ]]; then
		vmtype="FromImage"
	fi

	# check 

	if [[ -z "$templateFile" ]]; then
		echo "" > /dev/null
	else
		validateFile "$templateFile"
	fi

	#Check arguments
	[[ "${location:?}" ]]
	[[ "${size:?}" ]]
	[[ "${storage:?}" ]]
	[[ "${disk:?}" ]]
	[[ "${mail:?}" ]]

	#login to azure using your credentials if needed
	az account show 1>/dev/null

	if [ $? != 0 ]; then
		az login
	fi

	#generate time based GUID
	local classNameID=$(cat /proc/sys/kernel/random/uuid)
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

	validateCores "$location" "$size" "$numVMs"

	#deploy RG, VM's and all resources needed
	local i=0
	while IFS=, read $columnsInput; do
		if [ $i -eq 0 ]; then #skip header of the csv file
			#create a header for output file
			echo $columnsOutput >"$outputfile"
		else
			#deploy VM
			deploy-vm \
				"$i" "$location" "$outputfile" "$parameterfile" "$classNameID" "$ClassName" \
				"$SubscriptionName" "$SubscriptionID" "$StudentName" "$StudentEmailAddress" "$VMUserName" \
				"$VMUserPassword" "$VMAdminUserName" "$VMAdminPassword" "$Comment" "$logFileName" "$size" \
				"$storage" "$url" "$vmtype" "$disk" "$mail" "$image" "$postInstallFileUri" "$templateFolder" "$templateFile"
		fi
		((i++))

	done <$inputfile

	#Check for errors
	if [ $? -ne 0 ]; then
		error "An error occurred during the deployment" >>$logFileName
	else
		echo VM deployment is in progress. Check Azure portal to verify the completion.
	fi

	echo See logs in $logFileName

	return 0
}

main "$@"
