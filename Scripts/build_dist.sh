#!/bin/bash

export AWS_MODERNSTAY_CONFIG="$(aws secretsmanager get-secret-value --secret-id Modern_Stays_Variables)"