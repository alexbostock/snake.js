#!/usr/bin/env sh
# Intended for use on the server

git checkout .
git pull

sh tools/install.sh

pm2 restart index

