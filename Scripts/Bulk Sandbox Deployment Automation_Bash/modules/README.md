### Modules

---

**Files:** extensions.sh, extensions.ps1

**Purpose:** Current functions:
* Create a new user 
* Upload the files to user's desktop.

**Description:** These scripts are used in templates.

#### Script Usage

Argument        | Command       | Description                                         | Example
--------------- | ------------- | ----------------------------------------------------| --------
-l,  --login    | Login         | Specify the login type for the virtual machines     | vmadmin
-p,  --password | Password      | Specify the password type for the virtual machines  | P@ssw0rd
-u,  --url      | (Optional) Url | Specify the file to be uploaded to  VM             | http://www.example.com/data.zip

#### Directions:
To utilize this script, you will need to replace the fileUris section with the appropriate information:

```json
"fileUris": [
       "https://<storagename>.blob.core.windows.net/scripts/extensions.sh"
]
```

```json
"fileUris": [
       "https://<storagename>.blob.core.windows.net/scripts/extensions.ps1"
]
```