#!/bin/bash

cd /home/ec2-user/modern_stays

npm run build

export AWS_MODERNSTAY_CONFIG="$(aws secretsmanager get-secret-value --secret-id Modern_Stays_Variables)"