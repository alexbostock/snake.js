#!/usr/bin/env sh
# Script to install the project in the current directory

npm install

# Minify
node node_modules/minifier/index.js view/scripts

# Generate config file

printf "// App config - required by index.js\n" > config.js
printf "// Generated by /tools/install.sh\n\n" >> config.js

printf "var config = {\n" >> config.js
printf  "\troot: \"" >> config.js
pwd | tr -d '\n' >> config.js
printf "\"\n}\n\n" >> config.js

printf "module.exports = config;\n\n" >> config.js

echo "config.js generated"

