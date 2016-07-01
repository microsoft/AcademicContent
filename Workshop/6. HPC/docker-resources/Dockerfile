FROM      ubuntu
MAINTAINER Blaize <me@blaize.net>

LABEL Description="SLURM on Ubuntu" Vendor="blaize.net" Version="1.0"

RUN apt-get update && apt-get install -y slurm-llnl python-pip imagemagick wget

RUN mkdir -p /var/run/munge 

RUN  /usr/sbin/create-munge-key

ADD slurm.conf  /etc/slurm-llnl/slurm.conf
ADD start-master.sh /start-master.sh
ADD start-node.sh /start-node.sh

RUN wget 'https://raw.githubusercontent.com/Wintellect/blobxfer/master/blobxfer-0.9.9.10.py'

RUN pip install azure