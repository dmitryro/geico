import sys
import site
import socket
import json
import suds
import logging
import time
import datetime
import requests
import SOAPpy
import _mysql
from suds.client import Client
from mako.template import Template
from suds.transport.http import HttpAuthenticated
from suds.transport import Reply, TransportError
from sslsuds import SSLSuds
from json import JSONEncoder
import MySQLdb 


"""
        RequestTransport - https authentication object.
"""
class RequestsTransport(HttpAuthenticated):
    """
        Construct the object.
    """
    def __init__(self, **kwargs):
        self.cert = kwargs.pop('cert', None)
        self.key = kwargs.pop('key', None)
        # super won't work because not using new style class
        HttpAuthenticated.__init__(self, **kwargs)

    """
        Open the secure connection.
    """
    def open(self, request):
        self.addcredentials(request)
        resp = requests.get(request.url, data=request.message,
                             headers=request.headers, key=self.key, cert=self.cert)
        result = io.StringIO(resp.content.decode('utf-8'))
        return result

    """
        Send a message.
    """
    def send(self, request):
        self.addcredentials(request)
        resp = requests.post(request.url, data=request.message,
                             headers=request.headers, key=self.key, cert=self.cert)

        result = Reply(resp.status_code, resp.headers, resp.content)
        return result

"""
        Helper object for dictionary encoding.
"""
class ClaimsEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

"""
        Claims application context object.
"""
class ClaimsApplicationContext(object):
    """
        Construct the object.
    """
    def __init__(self,clientMachineName,clientAppName,clientAppOS,sessionID,echo,userID,region):
        self.clientApplicationMachineName = clientMachineName
        self.clientApplicationName = clientAppName
        self.clientApplicationOS = clientAppOS
        self.clientSessionID = sessionID
        self.echoField = echo
        self.userID = userID
        self.userRegion = region

"""
        Vendor response for testimony Data Type object.
"""
class vendorResponseForTestimonyRequestDto(object):
    """
        Construct the object.
    """
    def __init__(self,invoice,isBooked,
                      isOriginalAvailable,
                      reason,substDoctor,
                      substDoctorID,time):
        self.invoiceNumber = invoice
        self.isBooked = isBooked
        self.isOriginalDoctorAvailable = isOriginalAvailable
        self.reason = reason
        self.substituteDoctor = substDoctor
        self.substituteDoctorID = substDoctorID
        self.vendorResponseCreateDateTime = time

"""
        Vendor response for testimony Request object.
"""
class vendorResponseForTestimonyRequest(object):
    """
        Construct the object.
    """
    def __init__(self,context,DTO):
       self.claimsApplicationContext = context
       pass

class obj(object):
    """
        Construct the object.
    """
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [obj(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, obj(b) if isinstance(b, dict) else b)

def bool_eval(b):
     if  b=='true':
          return 1
     else: 
          return 0

invoice = raw_input('Enter Invoice Number (integer): ')
isbooked = raw_input('Is booked? (true/false): ')
isoriginalavailable = raw_input('Is original doctor available? (true/false): ')
reason = raw_input('Any Reason? (text): ')
substituteid = raw_input('Enter Substitute Doctor ID (integer): ')
substitutename = raw_input('Enter Substitute Doctor Name (text): ')
substitutename2 = raw_input('')

     
try :
    host, aliaslist, lan_ip = socket.gethostbyname_ex(socket.gethostname())
    logging.basicConfig(level=logging.INFO)
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
    url = 'https://scheduletestimonytest.geico.com/ExpertVendorResponseServices/services/ExpertVendorResponseServices?wsdl'
    key = '/etc/nginx/ssl/soap116-dev_signetcs_com.in.key.pem'
    cert = '/etc/nginx/ssl/soap116-dev_signetcs_com.in.crt.pem'

    ssl = SSLSuds(key, cert, url)
    client = ssl.getClient()
    claimsContext = ClaimsApplicationContext('UT_S44','Signetcs Server',
                                             'Linux','424vf4234gss22s',
                                             'env=usr','122221111116','US')

    vendorDTO = vendorResponseForTestimonyRequestDto(invoice,
                                                     isbooked,
                                                     isoriginalavailable,
                                                     reason,
                                                     substitutename + substitutename2,
                                                     substituteid, 
                                                     time.strftime("%x"))


    template = Template(filename='/geico/geico/soap/template.xml')
    i = datetime.datetime.now()
    dtime = "%s %s:%s:%s" % (time.strftime("%x"),i.hour,i.minute,i.second) # format the time 
    request = template.render(clientappmachname=claimsContext.clientApplicationMachineName,
                          clientappname=claimsContext.clientApplicationName,
                          clientappos=claimsContext.clientApplicationOS,
                          sessionid=claimsContext.clientSessionID,
                          echofield=claimsContext.echoField,
                          userid=claimsContext.userID,
                          userregion=claimsContext.userRegion,
                          invoincenumber=vendorDTO.invoiceNumber,
                          isbooked=vendorDTO.isBooked,
                          reason=vendorDTO.reason,
                          substituteDoctorID=vendorDTO.substituteDoctorID,
                          substituteDoctor=vendorDTO.substituteDoctor,
                          isoriginalavailable=vendorDTO.isOriginalDoctorAvailable,
                          datetime=time.strftime("%x"),
                          hour=i.hour,
                          minute=i.minute,
                          second=i.second
                          )

    # call the web service
    response = client.service.vendorResponseForTestimony(__inject={'msg':request})
    print response
  #  con = _mysql.connect('localhost', 'root', 'root', 'geicodb')
 #   cur = con.cursor()
    try :
         con = MySQLdb.connect(host = '127.0.0.1', 
                               user = 'root', 
                               passwd = 'root', 
                               db = 'geicodb', 
                               port = 3306,
                               use_unicode=True, 
                               charset="utf8")
         cur = con.cursor()
         sql = "INSERT INTO bookings(date,doctor_id,substitute_doctor_id,status,\
                            is_booked,\
                            reason,\
                            injured_party,\
                            invoice_number,\
                            is_original_available) \
                VALUES ('%s', %s, %s, '%s', %s, '%s', '%s', '%s', %s)" % \
                       (dtime,
                        123123,
                        substituteid,
                        response.serviceStatus[0].code,
                        bool_eval(isbooked),
                        reason,
                        'an injured party',
                        invoice,
                        bool_eval(isoriginalavailable))

         cur.execute(sql)

    except MySQLdb.MySQLError, exc:
        print "[%d] %s" % exc.args
        # print "Error %d: %s" % (e.args[0], e.args[1])
        sys.exit(1)

    finally:
        if con:
            con.close()
# Handle the naming errors
except NameError:
    print "NameError error:", sys.exc_info()[0]
# Handle the type errors
except TypeError:
    print "TypeError error:", sys.exc_info()[0]
# Handle the value errors
except ValueError:
    print "ValueError error:", sys.exc_info()[1]
# Handle SOAP Faults
except SOAPpy.Types.faultType, ex:
    print ex
# Handle other errors
except :
    print 'SOAP Fault error....'
    print "Unexpected error:", sys.exc_info()[0]
    raise
# close the database connection
