#!/usr/bin/env python
import os
import subprocess

inputdir = os.path.dirname(os.path.realpath(__file__)) + "/input"
outputdir = os.path.dirname(os.path.realpath(__file__)) + "/output"

for imagefile in os.listdir(inputdir):
    cli = "convert {input} {option} {output}".format(
        input=inputdir + "/" + imagefile,
        option="-colorspace Gray",
        output=outputdir + "/" + imagefile)

    print "Converting: " + imagefile
		
    subprocess.call(cli, shell=True)