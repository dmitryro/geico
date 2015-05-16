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
#    (r'/(robots\.txt|favicon\.ico)', web.StaticFileHandler, {"path": os.path.join(ROOT, 'static')}),
#    (r'/soap',  web.StaticFileHandler, {"path": os.path.join(ROOT, 'soap')}),
#))

define("port", default=443, help="run on the given port", type=int)


@route('', name='index')
class IndexHandler(tornado.web.RequestHandler):
#    @tornado.web.asynchronous
    def get(self):
        greeting = self.get_argument('greeting', 'Hello')
        self.write(greeting + ', secure user!')
         

@route('', name='services/ScheduleExpertServiceBIPort')
class SoapSignetcsHandler(tornado.web.RequestHandler):
    def get(self):
        response = urllib2.urlopen('http://soap116.signetcs.com/services/ScheduleExpertServiceBIPort?wsdl')
        html = response.read()
  #      html = html.replace("http://soap116.signetcs.com","https://soap116.signetcs.com")
        self.write(html)
    

@route('', name='soap')
class SoapHandler(tornado.web.RequestHandler):
    def get(self):
        response = urllib2.urlopen('https://partnerservicestest.geico.com/intgst/ExpertVendorResponseServices/services/ExpertVendorResponseServices?wsdl')
        html = response.read() 
        html = html.replace("http://10.240.16.65:1076","https://partnerservicestest.geico.com/intgst")
        self.write(html)
 
with daemon.DaemonContext():

    settings = dict(
        ssl_options = {
            "certfile": os.path.join("/etc/pki/tls/certs/soap116.signetcs.com.pem"),
            "keyfile": os.path.join("/etc/pki/tls/certs/soap116.signetcs.com.key.pem"),
            #"CAfile": os.path.join("/etc/pki/tls/certs/signetcs-chain.pem"),
        },
    )

    if __name__ == "__main__":
        tornado.options.parse_command_line()
        app = tornado.web.Application(handlers=[(r"/", IndexHandler),
                                                (r"/soap", SoapHandler),
                                                (r"/services/ScheduleExpertServiceBIPort", SoapSignetcsHandler)])
        http_server = tornado.httpserver.HTTPServer(app,**settings)
        http_server.listen(options.port)
        tornado.ioloop.IOLoop.instance().start()



