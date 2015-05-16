import socket
import json
from json import JSONEncoder
import sys


class ClaimsEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__

     #   else:
    #        print "NO RESULT FROM SHCEDULE CALL"
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
        self.substituteDoctor =  substDoctor
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

