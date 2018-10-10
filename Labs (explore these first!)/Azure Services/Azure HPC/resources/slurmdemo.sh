#!/bin/bash
#SBATCH -J slurmdemo # A single job name for the array
#SBATCH -n 1 # one core
#SBATCH -N 1 # on one node
#SBATCH -t 0-2:00 # Running time of 2 hours
#SBATCH -o slurmdemo_%A_%a.out # Standard output
#SBATCH -e slurmdemo_%A_%a.err # Standard error

mkdir /tmp/${SLURM_ARRAY_JOB_ID}_${SLURM_ARRAY_TASK_ID}_out
cp *.py /tmp/${SLURM_ARRAY_JOB_ID}_${SLURM_ARRAY_TASK_ID}_out
cd /tmp/${SLURM_ARRAY_JOB_ID}_${SLURM_ARRAY_TASK_ID}_out
python ./slurmdemo.py worker
