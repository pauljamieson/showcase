#!/bin/bash

# Get site address 
read -p "Enter domain name or ip: " URL

# Create self signed cert for site
openssl genrsa -aes256 -passout pass:quick_gen -out server.pass.key 4096
openssl rsa -passin pass:quick_gen -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=$URL" -out server.csr
openssl x509 -req -sha256 -days 3650 -in server.csr -signkey server.key -out server.crt 
mkdir certs 2> /dev/null
mv server.crt server.key certs
rm server.csr 