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

    (
        Jeremy: set up virtualenv using
        $ workon mission-tacos
    )

    1) python app/start.py
    2) redis-server
    3) redis-cli


========

Server Setup

1. Create git repository for pushing to from here: https://gist.github.com/jkeesh/3774227

2. Install requirements on server
    
    $ sudo apt-get install python-dev
    $ sudo pip install -r requirements.txt 

3. Install redis on server as above

    $ sudo apt-get install make

Navigate in yo' web browsing device to http://localhost:8000/


=========

Deploy Process, because I'll probably forget

    $ git push web master

    // Login to server
    // (optional) $ screen -ls

    $ screen -r tacos-app

    // Find previous python process
    $ ps aux | grep python

    // Kill previous python process
    $ sudo kill -9 <pid>

    // Start again
    $ sudo python app/start.py &

    // Server
    $ sudo service apache2 restart

    // Close screen
    Ctrl + a, d