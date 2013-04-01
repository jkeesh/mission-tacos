import json

import bcrypt
from dictshield.document import Document
from dictshield.fields import EmailField
from dictshield.fields import IntField
from dictshield.fields import UUIDField
from dictshield.fields import StringField

from redis_connection import redis_conn

class Model(Document):
    key_prefix = None

    # every model should have an id
    obj_id = IntField()

    def save(self):
        if not self.key_prefix:
            raise Exception("Key prefix not defined!")

        # if id is not set, assume we're creating object
        if not self.id:
            self.obj_id = redis_conn.incr("%s:id" % self.key_prefix)

        redis_conn.set("%s:%s" % (self.key_prefix, self.obj_id), self.to_json())
        return self.obj_id

    @classmethod
    def get_one(cls, obj_id):
        if not cls.key_prefix:
            raise Exception("Key prefix not defined!")

        if not obj_id:
            return None

        obj_str = redis_conn.get("%s:%s" % (cls.key_prefix, obj_id))
        if not obj_str:
            return None

        obj_json = json.loads(obj_str)
        return cls(**obj_json)


class User(Model):

    key_prefix = "user"

    email = EmailField(max_length=1024)
    password = StringField(max_length=5000)

    @classmethod
    def get_by_email(cls, email):
        max_id = redis_conn.get("%s:id" % cls.key_prefix)
        if not max_id:
            return None

        for idx in xrange(1, int(max_id) + 1):
            user = cls.get_one(idx)
            if not user:
                continue

            if user.email == email:
                return user
        return None

    @classmethod
    def hash_password(cls, raw_password):
        hashed_pw = bcrypt.hashpw(raw_password, bcrypt.gensalt())
        return hashed_pw

    def check_password(self, password):
        return bcrypt.hashpw(password, self.password) == self.password
