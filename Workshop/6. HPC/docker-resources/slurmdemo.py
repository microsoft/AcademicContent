#!/usr/bin/env python
import sys
import time
import json
import os
import subprocess
from subprocess import Popen, PIPE, check_output, CalledProcessError

from datetime import datetime
from datetime import timedelta

from azure.storage import AccessPolicy
from azure.storage.sharedaccesssignature import (
    SharedAccessPolicy,
    SharedAccessSignature,
    QueryStringConstants,
    ResourceType,
)
from azure.storage.blob import BlobService

#######################################################
# Update these two variables to those for your account.
#######################################################
ACCOUNT_NAME = 'account_name'
ACCOUNT_KEY = 'account_key'
#######################################################

INPUT_CONTAINER = 'input'
OUTPUT_CONTAINER = 'output'

SLURMDEMO_INPUTSIG = "SLURMDEMO_INPUTSIG"
SLURMDEMO_OUTPUTSIG = "SLURMDEMO_OUTPUTSIG"
SLURMDEMO_BLOBLIST = "SLURMDEMO_BLOBLIST"
SLURMDEMO_INPUTCONTAINER = "SLURMDEMO_INPUTCONTAINER"
SLURMDEMO_OUTPUTCONTAINER = "SLURMDEMO_OUTPUTCONTAINER"
SLURMDEMO_INPUTACCOUNT = "SLURMDEMO_INPUTACCOUNT"
SLURMDEMO_OUTPUTACCOUNT = "SLURMDEMO_OUTPUTACCOUNT"
SLURMDEMO_OPTION = "-grayscale Rec709Luma"

SLURM_ARRAY_JOB_ID = "SLURM_ARRAY_JOB_ID"
SLURM_ARRAY_TASK_ID = "SLURM_ARRAY_TASK_ID"

def main(argv):
    if(len(argv)>0 and argv[0] == 'worker'):
        bloblist = json.loads(os.environ[SLURMDEMO_BLOBLIST])
        blob = bloblist[int(os.environ[SLURM_ARRAY_TASK_ID])]
        worker(blob)
    elif(len(argv)==0):
        submit()
    elif(len(argv)>0 and argv[0].isdigit()): # debug
        submit()
        print os.environ[SLURMDEMO_OUTPUTSIG]
        bloblist = json.loads(os.environ[SLURMDEMO_BLOBLIST])
        blob = bloblist[int(argv[0])]
        worker(blob)

def sasUrl(account, key, container, permission):

    start = datetime.utcnow()
    expiry = start + timedelta(hours = 24)

    accss_plcy = AccessPolicy()
    accss_plcy.start = start.strftime('%Y-%m-%dT%H:%M:%SZ')
    accss_plcy.expiry = expiry.strftime('%Y-%m-%dT%H:%M:%SZ')
    accss_plcy.permission = permission

    sas = SharedAccessSignature(account_name=account, account_key=key)

    query = sas.generate_signed_query_string(
        container,
        ResourceType.RESOURCE_CONTAINER,
        SharedAccessPolicy(accss_plcy),
        )

    return query

def submit():
    blob_service = BlobService(account_name=ACCOUNT_NAME, account_key=ACCOUNT_KEY)

    # Get a SAS signature (read for 24 hours) for the input container save to a string
    inputsig = sasUrl(account=ACCOUNT_NAME, key=ACCOUNT_KEY, container=INPUT_CONTAINER, permission='r')

    # Get a SAS signature (write for 24 hours) for the output container save to a string
    outputsig = sasUrl(account = ACCOUNT_NAME, key = ACCOUNT_KEY, container = OUTPUT_CONTAINER, permission = 'rwl')

    # List all the blobs and dump the content to a string
    blobs = blob_service.list_blobs(INPUT_CONTAINER)

    bloblist = []
    for blob in blobs:
        bloblist.append(blob.name)

    os.environ[SLURMDEMO_INPUTSIG] = inputsig
    os.environ[SLURMDEMO_OUTPUTSIG] = outputsig
    os.environ[SLURMDEMO_BLOBLIST] = json.dumps(bloblist)
    os.environ[SLURMDEMO_INPUTCONTAINER] = INPUT_CONTAINER
    os.environ[SLURMDEMO_OUTPUTCONTAINER] = OUTPUT_CONTAINER
    os.environ[SLURMDEMO_INPUTACCOUNT] = ACCOUNT_NAME
    os.environ[SLURMDEMO_OUTPUTACCOUNT] = ACCOUNT_NAME

    # Call sbatch
    cli = "sbatch --array=0-{nb} slurmdemo.sh".format(nb=len(bloblist))
    run(cli, showoutput=True)

def run(cli, showoutput=False):
    print 'Executing \"' + cli + '\" ...'
    sys.stdout.flush()
    if showoutput:
        exit_code = subprocess.call(cli, shell=True)
    else:
        FNULL = open(os.devnull, 'w')
        exit_code = subprocess.call(cli, stdout=FNULL, shell=True)
    print 'done'
    return exit_code

def worker(blobname):
    print("work on {blobname}".format(blobname=blobname))
    # downloading the file
    cli = "python ./blobxfer-0.9.9.10.py {accountname} {inputcontainer} . --saskey '{saskey}' --remoteresource {blobname} --download".format(
        accountname=os.environ[SLURMDEMO_INPUTACCOUNT],
        inputcontainer=os.environ[SLURMDEMO_INPUTCONTAINER],
        saskey=os.environ[SLURMDEMO_INPUTSIG],
        blobname=blobname)
    run(cli)

    # work on it
    filename, fileext = os.path.splitext(blobname)
    outputname = filename + '.' + os.environ[SLURM_ARRAY_JOB_ID] + fileext
    cli = "convert {input} {option} {output}".format(
        input=blobname,
        option=SLURMDEMO_OPTION,
        output=outputname)
    run(cli)

    # uploading it
    cli = "python ./blobxfer-0.9.9.10.py {accountname} {outputcontainer} {outputfile} --saskey '{saskey}' --upload".format(
        accountname=os.environ[SLURMDEMO_INPUTACCOUNT],
        outputcontainer=os.environ[SLURMDEMO_OUTPUTCONTAINER],
        saskey=os.environ[SLURMDEMO_OUTPUTSIG],
        outputfile=outputname)
    run(cli)
    return

if __name__ == "__main__":
   main(sys.argv[1:])
