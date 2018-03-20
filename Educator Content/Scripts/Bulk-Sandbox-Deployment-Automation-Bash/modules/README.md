# Modules

## Extensions
**Files:** `extensions.sh`, `extensions.ps1`  
**Purpose:** Current functions:
* Create a new user 
* Upload the files to user's desktop.
* Execute other scripts

**Description:** These scripts are used in templates.

#### Script Usage

Argument        | Command       | Description                                         | Example
--------------- | ------------- | ----------------------------------------------------| --------
-l              | --login           | Specify the login type for the virtual machines     | vmadmin
-p              | --password        | Specify the password type for the virtual machines  | P@ssw0rd
-u              | (Optional) --url  | Specify the file to be uploaded to  VM             | http://www.example.com/data.zip
-f              | (Optional) --filename | Specify other script file name | http://www.example.com/some-script.sh

#### Directions:
To utilize this script, you will need to replace the fileUris section with the appropriate information:

```sh
local extensionsScriptPathUri="<extensions_script_path_uri>"
```

## Post install  
**Files:** `post-install.sh`, `post-install.ps1`  
**Purpose:** Install packages  
**Description:** Sample scripts that install packages after deployment.  

## Tensorflow  
**Files:** `tensorflow-setup.sh`, `tenserflow-test.py`  
**Purpose:** Install [tensorflow](https://www.tensorflow.org/get_started/)  
**Description:** Installing TensorFlow on Ubuntu. 

## Send Email
**Files:** `send-email.sh`
**Purpose:** Used to send email
**Description:** These scripts are used in `deploy-vm.sh`. See instructions for [reference](https://github.com/MSFTImagine/computerscience/tree/master/Scripts/Bulk-Sandbox-Deployment-Automation-Bash#email-server-setup).

## Validators
**Files:** `validators.sh`
**Purpose:** Used for validation
**Description:** These scripts are used in `deploy-vm.sh`. 

---