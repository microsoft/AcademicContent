#!/bin/bash

for n in {0..8}; do
  docker -H 127.0.0.1:22375 start linux$n
done
