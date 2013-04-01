import redis

redis_conn = redis.StrictRedis(host='localhost', port=6379, db=0)
