import tornado.web

from models.base_model import User
import options


class IndexHandler(tornado.web.RequestHandler):
    def get(self):

        self.render('index.html',
                    debug=options.cli_args.debug)
