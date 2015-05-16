import SOAPpy
import sys
import socket
import json
from json import JSONEncoder
import suds
import logging
from suds.client import Client
from mako.template import Template

class ClaimsEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

     # else:
    # print "NO RESULT FROM SHCEDULE CALL"
class ClaimsApplicationContext(object):
    def __init__(self,clientMachineName,clientAppName,clientAppOS,sessionID,echo,userID,region):
        self.clientApplicationMachineName = clientMachineName
        self.clientApplicationName = clientAppName
        self.clientApplicationOS = clientAppOS
        self.clientSessionID = sessionID
        self.echoField = echo
        self.userID = userID
        self.userRegion = region


class vendorResponseForTestimonyRequestDto(object):
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

class vendorResponseForTestimonyRequest(object):
    def __init__(self,context,DTO):
       self.claimsApplicationContext = context
       pass

class obj(object):
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [obj(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, obj(b) if isinstance(b, dict) else b)
#this is the solution

try :
    host, aliaslist, lan_ip = socket.gethostbyname_ex(socket.gethostname())

    logging.basicConfig(level=logging.INFO)
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
    url = 'http://soap116.signetcs.com:8000/soap'
    client = suds.client.Client(url)

    claimsContext = ClaimsApplicationContext('UT_S44','Signetcs Server',
                                             'Linux','2342dsfsdff2343234',
                                             'env=usr','42342342342','US')

    vendorDTO = vendorResponseForTestimonyRequestDto('14',
                                                     'true','true',
                                                     'some reason','Some great reason sent back',
                                                     '234235','03/07/2014')


    template = Template(filename='/geico/geico/soap/template.xml')
    request = template.render(clientappmachname=claimsContext.clientApplicationMachineName,
                          clientappname=claimsContext.clientApplicationName,
                          clientappos=claimsContext.clientApplicationOS,
                          sessionid=claimsContext.clientSessionID,
                          echofield=claimsContext.echoField,
                          userid=claimsContext.userID,
                          userregion=claimsContext.userRegion,
                          invoincenumber=vendorDTO.invoiceNumber,
                          isbooked=vendorDTO.isBooked,
                          isoriginalavailable=vendorDTO.isOriginalDoctorAvailable)

    response = client.service.vendorResponseForTestimony(__inject={'msg':request})
    #response = client.service.vendorResponseForTestimony(request)
    print 'response:'
    print response
except NameError:
    print "NameError error:", sys.exc_info()[0]

except TypeError:
    print "TypeError error:", sys.exc_info()[0]

except ValueError:
    print "ValueError error:", sys.exc_info()[1]

except SOAPpy.Types.faultType, ex:
    print ex

except :
    print 'SOAP Fault error....'
    print "Unexpected error:", sys.exc_info()[0]
    raise


