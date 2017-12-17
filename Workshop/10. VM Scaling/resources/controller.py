# Usage: Call python3 controller.py X, where X is the number of SLURM
# jobs you SLURM to spawn on the SLURM nodes

import csv
import sys
import subprocess
import datetime
import time
import storageconfig as cfg

from azure.storage.blob import AppendBlobService

# Configure account name with the Azure Storage Account Name and the account Key from Storage Explorer
append_blob_service = AppendBlobService(
    account_name=cfg.storage['storage_account_name'],
    account_key=cfg.storage['storage_account_key'])

# Creates an append blob for this app.
append_blob_service.create_container(cfg.storage['container_name'])
append_blob_service.create_blob(
    cfg.storage['container_name'], cfg.storage['blob_name'])

append_blob_service.append_blob_from_text(cfg.storage['container_name'],
                                          cfg.storage['blob_name'], "Starting: " +
                                          datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S') + "\n")

LatLongDict = {}

# Reads the number of jobs from the command line.
jobCount = int(sys.argv[1])

# Reads the airport data in to a list for easy access.
with open('airports-world.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        LatLongDict[row['LocationID']] = [row['Latitude'], row['Longitude']]


# Configures the job size based on the job count passed in.
jobSize = int(len(LatLongDict) / jobCount) + 1

# Creates the slurm worker processes.
for i in range(0, len(LatLongDict), jobSize):
    start = i
    stop = i + jobSize - 1
    if (stop >= len(LatLongDict)):
        stop = len(LatLongDict) - 1

    # calls SLURM
    subprocess.Popen(["sbatch", "worker.sh", str(
        start), str(stop)], close_fds=True)

    # alternately, run these locally
    # subprocess.Popen(["python","worker.py",str(start),str(stop)],close_fds=True)
