MISSION TACOS

To get started:

Install python requirements:

    cd ..
    mkdir mission-tacos-env
    virtualenv mission-tacos-env
    source mission-tacos-env/bin/activate

    cd mission-tacos
    pip install -r requirements.txt

    python app/start.py

Install redis:

    curl -O http://redis.googlecode.com/files/redis-2.6.8.tar.gz
    tar xzf redis-2.6.8.tar.gz
    cd redis-2.6.8
    make

Copy over redis init scripts:

    sudo cp src/redis-server /usr/local/bin/
    sudo cp src/redis-cli /usr/local/bin/

To start the app, open 3 terminal windows:

    1) python app/start.py
    2) redis-server
    3) redis-cli

Navigate in yo' web browsing device to http://localhost:8000/