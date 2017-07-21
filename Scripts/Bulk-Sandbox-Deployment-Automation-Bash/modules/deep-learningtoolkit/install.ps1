Import-Module BitsTransfer

cd C:\Windows\temp
Start-BitsTransfer -Source https://deeplearningtoolkit.blob.core.windows.net/assets/install.latest.ps1 -Destination ".\install.latest.ps1"

.\install.latest.ps1