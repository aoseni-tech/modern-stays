#!/bin/bash

sh /home/ec2-user/.nvm/nvm.sh
source /home/ec2-user/.bash_profile

#install packages
/home/ec2-user/.nvm/versions/node/v20.10.0/bin/npm install

#build files
/home/ec2-user/.nvm/versions/node/v20.10.0/bin/npm run build