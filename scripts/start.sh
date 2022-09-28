#!/bin/bash

cd /usr/repos/storeways-server
sudo npm install

pm2 start npm --name "bbe-dev" -- start
