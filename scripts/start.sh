#!/bin/bash

/home/ec2-user/workspace/bbe-dev

sudo npm install

pm2 start npm --name "bbe-dev" -- start
