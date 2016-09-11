#!/bin/bash

for n in {0..8}; do
  for ext in py sh; do
    SCRIPT=slurmdemo.$ext
    CMD="docker -H 127.0.0.1:22375 cp $SCRIPT linux$n:/$SCRIPT"
    echo "$CMD"
    $CMD
  done
done
