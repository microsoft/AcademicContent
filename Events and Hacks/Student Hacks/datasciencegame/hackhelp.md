# Data Science Game 2018

Share the love at [aka.ms/datasciencegame](http://aka.ms/datasciencegame)

## Check the documentation
- [Azure docs](https://docs.microsoft.com/en-us/azure/index)

## Virtual Machines
TL;DR - set up a Data Science Virtual Machine of size DS24 (recommended). It'll have all the useful libraries already installed (Python, TensorFlow, Keras, sklearn, et.c)
- [Create Ubuntu DSVM](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/dsvm-ubuntu-intro)
- [Create Windows DSVM](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/provision-vm)

- [Learn about different Azure VM sizes/GPU differences](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu)

### **Don't forget to open up Port 22 on your VM to be able to SHH in!**

Under **Inbound port rules** > **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** and **HTTP (80)** from the drop-down. 

![Open ports for RDP and HTTP](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/media/quick-create-portal/inbound-port-rules.png)

OR

```bash
az vm open-port --port 80 --resource-group myResourceGroup --name myVM
```

### Learn about DSVM
- [Overview](https://azure.microsoft.com/en-us/services/virtual-machines/data-science-virtual-machines/)
- [What's on the DSVM image?](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/dsvm-tools-overview)
- [Data Science Virtual Machine overview](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/overview)
- [Deep Learning Virtual Machine overview](https://docs.microsoft.com/en-us/azure/machine-learning/data-science-virtual-machine/deep-learning-dsvm-overview)

### FAQ

TL:DR; Use NC or NV (V1) SKU VMs for GPUs. If a resource isn't available, try a different region. Don't forget to open up the right ports to be able to ssh/remote into your VM.

- [Create regular Ubuntu VM (not DSVM)](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal)
- [SSH into a Linux VM from Windows](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows)
- [How to connect to a Linux VM via gui/aka not command line/aka remote desktop](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/use-remote-desktop)
- [Troubleshoot SSH connections](https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshoot-ssh-connection)
- [Resize data disk on your VM](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/expand-disks_


You all have a certain type of Azure grant (Academic Grant - 143P) which doesn't have immediate access to NVS/NDS/NCSv3/NCSv2 VMs due to quota limitations.
You may create a quota request to get access to these VMs, but in general due to high demand for these graphics-enabled VM types, availability is limited for customers using free/benefit/sponsorship subscriptions.
**You won't need a quota increase to use the regular VC or NV (V1) VMs, so those are the best bet for getting up and started quickly.**


## Other Azure data science/machine learning tools
- [Machine learning tools overview](https://docs.microsoft.com/en-us/azure/machine-learning/)
- [Azure machine learning service (preview)](https://docs.microsoft.com/en-us/azure/machine-learning/service/)

## Example labs
- [Keras on Azure notebooks](https://github.com/Microsoft/computerscience/blob/master/Labs/AI%20and%20Machine%20Learning/Keras/Keras.md) - from Justin's talk
- [TensorFlow on Azure Data Science Virtual Machine](https://github.com/Microsoft/computerscience/blob/master/Labs/AI%20and%20Machine%20Learning/TensorFlow/TensorFlow.md)
