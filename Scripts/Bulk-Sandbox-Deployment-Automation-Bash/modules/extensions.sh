#!/bin/bash
# ------------------------------------------------------------------
# Title:
#     Azure CS University DS Sandboxes Project
#
# Description:
#
# This script is an addition to the templates.
# Current functions:
# 	   1. Create a new user
# 	   2. Downloading the file to the user's desktop
#      3. Execute other scripts
#
# ------------------------------------------------------------------

# Current Version
version="1.0.4"

#
# Purpose: Create new user
#
createUser() {
	local login=$1
	local password=$2

	echo Start creating user: $login

	useradd -m -g users -d /home/$login -s /bin/bash -p $(echo $password | openssl passwd -1 -stdin) $login

	if [ "$?" = "0" ]; then
		echo User $login created successfully
	fi
}

#
# Purpose: Download file from URL
#
downloadFile() {

	local url=$1
	local login=$2
	local fileName=$(basename "$url")
	local path=/home/$login/Desktop

	echo Start downloading $fileName

	if [ ! -d $path ]; then
		mkdir -p $path
	fi

	#download file
	wget -P $path $url

	#chmod 755 + chnage owner
	chmod 755 $path/$fileName
	chown $login:users $path/$fileName

	if [ "$?" = "0" ]; then
		echo $fileName saved
	fi
}

#
# Purpose: Print usage
#
usage() {
	echo -n "$0 create new user and download file to user Desktop

	Script [options] application [arguments]

	Options:
Required Parameters:
	-l,  --login     LOGIN specify the login type for the virtual machines
	-p,  --password  PASSWORD specify the password type for the virtual machines

Optional Parameters:
	-u,  --url       URL specify the file
	-f,  --filename	 FILENAME specify other script file name

	-h,  --help      Display this help and exit
	-v,  --version   Output version information and exit

    Example: 
$0 -u http://www.example.com/data.zip -l <Login> -p <Password> -f http://www.example.com/script.sh
$0 -l <Login> -p <Password>
"
}

main() {

	local url="none"
	local login
	local password
	local postInstallFileName="none"

	#Check version
	if [[ $1 == "-v" || $1 == "--version" ]] ; then 
		echo "$(basename $0) ${version}"
		exit 0
	fi

	while test $# -gt 0; do
		case "$1" in
			-h | --help)
				usage
				exit 0
				;;
			-u | --url)
				shift
				if test $# -gt 0; then
					url="$1"
				fi
				shift
				;;
			-l | --login)
				shift
				if test $# -gt 0; then
					login=$1
				else
					echo "no login specified"
					exit 1
				fi
				shift
				;;
			-p | --password)
				shift
				if test $# -gt 0; then
					password=$1
				else
					echo "no password specified"
					exit 1
				fi
				shift
				;;
			-f | --filename)
				shift
				if test $# -gt 0; then
					postInstallFileName="$1"
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

	#Check root privilege
	if [ "${UID}" -ne 0 ]; then
		echo "You must be root to run this program." >&2
		exit 3
	fi

	#create new user
	createUser "$login" "$password"

	if [ $url == "none" ]; then
		echo "url is empty"
	else
		echo "url = $url"
		downloadFile "$url" "$login"
	fi

	if [ $postInstallFileName == "none" ]; then
		echo "postInstallFileName is empty"
	else
		echo "postInstallFileName = $postInstallFileName"
		./$postInstallFileName
	fi
}

main "$@"
