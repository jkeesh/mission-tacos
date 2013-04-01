import tornado.web

from models.base_model import User
import options


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        # user = User(username="test", password="mypassword")
        # user.save()

        user = User.get_by_username("test")
        print user.username

        self.render('index.html',
                    debug=options.cli_args.debug)
