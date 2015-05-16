import sys
import random
from ZSI.ServiceContainer import AsServer
from ScheduleExpertService_services_server import *
from ZSI import dispatch
  
import ScheduleExpertService_services_types as MyComplexTypes

quotations = [ "All men by nature desire knowledge. Aristotle",
"Man is by nature a political animal. Aristotle",
"Many people would sooner die than think. In fact they do. Russell",
"Science may be described as the art of systematic over-simplification. Popper",
"The smallest minority on earth is the individual. Rand",
"The limits of my language mean the limits of my world. Wittgenstein" ]
class Service(ScheduleExpertService):

    def scheduleExpertForTestimony(self, ps):
    #    response = ns0.ForTodayResponse_Dec().pyclass()
     #   response.ForTodayResult = random.choice(quotations)
        return response

    if __name__ == "__main__" :
   #AsServer(8080, (Service('geico'),)
         dispatch.AsServer(port=8080, typesmodule=(MyComplexTypes,))
