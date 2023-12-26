#!/bin/bash

sh /home/ec2-user/.nvm/nvm.sh
source /home/ec2-user/.bash_profile

#install packages
npm install

#build files
npm run build