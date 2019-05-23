#!/bin/bash


fuser -k 3000/tcp
fuser -k 5000/tcp
# fuser -k 5000/tcp

service redis_6379 stop
service redis_6379 start

# cd ./oj-client
# ng build --watch

cd ./oj-server
npm start &


cd ../executor
source /home/ruji/Program/anaconda3/etc/profile.d/conda.sh
# pip3 install requirements.txt
conda activate coj
python executor_server.py 5000 &
python executor_server.py 5001 &
python executor_server.py 5002 &


echo "===app runing==="
read -p "PRESS [enter] to terminate processes." PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp
fuser -k 5001/tcp
fuser -k 5002/tcp
service redis_6379 stop
conda deactivate
