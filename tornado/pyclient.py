import SOAPpy
import sys
import socket
import json
from json import JSONEncoder
import suds
import logging
from suds.client import Client
from mako.template import Template
from clienttypes import ClaimsApplicationContext
from clienttypes import vendorResponseForTestimonyRequestDto


#this is the solution
def call_geico(self):
    try :
        host, aliaslist, lan_ip = socket.gethostbyname_ex(socket.gethostname())

        logging.basicConfig(level=logging.INFO)
        logging.getLogger('suds.client').setLevel(logging.DEBUG)
        url = 'http://soap116.signetcs.com:8000/soap'
        client = suds.client.Client(url)

        claimsContext = ClaimsApplicationContext('UT_S44','Signetcs Server',
                                                 'Linux','2342dsfsdff2343234',
                                                 'echo','42342342342','US')

        vendorDTO = vendorResponseForTestimonyRequestDto('21',
                                                         'true','true',
                                                         'some reason','some doctor',
                                                         '234234','12-12-12')


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

