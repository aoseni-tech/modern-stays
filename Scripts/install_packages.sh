#!/bin/bash

cd /home/ec2-user/

#install packages
npm install

#install pm2
npm install pm2 -g

#build files
npm run build