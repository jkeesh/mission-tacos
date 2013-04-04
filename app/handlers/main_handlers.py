import json

import tornado.web

from models.base_model import User

import options


class VisitHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_id = self.get_secure_cookie("user_id")
        if not user_id:
            return None
        user = User.get_one(int(user_id))
        return user

    def post(self):
        user = self.get_current_user()
        taco_hash = self.get_argument('hash')
        cur = user.add_visit(taco_hash)

        # return useful response, not this
        response = json_success(cur)
        return self.write(response)


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

        # return useful response, not this
        response = json_success("Rated")
        return self.write(response)


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
                    user=user,
                    login_error=None,
                    register_error=None)


class LoginHandler(tornado.web.RequestHandler):

    def post(self):
        email = self.get_argument('email', None)
        password = self.get_argument('password', None)

        user = User.get_by_email(email)
        if not user or not user.check_password(password):
            self.render('index.html',
                        debug=options.cli_args.debug,
                        user=None,
                        login_error="Email or password incorrect!",
                        register_error=None)
            return

        self.set_secure_cookie("user_id", unicode(user.obj_id))
        self.redirect("/")


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

    def _render_register_error(self, error):
        self.render('index.html',
                    debug=options.cli_args.debug,
                    user=None,
                    login_error=None,
                    register_error=error)

    def post(self):
        email = self.get_argument('email')
        password = self.get_argument('password')
        confirm_password = self.get_argument('confirm_password')

        if not email or not password or not confirm_password:
            self._render_register_error("Missing required field!")
            return

        if not password == confirm_password:
            self._render_register_error("Passwords did not match!")
            return

        user_exists = User.get_by_email(email)
        if user_exists:
            self._render_register_error("Email address already registered!")
            return

        # create and store user object
        hashed_password = User.hash_password(password)
        user = User(email=email, password=hashed_password)
        user.save()

        # log user in
        self.set_secure_cookie("user_id", unicode(user.obj_id))
        self.redirect("/")
