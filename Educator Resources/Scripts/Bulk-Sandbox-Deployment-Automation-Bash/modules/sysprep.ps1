##############################
#.SYNOPSIS
#Azure CS University DS Sandboxes Project
#
#.DESCRIPTION
#Sysprep (System Preparation) prepares a Windows installation (Windows client and Windows Server) for imaging, allowing you to capture a customized installation.
#
##############################

Start-Process -FilePath C:\Windows\System32\Sysprep\Sysprep.exe -ArgumentList '/generalize /oobe /shutdown /quiet'