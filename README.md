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


========

Server Setup

1. Create git repository for pushing to from here: https://gist.github.com/jkeesh/3774227

2. Install requirements on server
    
    $ sudo apt-get install python-dev
    $ sudo pip install -r requirements.txt 



Navigate in yo' web browsing device to http://localhost:8000/