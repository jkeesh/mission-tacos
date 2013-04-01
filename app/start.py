# Third-party imports
import tornado.ioloop
import tornado.httpserver
import tornado.web
import sys
import platform
import tornado.wsgi
import wsgiref.simple_server

## For production
if platform.node() == "madness":
    sys.path.append('/home/jkeesh/sites/missiontacos.com/app')
    local = False
else:
    local = True

from handlers import main_handlers
import options

print sys.path

if local:
    print "LOCAL"

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
else:
    print "LIVE"

    class MainHandler(tornado.web.RequestHandler):
        def get(self):
            self.write("Hello, world")

    application = tornado.wsgi.WSGIApplication([
        (r"/", MainHandler),
    ])
    server = wsgiref.simple_server.make_server('', 8888, application)
    server.serve_forever()

    print "WE GOT HERE"
