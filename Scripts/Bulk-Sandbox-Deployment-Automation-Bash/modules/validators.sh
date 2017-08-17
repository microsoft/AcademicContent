#!/bin/bash

#
# Purpose: validate available virtual machine cores for a subscription
#
validateCores() {
	echo "Validating available cores for VMs"
	local location=$1
	local size=$2
	local numberOfVMs=$3

	local usageListFile="./modules/helpers/vm-sizes.json"
	if [ ! -f "$usageListFile" ]; then
		echo "File $usageListFile not found"
		exit 0
	fi

	#$(cat $usageListFile | jq '.[] | select(.properties[] == "'$size'").name' --raw-output) 
	local familyName=$(cat $usageListFile \
		| python -c '
import json,sys
obj=json.load(sys.stdin)
for i in obj: 
    for s in i["properties"]: 
        if s == "'$size'": 
            print i["name"];break')
	#Gets, for the specified location, the current compute resource usage information as well as the limits for compute resources under the subscription.
	local currentValue=$(az vm list-usage --location $location --query "[?localName == '$familyName'].currentValue" -o tsv)
	local limit=$(az vm list-usage --location $location --query "[?localName == '$familyName'].limit" -o tsv)
	local availableNumberOfCores=$(($limit - $currentValue))
	#Lists all available virtual machine sizes for a subscription in a location.
	local numberOfCores=$(az vm list-sizes --location $location --query "[?name == '$size']|[].numberOfCores" -o tsv)
	local totalNumberOfCores=$(($numberOfCores * $numberOfVMs))

	if (($availableNumberOfCores < $totalNumberOfCores)); then
		echo -n "$(tput setaf 1)
Number of VMs: $numberOfVMs ($totalNumberOfCores Cores)
Available number of cores: $availableNumberOfCores
Size: $size

Your deployment will exceed allocated cores. Please ensure proper resource availability, then re-run script.$(tput sgr 0)

"
		exit 0
	fi
}
