from SOAPpy import WSDL
import socket
import json
from json import JSONEncoder
import sys


class ClaimsEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__    
     #   else:
    #        print "NO RESULT FROM SHCEDULE CALL"
class claimsApplicationContext(object):
    clientApplicationMachineName = ""
    clientApplicationName = ""
    clientApplicationOS = ""
    clientSessionID = ""
    echoField = ""
    userID = ""
    userRegion = ""

    def __init__(self,clientMachineName,clientAppName,clientAppOS,sessionID,echo,userID,region):
        self.clientApplicationMachineName = clientMachineName
        self.clientApplicationName = clientAppName
        self.clientApplicationOS = clientAppOS
        self.clientSessionID = sessionID
        self.echoField = echo
        self.userID = userID
        self.userRegion = region


class vendorResponseForTestimonyRequestDto(object):
    invoiceNumber= '12312312312'
    isBooked = False
    isOriginalDoctorAvailable = False
    reason = ""
    substituteDoctor = ""
    substituteDoctorID = ""
    vendorResponseCreateDateTime = ""

    def __init__(self,invoice,isBooked,isOriginalAvailable,reason,substDoctor,substDoctorID,time):
        self.invoiceNumber = invoice
        self.isBooked = isBooked
        self.isOriginalDoctorAvailable = isOriginalAvailable
        self.reason = reason
        self.substituteDoctor =  substDoctor
        self.substituteDoctorID = substDoctorID
        self.vendorResponseCreateDateTime = time

class vendorResponseForTestimonyRequest(object):
    claimsApplicationContext = None
    vendorResponseForTestimonyRequestDto = None

    def __init__(self,claimsApplicationContext,vendorResponseForTestimonyRequestDto):
        self.claimsApplicationContext = claimsApplicationContext
        self.vendorResponseForTestimonyRequestDto = vendorResponseForTestimonyRequestDto



try :
    host, aliaslist, lan_ip = socket.gethostbyname_ex(socket.gethostname())
    print host

    url = 'https://partnerservicestest.geico.com/intgst/ExpertVendorResponseServices/services/ExpertVendorResponseServices?wsdl'

    wsdl = WSDL.Proxy(url)
    #result = server.vendorResponseForTestimony('{}')

    claimsrq = claimsApplicationContext('UT_S44','Signetcs Server','Linux','2342dsfsdff2343234','echo','42342342342','US')
    vendordto = vendorResponseForTestimonyRequestDto('234234234243',True,True,'some reason','some doctor','24234234','1-2-2012')


    request = vendorResponseForTestimonyRequest(claimsrq, vendordto)
 
    print wsdl.methods
    cjson = ClaimsEncoder().encode(request);
    print cjson

    wsdl.vendorResponseForTestimony(request)    

except ValueError:
    print "ValueError error:", sys.exc_info()[1]
except :
    print 'SOAP Fault error....'
    print "Unexpected error:", sys.exc_info()[0]
    raise

