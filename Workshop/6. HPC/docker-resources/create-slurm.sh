#!/bin/bash

# Helper function
docker-slurm() { socker -H 127.0.0.1:22375 "$@"; }

# Builds the docker image on ACS
docker-slurm build --no-cache --tag=slurm-docker

# Create a network on Docker for the SLURM cluster.
docker-slurm network create slurm

# Creates the master for the SLURM cluster.
docker-slurm run -dit --net=slurm -h linux0 --name=linux0 slurm-docker /start-master.sh

# Creates 8 nodes on the SLURM cluster.
for n in {1..8}; do
  docker-slurm run -dit --net=slurm -h linux$n --name=linux$n slurm-docker /start-node.sh
done
