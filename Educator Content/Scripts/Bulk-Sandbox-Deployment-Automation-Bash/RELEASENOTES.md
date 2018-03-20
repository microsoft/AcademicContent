# Release Notes - Azure CS University DS Sandboxes Project

## Release 4: June 30, 2017
### Summary

The release focused on improvements to extensibility.

### New Features

**Extensible / Operations User Stories**

* Ability to run scripts to modify VMs post deployment
	* Ex. software configurations, etc

**Bug Fix**
* Resolved issue with VM being unusable after an image is created

### File updates

File Name							| Updates
---------------------------			| --------- 
README.md | Updated to include explanation of new features
extensions.sh | Updated file to support executing script files
post-install.sh | Sample script that before Python updates in post deployment
parameters.json | Added placeholders for file URL and file name for post deployment script
create-vm-image.sh | Updated to inlcude a working backup of the original VM that is created into an image
deploy-vm.sh 	| Added functionality to reference a file URL and execute script in post deployment 
 				| Added references to new template folder for organizing scripts and files
templates->template-data-science.json | Updated to include parameters for file URL and ability to process script
templates->template-from-custom-image.json | Updated to include parameters for file URL and ability to process script
templates->template-from-data-science-image.json | Updated to include parameters for file URL and ability to process script

## Release 3: June 19, 2017

### Summary

The release focused on improvements to extensibility.

### New Features

**Extensible / Operations User Stories**

* Ability to deploy VMs from images
* Ability to generate images from custom built VMs

### File updates

File Name							| Updates
---------------------------			| --------- 
README.md 							| Updated to include explanation of new features
create-vm-image.sh 					| New Bash script that allows you to create an image for Linux or Windows VM
deploy-vm.sh 						| Cleaned up code 
									| Simplified template selection 
									| Added ability to deploy from marketplace VM, DSVM, or any image. 
									| Updated help printout
templates->template-data-science.json 		| Consolidated all data science templates into a single template
templates->template-from-custom-image.json 	| Template used to deploy from either a Windows or Linux custom image
templates->template-from-data-science-image.json | Template used to deploy specifically a DSVM image

## Release 2: June 12, 2017

### Summary

The release focused on improvements to extensibility and configuration.

### New Features

**Extensible / Operations User Stories**
* Ability to pause, start, and get status of a VM or set of VMs
* Email Deployment information to users
* Ability to deploy Linux CentOS DSVM
* Post Deployment File Load to each VM

**Configuration User Stories**
* Ability to specify VM type
* Ability to change storage type

### File Updates

File Name							| Updates
---------------------------			| --------- 
README.md 							| Updated to include explanation of new features
change-vm-state.sh					| New Bash script for pause, start, and status of VMs 
deploy-vm.sh						| Cleaned up code
									| Added ability to configure VM type
									| Added ability to configure storage type
									| Added ability to email deployment information to users
									| Added ability to send a file to each deployed VM
									| Updated help printout
templates->parameters.json			| Added ability to deploye DSvM for Linux CentOS
									| Updated with new parameters to support new features (storage, VM type)
integrating Email with Deployments 	| Initial release

## Release 1: June 4th, 2017

### Summary

This was the initial release of the Bash scripts.  Please review the README.md for more information.

### New Features

N/A – initial release

### File Updates

File Name								| Updates
---------------------------------------	| --------- 
ReadME.md 								| Initial release
change-vm-state.sh						| Initial release
deploy-vm.sh							| Initial release
input.csv								| Initial release
input File Extensions->input-2-vm.csv	| Initial release
templates->parameters.json				| Initial release
images->design.png						| Initial release
