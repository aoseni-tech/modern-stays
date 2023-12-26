#!/bin/bash

cd /home/ec2-user/modern_stays


/home/ec2-user/.nvm/versions/node/v20.10.0/bin/npm run build

export AWS_MODERNSTAY_CONFIG="$(aws secretsmanager get-secret-value --secret-id Modern_Stays_Variables)"