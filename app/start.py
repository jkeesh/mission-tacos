# Third-party imports
import tornado.ioloop
import tornado.httpserver
import tornado.web
import sys
import platform

## For production
if platform.node() == "madness":
    sys.path.append('/home/jkeesh/sites/missiontacos.com/app')
    local = False
else:
    local = True

from handlers import main_handlers
import options


class Application(tornado.web.Application):
    def __init__(self):
        url_handlers = [
            (r'/static/(.*)', tornado.web.StaticFileHandler, {
                'path': 'static/'
            }),
            (r'/login/', main_handlers.LoginHandler),
            (r'/register/', main_handlers.RegistrationHandler),
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
