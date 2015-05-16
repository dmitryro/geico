import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import logging
import logging.handlers
from tornado import web
from tornado.options import define, options
from tornado_routes import make_handlers
from tornado_routes import route
import clienttypes
import daemon
import os
import urllib2

ROOT = os.path.dirname(__file__)
URL_PREFIX = ''

#app = web.Application(make_handlers(URL_PREFIX,
# (r'/(robots\.txt|favicon\.ico)', web.StaticFileHandler, {"path": os.path.join(ROOT, 'static')}),
# (r'/soap', web.StaticFileHandler, {"path": os.path.join(ROOT, 'soap')}),
#))

define("port", default=8000, help="run on the given port", type=int)


@route('', name='index')
class IndexHandler(tornado.web.RequestHandler):
# @tornado.web.asynchronous
    def get(self):
        greeting = self.get_argument('greeting', 'Hello')
        self.write(greeting + ', friendly user!')
         


@route('', name='soap')
class SoapHandler(tornado.web.RequestHandler):
    def get(self):
        response = urllib2.urlopen('https://partnerservicestest.geico.com/intgst/ExpertVendorResponseServices/services/ExpertVendorResponseServices?wsdl')
        html = response.read()
        html = html.replace("http://10.240.16.65:1076","https://partnerservicestest.geico.com/intgst")
        self.write(html)

@route('', name='vendor')
class VendorHandler(tornado.web.RequestHandler):
    def get(self):
        response = urllib2.urlopen('https://soap116.signetcs.com/services/ScheduleExpertServiceBIPort?wsdl')
        html = response.read()
        self.write(html)

 
with daemon.DaemonContext():


    if __name__ == "__main__":
        tornado.options.parse_command_line()
        app = tornado.web.Application(handlers=[(r"/", IndexHandler),
                                                (r"/soap", SoapHandler),
                                                (r"/vendor", VendorHandler)])
        http_server = tornado.httpserver.HTTPServer(app)
        http_server.listen(options.port)
        tornado.ioloop.IOLoop.instance().start()
