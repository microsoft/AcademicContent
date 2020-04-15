
# download and install Node JS
# powershell -NoExit -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v8.1.2/node-v8.1.2-x64.msi', 'C:\node-v8.1.2-x64.msi'); exit;"
# msiexec /qn /l* C:\node-log.txt /i C:\node-v8.1.2-x64.msi

# Create file, insert and append some text
$text = "insert some text";
$text > "C:\myFile.txt";
$text = "append some text";
$text >> "C:\myFile.txt";