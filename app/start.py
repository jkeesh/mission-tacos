# Third-party imports
import tornado.ioloop
import tornado.httpserver
import tornado.web
import sys
import os
import platform


## For production
if platform.node() == "madness":
    sys.path.append('/home/jkeesh/sites/missiontacos.com/app')

    # This way print statements don't break our code
    #sys.stdout = sys.stderr

from handlers import main_handlers
import options

# except ImportError:
#     sys.path.append(os.path.dirname(__file__))
#     print sys.path
#     try:
#         from handlers import main_handlers
#     except:

#         pass


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
