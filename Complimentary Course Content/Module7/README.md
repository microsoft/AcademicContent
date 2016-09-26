<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
	    <link rel="stylesheet" href="style.css">
   </head>
   <body id="home">
      <div class="container">
         <div class="jumbotron">
            <h1>Module 7 - DevOps</h1>
            <p><b>June 2016 release</b></p>
            <p>This module covers the fundamental concepts of DevOps including configuration management. This module introduces Chef. Additionally, module 7 teaches how to launch a web server, desired state configurations, and how to test a web server (all using Chef).</p>
         </div>
      </div>
      <div class="panel-body">
               <table class="table table-bordered table-hover">
                  <col>
                  <col>
                  <col>
                  <tr>
                     <th>Lesson</th>
                     <th align="center">Title</th>
                     <th>Lab</th>
                     <th>Objectives</th>
                  </tr>
                  <tr>
                     <td align="center">1</td>
                     <td>[What is DevOps](Lessons/Module7_Lesson1 What is DevOps.pptx)</td>
                     <td></td>
                     <td>Explain the difference between traditional Development and Operations<br>
Define DevOps <br>
Understand why the Enterprise is embracing the DevOps methodology<br>
Summarize the DevOps mindset
                     </td>
                  </tr>
                  <tr>
                     <td align="center">2</td>
                     <td>[Configuration Management](Lessons/Module7_Lesson2 Configuration Management.pptx)</td>
                     <td></td>
                     <td>Define configuration management and infrastructure automation<br>
			 Know the leading configuration management tools and platforms<br>
			 Explain how integration with the cloud changes implementation<br>
			 Review configuration management examples
                     </td>
                  </tr>
                  <tr>
                     <td align="center">3</td>
                     <td>[Introduction to Chef](Lessons/Module7_Lesson3 Introduction to Chef.pptx)</td>
                     <td></td>
                     <td>Explain Chef terminology and architecture<br>
			 Build basic cookbooks and recipes<br>
			 Utilize Windows resources like powershell_script and registry_key<br>
			 Understand how to interface with a Chef Server
                     </td>
                  </tr>
                  <tr>
                     <td align="center">4</td>
                     <td>[Launching a Web Server with Chef](Lessons/Module7_Lesson4 Launching A Web server With Chef.pptx)</td>
                     <td>[Lab](Labs/Module7_Lesson 4 Launching A Web Server With Chef LAB.docx)</td>
                     <td>Understand the purpose and functionality of a web server<br>
			 Launch a virtual CentOS and Windows instance <br>
			 Install the Chef Development Kit (ChefDK) onto the instances<br>
			 Write a Chef recipe to Install, Start and Configure Apache (for Linux) and IIS (for Windows) web servers<br>
			 Use the chef-client command in local-mode to converge the node<br>
			 Visually verify that a web server is running on each instance
                     </td>
                  </tr>
                  <tr>
                     <td align="center">5</td>
                     <td>[Desired State Configuration with Chef](Lessons/Module7_Lesson5 Desired State Configuration with Chef.pptx)</td>
                     <td>[Lab](Labs/Module7_Lesson 5 Chef and DSC Lab.docx)</td>
                     <td>Explain what Desired State Configuration (DSC) does<br>
			 Understand the benefits of managing DSC with Chef<br>
			 Decide when to use Chef vs DSC resources<br>
			 Utilize the dsc_script and dsc_resource inside a recipe
                     </td>
                  </tr>
                  <tr>
                     <td align="center">6</td>
                     <td>[Testing the Web Server Deployment](Lessons/Module7_Lesson6 Testing The Web Server Deployment.pptx)</td>
                     <td>[Lab](Labs/Module7_Lesson 6 Test Kitchen Lab.docx)</td>
                     <td>Understand why DevOps engineers test their code<br>
			 Explain several different types of software testing<br>
			 Implement an Integration Test using Test Kitchen
                     </td>
                  </tr>
            </table>
        </div>
     </body>
</html>
