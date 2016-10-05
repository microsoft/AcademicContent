This folder contains scripts that complement the functionality of the Azure Education portal
<table>
<tr>
<td>Task</td>   <td>Script</td>   <td> Documentation </td>
</tr>
<tr>
<td>Create bulk accounts </td>
<td>createstudents.sh </td>
<td>This bash script will read a list of accounts to create from a csv to bulk create email adresses for students taking a course. It will assign an Azure subscription to each of the students.
Full instructions can be found in the file createstudentsInstructions.md  
IMPORTANT NOTE:   
**Accounts created with this script will NOT be able to access the [Azure classic portal](https://manage.windowsazure.com)**   
This script creates accounts based on Role Based Access Control (RBAC) and puts limitations on the accounts created. You can see a complete list of features available in 
the Azure portal vs the Azure classic portal in this <a href="https://azure.microsoft.com/en-us/features/azure-portal/availability/">Azure portal availability chart</a> 

</td>
<tr>
<td> View billing information </td>
<td> <a href="https://github.com/Microsoft/AzureUsageAndBillingPortal">Azure Billing Portal</a> </td>
<td> Viewing detailed account usage presents challenges when using credit based subscriptions. The Azure Usage and billing portal is a complete solution that creates
a website and PowerBI dashboard to visualize Azure service billing and usage details.  This solution can be used whether students are given access to Azure through the Azure Education 
Portal subscriptions or through Azure passes. You set up the solution for the faculty member. The students register their Azure subscription wih the system and the professor is able to
view usage and billing for each registered user. Full documentation on how to install and use the tool is available on Github <a href="https://github.com/Microsoft/AzureUsageAndBillingPortal">Azure Billing Portal GitHub</a>
</tr>

</td>
<tr>
<td> Bulk Adding AAD Existing users via Powershell</td>
<td> BulkAddAAD.ps1 </td>
<td> This powershell script will read a list of accounts to a .txt file It will assign an Azure subscription to each of the students.
Full instructions can be found in the file BulkAddAADInstructions.md  
IMPORTANT NOTE:   
**Accounts created with this script will NOT be able to access the [Azure classic portal](https://manage.windowsazure.com)**   
This script creates accounts based on Role Based Access Control (RBAC) and puts limitations on the accounts created to a contributor. You can see a complete list of features available in 
the Azure portal vs the Azure classic portal in this <a href="https://azure.microsoft.com/en-us/features/azure-portal/availability/">Azure portal availability chart</a></tr>
</tr>

</td>
<tr>
<td> Listing all your Azure Subscription via Powershell</td>
<td> ListAzureSubs.ps1 </td>
<td> This powershell script will list of the Azure Subscriptions and then list a table format of the Azure SubscriptionName and Azure SubscriptionID. 
<td>Simply run the command Navigate to the directory where the script lives 
<td> PS> cd C:\my_path\yada_yada\ (enter) 
<td> Execute the script: PS> .\ListAzureSubs.ps1 (enter)
<td>Or: you can run the PowerShell script from cmd.exe like this:
<td>powershell -noexit C:\my_path\yada_yada\ListAzureSubs.ps1 (enter)
<td>Simply then copy and paste your Subscription IDs into the Excel for assigning users
</tr>

</table>
