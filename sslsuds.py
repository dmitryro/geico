# Wrapper for SUDS to provide HTTPS client authentication for the SUDS SOAP library
# Modified from http://www.threepillarglobal.com/soap_client_auth
#
# Added support for Python 2.6 (Liam Friel, 2011)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the (LGPL) GNU Lesser General Public License as
# published by the Free Software Foundation; either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Library Lesser General Public License for more details at
# ( http://www.gnu.org/licenses/lgpl.html ).
#
# You should have received a copy of the GNU Lesser General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
#

import httplib
import urllib2 as u2
from suds.client import Client
from suds.options import Options
from suds.properties import Unskin
from suds.transport.http import HttpTransport, Reply, TransportError

# SUDS Client Auth solution
# Modified by Liam Friel (liam.friel@s3group.co): use of kwargs directly
class HttpClientAuthTransport(HttpTransport):
    def __init__(self, key, cert, **kwargs):
        HttpTransport.__init__(self, **kwargs)
        self.urlopener = u2.build_opener(HTTPSClientAuthHandler(key, cert))

class SSLSuds(object):

    def __init__(self, key, cert, url):
        self.key = key
        self.cert = cert
        self.url = url
        pass

    def getClient(self):
        transport = HttpClientAuthTransport(self.key, self.cert, timeout=60)
        cl = Client(self.url, transport = transport)
        return cl


class HTTPSClientAuthHandler(u2.HTTPSHandler):
    def __init__(self, key, cert):
        u2.HTTPSHandler.__init__(self)
        self.key = key
        self.cert = cert
    def https_open(self, req):
        #Rather than pass in a reference to a connection class, we pass in
        # a reference to a function which, for all intents and purposes,
        # will behave as a constructor
        return self.do_open(self.getConnection, req)

    def getConnection(self, host, timeout=300):
        return httplib.HTTPSConnection(host, key_file=self.key, cert_file=self.cert)

class HTTPSClientCertTransport(HttpTransport):
    def __init__(self, key, cert, *args, **kwargs):
        HttpTransport.__init__(self, *args, **kwargs)
        self.key = key
        self.cert = cert

    def u2open(self, u2request):
        """
        Open a connection.
        @param u2request: A urllib2 request.
        @type u2request: urllib2.Requet.
        @return: The opened file-like urllib2 object.
        @rtype: fp
        """
        tm = self.options.timeout
        url = u2.build_opener(HTTPSClientAuthHandler(self.key, self.cert))
        if self.u2ver() < 2.6:
            socket.setdefaulttimeout(tm)
            return url.open(u2request)
        else:
            return url.open(u2request, timeout=tm)




