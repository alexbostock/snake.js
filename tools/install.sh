#!/usr/bin/env sh
# Script to install the project in the current directory

npm install

# Minify
rm view/scripts/*.min.*

node node_modules/minifier/index.js view/scripts
