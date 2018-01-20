FROM ubuntu:14.04
MAINTAINER Blaize <me@blaize.net>

LABEL Description="Python Image Convert on Ubuntu" Vendor="blaize.net" Version="1.0"

RUN apt-get update && apt-get install -y python-pip imagemagick

ADD input  /input
ADD convertimages.py /convertimages.py

RUN mkdir /output