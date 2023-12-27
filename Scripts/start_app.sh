#!/bin/bash

cd /home/ec2-user/

export AWS_MODERNSTAY_CONFIG="$(aws secretsmanager get-secret-value --secret-id Modern_Stays_Variables)"

# pm2 start dist/index.js