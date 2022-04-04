Configuration WinVMConfiguration {
 Node localhost {
  
    Script InstallWebsite
    {
        TestScript = {
            Test-Path "C:\inetpub\Wwwroot\index.html"
        }
        SetScript ={
			
           $source = "https://github.com/marrobi/InfrastructureToAzure/raw/TechUG-Leeds-April-28th/Websites/WindowsWebsite.zip"
           Invoke-WebRequest $source -OutFile "$env:TMP\website.zip"   
           Expand-Archive  -Path "$env:TMP\website.zip" -DestinationPath "c:\inetpub\wwwroot"
       }

       GetScript = {@{Result = "InstallWebsite"}}
     
    }
 }
}