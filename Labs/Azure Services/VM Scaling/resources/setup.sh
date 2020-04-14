#!/bin/bash
# The original script can be downloaded from https://aka.ms/slurmdemo
# This is modified and includes a lot of bug fixes.
#
# About this demo
#
#  This demo shows how to run parametric sweep job in a SLURM cluster,
#  install software, scan a storage container for input, submit a job/task,
#  and run image conversion tasks on compute nodes.
#
# Pre-requisite
#
#  1. Deploy a SLURM cluster on Azure using the resource template.
#  2. Get an Azure storage account, create 2 containers called "input" and "output"
#  3. Upload some images to the input container.
#  4. Edit slurmdemo.py to update ACCOUNT_NAME & ACCOUNT_KEY field with your storage account & key
#  5. Edit this file and replace <admin account> with the account set up from the template
#  6. Copy slurmdemo.setup.sh (this file), slurmdemo.sh, and slurmdemo.py to the
#     master node.
#  7. On the master node, submit the job to start the processing:
#         "python slurmdemo.py"
#  8. The task will download images in the input container, conver it to gray scale image and
#     upload it back to output container. Watch the result from any storage explorer
# 
#

# Install the python package manager.
sudo apt-get update
sudo apt-get install -y python3-pip build-essential libssl-dev libffi-dev python-dev

# Install image conversion utility.
# install the azure package for Python.
pip3 install azure-storage

for node in $(sinfo -o "%n" -h|grep -v `hostname`)
do

  ssh azureuser@$node sudo upt-get update
  ssh azureuser@$node sudo apt-get install -y python3-pip build-essential libssl-dev libffi-dev python-dev
  ssh azureuser@$node pip3 install azure-storage
  
  
  
  scp worker.py azureuser@$node:~
  scp airports-world.csv azureuser@$node:~
  scp worker.sh azureuser@$node:~

done