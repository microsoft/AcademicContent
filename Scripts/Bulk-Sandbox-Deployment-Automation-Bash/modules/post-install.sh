#!/bin/bash

echo "Start time:"
date

distr=$(cat /etc/*release)

if [[ $distr =~ "ubuntu" ]]; then
    rm /var/lib/dpkg/lock
    dpkg --configure -a
fi

# install NodeJS
apt-get install -y nodejs

# install Apache
apt-get install -y apache2

# Create File, insert and append some text
echo "insert some text" > /home/myfile.txt
echo "append some text" >> /home/myfile.txt