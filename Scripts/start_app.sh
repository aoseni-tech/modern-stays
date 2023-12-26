#!/bin/bash

sh /home/ec2-user/.nvm/nvm.sh
source /home/ec2-user/.bash_profile

export AWS_MODERNSTAY_CONFIG="$(aws secretsmanager get-secret-value --secret-id Modern_Stays_Variables)"

npm run start