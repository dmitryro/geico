import cyclone.web
import sys
from twisted.internet import reactor
from twisted.internet import ssl
from twisted.python import log


class MainHandler(cyclone.web.RequestHandler):
    def get(self):
        self.write("Hello, %s" % self.request.protocol)


def main():
    log.startLogging(sys.stdout)
    application = cyclone.web.Application([
        (r"/", MainHandler)
    ])

    interface = "soap116.signetcs.com"
    reactor.listenTCP(8888, application, interface=interface)
    reactor.listenSSL(8443, application,
                      ssl.DefaultOpenSSLContextFactory("/etc/pki/tls/certs/soap116.signetcs.com.private.pem",
                                                       "/etc/pki/tls/certs/soap116.signetcs.com.public.pem"),
                      interface=interface)
    reactor.run()


if __name__ == "__main__":
    main()
