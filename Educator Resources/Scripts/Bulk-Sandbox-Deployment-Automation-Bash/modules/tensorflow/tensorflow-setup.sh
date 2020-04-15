#!/bin/bash

cudaUrl="https://developer.nvidia.com/compute/cuda/8.0/Prod2/local_installers/cuda_8.0.61_375.26_linux-run"
cudaFileName=$(basename "$cudaUrl")
tensorflowUrl="https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow_gpu-0.12.1-cp27-none-linux_x86_64.whl"
tensorflowFileName=$(basename "$tensorflowUrl")
cudnnUrl="http://developer.download.nvidia.com/compute/redist/cudnn/v6.0/cudnn-8.0-linux-x64-v6.0.tgz"
cudnnFileName=$(basename "$cudnnUrl")
setupDir="$HOME/gpu-setup"

mkdir -p $setupDir
cd $setupDir

# remove lock
rm /var/lib/dpkg/lock
dpkg --configure -a

# Install python libraries
echo "Installing python libraries"
sudo apt-get -y install python-numpy python-dev python-wheel python-mock python-matplotlib python-pip

# Install cuda
if [ ! -f "$" ]; then
	wget -O $cudaFileName $cudaUrl
fi

echo "Installing cuda"
chmod +x $cudaFileName
sudo ./$cudaFileName --override --silent --verbose --driver --toolkit

# Install cuDNN
if [ ! -f "$cudnnFileName" ]; then
	wget -O $cudnnFileName $cudnnUrl
fi

echo "Uncompressing cudnn"
tar xzvf $cudnnFileName
sudo cp -P cuda/include/cudnn.h /usr/local/cuda/include/
sudo cp -P cuda/lib64/libcudnn* /usr/local/cuda/lib64/
sudo chmod a+r /usr/local/cuda/include/cudnn.h /usr/local/cuda/lib64/libcudnn*

# Update bashrc
# Note: this will create duplicates if you run it more than once.
echo "Updating bashrc"
echo >> $HOME/.bashrc '
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64"
export CUDA_HOME=/usr/local/cuda
'

source $HOME/.bashrc

# Create bash_profie
# Note: this will destroy your existing .bashrc
echo "Creating bash_profile"
echo > $HOME/.bash_profile '
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
'

# Install Tensorflow dependencies
echo "Installing tensorflow dependencies"
sudo apt-get -y install libcupti-dev

# Upgrade pip
sudo pip install --upgrade pip

# Install Tensorflow
echo "Installing tensorflow"
sudo pip install --upgrade $tensorflowUrl

echo "Script done"
