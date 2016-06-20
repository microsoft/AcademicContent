<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Academic Resources for Computer Science</title>
	  <link rel="stylesheet" href="style.css">
   </head>
   <body id="home">
      <div class="container">
         <div class="jumbotron">
            <h1>Academic Resources for Computer Science</h1>
            <p><b>June 2016 release.</b> <i>Note: This repo is a work-in-progress and intended for review and collaboration with Microsoft developer advocates and the academic community. Please do not use these resources in public forums at this time.</i> Source: <a href="https://github.com/MSFTImagine/computerscience">https://github.com/MSFTImagine/computerscience</a>.</p>
            <p>
               This repo provides technical resources for faculty, students, and Microsoft developer advocates for use in computer science learning. The modules cover common cross-platform scenarios including mobile app dev, web dev, internet of things, data science, machine learning, and devops. Content delivery is divided into four groups: Instructor-led, Problem Sets, Tech Talks, and Workshops.</p>
               <p>Most hands-on learning focuses on cross-platform technology deployment on the Microsoft Azure although most concepts can be applied to any cloud platform solution. Academic users can get free Azure from various programs like 
            <a href="https://azure.microsoft.com/en-us/free/">Free Azure Trial</a>, 
            <a href="https://www.dreamspark.com/student/default.aspx">Microsoft Imagine</a>, 
            <a href="http://www.microsoftazurepass.com/">Azure Pass</a>,
            <a href="https://www.microsoftazurepass.com/azureu">AzureU</a>,
            <a href="https://www.visualstudio.com/en-us/products/visual-studio-dev-essentials-vs.aspx">Visual Studio Dev Essentials</a>, or
            <a href="http://research.microsoft.com/en-us/projects/azure/default.aspx">Azure for Research</a>.
            </p>
               <p>Your feedback is appreciated - please fork this repo and contribute!</p> 
         </div>
         <div class="panel panel-default">
            <div class="panel-heading">
               <h3 class="panel-title">Suggested agenda for a one day Azure Camp with Hands On Labs (HOLs)</h3>
            </div>
            <div class="panel-body">
               <table class="table table-bordered table-hover">
                  <col>
                  <col>
                  <col>
                  <tr>
                     <th>Session</th>
                     <th>Time (min)</th>
                     <th>Activity</th>
                  </tr>
                  <tr>
                     <td rowspan=3>Intro to Azure</td>
                     <td>30</td>
                     <td>[Presentation](Presentation/Keynote/Keynote.pptx) | [Demos](Presentation/Keynote/)</td>
                  </tr>
                  <tr>
                     <td>15</td>
                     <td>[HOL - Signup](HOL/creating-azure-account-activating-msdn-benefits/)</td>
                  </tr>
                  <tr>
                  <td>15</td>
                  <td>[HOL - Working with the Management Portal](HOL/working-with-the-new-portal/)</td>
                  </tr>		
                  <tr>
                     <td rowspan=3>App Service</td>
                     <td>30</td>
                     <td>[Presentation](Presentation/App-Service/App Service.pptx) | [Demos](Presentation/App-Service/)</td>
                  </tr>
                  <tr>
                     <td rowspan=2>30</td>
                     <td>[HOL - Deploy a Web App to Azure *or*](HOL/get-started-with-websites-and-asp-net/)</td>
                  </tr>
                  <tr>
                     <td>[HOL - Create an app with a mobile and web client in Azure App Service](HOL/build-mobile-app-with-web-client/)</td>
                  </tr>
                  <tr>
                     <td rowspan=2>Machine Learning</td>
                     <td>45</td>
                     <td>[Presentation](/Presentation/Machine-Learning/Azure-Machine-Learning.pptx) | [Demos](Presentation/Machine-Learning/)</td>
                  </tr>
                  <tr>
                     <td>45</td>
                     <td>[HOL - Deploy a SPA with AD to Azure](HOL/machine-learning/)</td>
                  </tr>
                  <tr>
                     <td rowspan=2>IaaS</td>
                     <td>45</td>
                     <td>[Presentation](Presentation/IaaS/IaaS.pptx) | [Demos](Presentation/IaaS/)</td>
                  </tr>
                  <tr>
                     <td>45</td>
                     <td>[HOL - IaaS](HOL/create-virtual-machine/)</td>
                  </tr>
                  <tr>
                     <td rowspan=3>Data overview</td>
                     <td>45</td>
                     <td>[Presentation](Presentation/Data-Platform/Data-Platform.pptx) | [Demos](Presentation/Data-Platform/)</td>
                  </tr>
                  <tr>
                     <td rowspan=2>45</td>
                     <td>[HOL - DocumentDB *or*](HOL/build-web-app-using-documentdb/)</td>
                  </tr>
                  <tr>
                     <td>[HOL - Elastic Scale](HOL/sql-database/)</td>
                  </tr>
               </table>
            </div>
         </div>
         <div class="panel panel-default">
            <div class="panel-heading">
               <h3 class="panel-title">Full presentation list</h3>
            </div>
            <div class="panel-body">
               <table class="table table-bordered table-striped table-hover">
					<tr>
					   <td>Keynote</td>
					   <td>[Presentation](Presentation/Keynote/Keynote.pptx) | [Demos](Presentation/Keynote/)</td>
					   <td>This module introduces the Cloud and the Cadence of Azure.</td>
					</tr>
					<tr>
					   <td>PaaS</td>
					   <td>[Presentation](Presentation/PaaS/Building Cloud Solutions.pptx) | [Demos](Presentation/PaaS/)</td>
					   <td>This module provides an overview of how to design and deploy cloud solutions on Azure.</td>
					</tr>
					<tr>
					   <td>App Service</td>
					   <td>[Presentation](Presentation/App-Service/App Service.pptx) | [Demos](Presentation/App-Service/)</td>
					   <td>This module outlines the high-level features of Azure App Service</td>
					</tr>
					<tr>
					   <td>Machine Learning</td>
					   <td>[Presentation](/Presentation/Machine-Learning/Azure-Machine-Learning.pptx) | [Demos](Presentation/Machine-Learning/)</td>
					   <td>This module outlines the high-level features of Azure Machine Learning</td>
					</tr>
					<tr>
					   <td>Data Platform</td>
					   <td>[Presentation](Presentation/Data-Platform/Data-Platform.pptx) | [Demos](Presentation/Data-Platform/)</td>
					   <td>This module outlines the Data offerings on Microsoft Azure</td>
					</tr>
					<tr>
					   <td>Data Storage</td>
					   <td>[Presentation](Presentation/Data-Storage/Data-Storage.pptx) | [Demos](Presentation/Data-Storage/)</td>
					   <td>This module gives an overview of HDInsight</td>
					</tr>
					<tr>
					   <td>IaaS</td>
					   <td>[Presentation](Presentation/IaaS/IaaS.pptx) | [Demos](Presentation/IaaS/)</td>
					   <td>This module outlines the Virtual Machine and Virtual Network features of Microsoft Azure</td>
					</tr>
					<tr>
					   <td>Media</td>
					   <td>[Presentation](Presentation/Media/Media.pptx) | [Demos](Presentation/Media/)</td>
					   <td>This Module outlines the Media Service on Microsoft Azure.</td>
					</tr>
					<tr>
					   <td>Integration / Hybrid Workflows / API Management</td>
					   <td>[Presentation](Presentation/Integration-Hybrid-Workflows/APIManagementIntro.pptx) | [Demos](Presentation/Integration-Hybrid-Workflows/)</td>
					   <td>This module outlines the integration offerings on Microsoft Azure</td>
					</tr>
					<tr>
					   <td>Identity / Access Management</td>
					   <td>[Presentation](Presentation/Identity-Access-Management/Identity and o365.pptx) | [Demos](Presentation/Identity-Access-Management/)</td>
					   <td>This module outlines the Identity and Access Management offerings on Microsoft Azure</td>
					</tr>
					<tr>
					   <td>Conclusion</td>
					   <td>[Presentation](Presentation/Conclusion/Conclusion.pptx)</td>
					   <td>This short presentation includes calls to action and signup links for camp attendees</td>
					</tr>
				 </table>
			</div>
      </div>
   </body>
</html>
