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

</table>
