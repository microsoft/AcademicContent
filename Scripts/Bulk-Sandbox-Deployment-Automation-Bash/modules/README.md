### Modules

---

**Files:** extensions.sh, extensions.ps1

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
local extentionsFileUri="<extentions_file_uri>"
```