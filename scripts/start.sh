#!/bin/bash

cd /usr/repos/bluebirdevents

npm install

pm2 start npm --name "bbe-dev" -- start
