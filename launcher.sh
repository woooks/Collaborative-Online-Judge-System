#! bin/bash


fuser -k 3000/tcp
# fuser -k 5000/tcp

services restart redis

# cd ./oj-client
# ng build --watch

cd ./oj-server
npm start &

cd ./executor
# pip3 install requirements.txt
python3 executor_server.py 

echo "===app runing==="
read -p "PRESS [enter] to terminate processes." PRESSKEY

# fuser -k 3000/tcp
# fuser -k 5000/tcp
services stop redis
