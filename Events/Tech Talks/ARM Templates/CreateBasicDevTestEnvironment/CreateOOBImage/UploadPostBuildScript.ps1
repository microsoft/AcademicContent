$StorageContainerName = 'scripts'
$fileToUpload = 'doWork.ps1'

$StorageAccount = (Get-AzureRmStorageAccount | Where-Object{$_.StorageAccountName -eq 'store45649fkwl'})
$StorageAccountContext = $StorageAccount.Context
New-AzureStorageContainer -Name $StorageContainerName -Context $StorageAccountContext -Permission Container -ErrorAction SilentlyContinue *>&1

Set-AzureStorageBlobContent -File $fileToUpload -Blob $fileToUpload -Container $StorageContainerName -Context $StorageAccountContext -Force -ErrorAction Stop