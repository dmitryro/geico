var soap = require('soap');
//var url = 'http://soap116.signetcs.com:8000/vendor';
var url = 'https://soap116-dev.signetcs.com/services/ScheduleExpertServiceBIPort?wsdl';
//var url = 'http://soap116-dev.signetcs.com/services/ScheduleExpertServiceBIPort?wsdl';
//var url = 'https://soap116-dev.signetcs.com:443/soap';
var util = require('util');
var ip;

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  ip = add;
})

soap.createClient(url, function(args, client) {
    client.ScheduleExpertService.ScheduleExpertServiceBIPort.scheduleExpertForTestimony(
   {
     "scheduleExpertForTestimonyRequest": {
            "requestContext" : {
                "applicationName" : "plun3101.geico.corp.net",
                "osName" : "Linux",
                "uniqueRequestID" : "12020157plun3100.geico.corp.net",
                "userName" : "U1J245_L",
                "machineName" : "plun3101.geico.corp.net",
                "userRegion" : "Unknown",
                "echoField" : "env=int"
            },
            "scheduleExpertForTestimonyRequestDto" : {
               "uniqueRecordIDs" : '23423423',
                "trialDate" : '12-11-2014',
                "expertName": 'Dmitry Roitman',
                "expertIDNumber": "104201021233",
                "alternateExpertRequested": "Dmitry Roitman",
                "alternateExpertID" : "1231231231313",
                "expertReviewType" : "Expert",
                "courtType" : "TEST",
                "venueCounty" : "Nassau",
                "injuredParty" : 'tests',
                "legalActionNumber" : "432432424242",
                "claimNumber" : "12342342323",
                "invoiceNumber" : "123123123123",
                "clientID" : ip
            }
      }
    },
    function(err, result, body) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("SCHEDULE STATUS CODE: "+result.ScheduleExpertForTestimonyResponse.serviceStatus.statusCode);
        console.log("SCHEDULE STATUS MESSAGE: "+result.ScheduleExpertForTestimonyResponse.serviceStatus.statusMessage);
        console.log("SCHEDULE REQUEST CONTEXT applicationName:"+result.ScheduleExpertForTestimonyResponse.requestContext.applicationName);
        console.log("SCHEDULE REQUEST CONTEXT osName:"+result.ScheduleExpertForTestimonyResponse.requestContext.osName);
        console.log("SCHEDULE REQUEST CONTEXT uniqueRequestID:"+result.ScheduleExpertForTestimonyResponse.requestContext.uniqueRequestID);
        console.log("SCHEDULE REQUEST CONTEXT userName:"+result.ScheduleExpertForTestimonyResponse.requestContext.userName);
        console.log("SCHEDULE REQUEST CONTEXT machineName:"+result.ScheduleExpertForTestimonyResponse.requestContext.machineName);
        console.log("SCHEDULE REQUEST CONTEXT userRegion:"+result.ScheduleExpertForTestimonyResponse.requestContext.userRegion);
        console.log("SCHEDULE REQUEST CONTEXT echoField:"+result.ScheduleExpertForTestimonyResponse.requestContext.echoField);















    });
        


    client.ScheduleExpertService.ScheduleExpertServiceBIPort.cancelExpertForTestimony({
     "cancelExpertForTestimonyRequest": {
            "requestContext" : {
                "applicationName" : "plun3101.geico.corp.net",
                "osName" : "Linux",
                "uniqueRequestID" : "12020157plun3100.geico.corp.net",
                "userName" : "U1J245_L",
                "machineName" : "plun3101.geico.corp.net",
                "userRegion" : "Unknown",
                "echoField" : "env=int"
            },
            "cancelExpertForTestimonyRequestDto" : {
                "uniqueRecordIDs": "TEST12345TEST",
                "Cancellation": 'Cancellation',
                "cancellationReason": 'No service required.',
                "invoiceNumber": "104201021233",
                "clientID" : ip
            }
     }
    },
    function(err, result, body) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("CANCELLATION STATUS CODE: "+result.CancelExpertForTestimonyResponse.serviceStatus.statusCode);
        console.log("CANCELLATION STATUS MESSAGE: "+result.CancelExpertForTestimonyResponse.serviceStatus.statusMessage);
        console.log("CANCELLATION REQUEST CONTEXT applicationName:"+result.CancelExpertForTestimonyResponse.requestContext.applicationName);
        console.log("CANCELLATION REQUEST CONTEXT osName:"+result.CancelExpertForTestimonyResponse.requestContext.osName);
        console.log("CANCELLATION REQUEST CONTEXT uniqueRequestID:"+result.CancelExpertForTestimonyResponse.requestContext.uniqueRequestID);
        console.log("CANCELLATION REQUEST CONTEXT userName:"+result.CancelExpertForTestimonyResponse.requestContext.userName);
        console.log("CANCELLATION REQUEST CONTEXT machineName:"+result.CancelExpertForTestimonyResponse.requestContext.machineName);
        console.log("CANCELLATION REQUEST CONTEXT userRegion:"+result.CancelExpertForTestimonyResponse.requestContext.userRegion);
        console.log("CANCELLATION REQUEST CONTEXT echoField:"+result.CancelExpertForTestimonyResponse.requestContext.echoField);
    });

   


});

