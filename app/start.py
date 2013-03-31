# Third-party imports
import tornado.ioloop
import tornado.httpserver
import tornado.web

# Our imports
from handlers import main_handlers
import options


class Application(tornado.web.Application):
    def __init__(self):
        url_handlers = [
            (r'/.*', main_handlers.IndexHandler),
        ]
        tornado.web.Application.__init__(self,
                                         url_handlers,
                                         autoescape=None,
                                         **options.tornado_settings)

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.cli_args.port)
    tornado.ioloop.IOLoop.instance().start()
