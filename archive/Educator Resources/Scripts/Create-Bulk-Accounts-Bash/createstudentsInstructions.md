# Create bulk student accounts using Bash

This bash script will read a list of accounts to create from a csv to bulk create email addresses for students taking a course. It will assign an Azure subscription to each of the students.

## Prerequisites

### Set up Bash environment to run the script

This is a bash script so you need to run it on a Unix machine or use Bash for Windows. You need *npm*, *node.js*, the *Azure CLI*, and *dos2unix* to run the script.

1. If running on Windows, install [bash for Windows](https://docs.microsoft.com/windows/wsl/install-win10?redirectedfrom=MSDN&WT.mc_id=academiccontent-github-cxa)

1. Launch a command prompt and run bash

1. Within your bash environment install node.js and npm by executing the following commands

    ```sh
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

1. Install the Linux version of the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest&WT.mc_id=academiccontent-github-cxa)

1. Log in to Azure cli using the [`azure login` command](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest&WT.mc_id=academiccontent-github-cxa). When prompted, log in using the microsoft account associated with the education grant.

1. Install dos2unix. dos2unix is a utility that converts plain text files in DOS format to UNIX format. In this script dos2unix converts your csv file to a format understood by UNIX. You can install it using the following command:

    ```sh
    sudo apt-get install dos2unix
    ````

### Create your CSV file

Each line of the csv file should include the following fields in order:

> Name,Login,password,SubscriptionId,RoleName

* Name is a string name of students

* Login is the part of the email address before the @. You may want to generate this based on the students name

* Password is the password assigned to the account. You might use something such as student id as a basis for passwords.

* SubscriptionId is the SubscriptionId of the subscription to which you want to add the student. You can find the subscription id listed in the Azure Education portal.
the subscription id will be a value such as 'fa57eb5c-7e21-49d8-b521-7c1bc81a3adc'

* RoleName specifies the [role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles?WT.mc_id=academiccontent-github-cxa) you want to assign to the user, usually this will be *Contributor*

### Update the createstudents.sh script

1. Replace the variable **INPUT** in line 2 with the path of your csv file (Do not use Notepad or Wordpad or you may get extra carriage return and escape
characters in the script that cause file not found errors, better to edit the script in a tool such as VS Code, vi, or Notepad++)

1. Replace the string **xxxx.onmicrosoft.com** with the AAD of the subscription with the educator grant. if the address is XXX@YYY.com, the value should be XXXYYY.onmicrosoft.com.

> Note: If there is any punctuation in the email address (e.g. john.smith@live.com) do not include the punctuation e.g. AAD address would be johnsmithlive.onmicrosoft.com.  
> You can look up the AAD in the [Azure portal](https://portal.azure.com?WT.mc_id=academiccontent-github-cxa).  Log into the portal using the account name associated with the Azure Education portal subscription. From the home page select *More services* | *Azure Active Directory Preview* | *Domain names* to see the AAD account name format.

## Execute the script

```sh
./createstudents.sh
```

A big thanks to Djordje Relic from the swiss MSP program for his help creating the script and to Mikhail Chatillon for writing documentation and sharing the script
