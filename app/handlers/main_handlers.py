import json

import tornado.web

from models.base_model import User
from models.base_model import Rating

import options


class RatingHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_id = self.get_secure_cookie("user_id")
        if not user_id:
            return None
        user = User.get_one(int(user_id))
        return user

    def post(self):
        user = self.get_current_user()
        val = self.get_argument('value')

        taco_hash = self.get_argument('hash')
        user.add_rating(taco_hash, val)

        self.render('index.html',
                    debug=options.cli_args.debug,
                    user=user)


class IndexHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_id = self.get_secure_cookie("user_id")
        if not user_id:
            return None
        user = User.get_one(int(user_id))
        return user

    def get(self):
        user = self.get_current_user()
        self.render('index.html',
                    debug=options.cli_args.debug,
                    user=user)


class LoginHandler(tornado.web.RequestHandler):

    def post(self):
        email = self.get_argument('email')
        password = self.get_argument('password')

        user = User.get_by_email(email)
        if not user:
            return None

        if not user.check_password(password):
            return None

        self.set_secure_cookie("user_id", unicode(user.obj_id))
        response = json_success("Logged in successfully!")
        return self.write(response)


def json_failure(message):
    return json.dumps({
        'status': "failure",
        'message': message
    })


def json_success(message):
    return json.dumps({
        'status': "success",
        'message': message
    })


class RegistrationHandler(tornado.web.RequestHandler):

    def post(self):
        email = self.get_argument('email')
        password = self.get_argument('password')
        confirm_password = self.get_argument('confirm_password')

        if not email or not password or not confirm_password:
            response = json_failure("Missing required field!")
            return self.write(response)

        if not password == confirm_password:
            response = json_failure("Passwords did not match!")
            return self.write(response)

        user_exists = User.get_by_email(email)
        if user_exists:
            response = json_failure("Email has already been registered!")
            return self.write(response)

        # create and store user object
        hashed_password = User.hash_password(password)
        user = User(email=email, password=hashed_password)
        user.save()
        return self.write(json_success("Registered successfully!"))
