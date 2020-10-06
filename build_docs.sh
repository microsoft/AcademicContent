#!/usr/bin/env sh

# abort on errors
set -e

# copy files around
cp ./CONTRIBUTING.md ./docs

# build
npm run docs:build