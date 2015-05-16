var sys = require("sys"),
gc_http = require("http"); // required for http connection
var moment = require("moment"); // reuqired for timestamp
var url = require('url'); // required for url processing
var mysql = require('mysql'); // required for mysql logging
var soap = require('soap'); // soap connection library
var fs = require('fs'); // file system utils
var util = require('util');
var xml = fs.readFileSync('./soap/ScheduleExpertService.wsdl', 'utf8');
var log4js = require('log4js');
var thoonk = require('thoonk').createClient();
var Job = require('thoonk-jobs');
var QueryString = require('querystring');
var Request = require('request');
var nodemailer = require("nodemailer");
var async = require('async');
var scheduling_records=0;
var cancellation_records=0;

var Db = require('mysql-activerecord');
var db = new Db.Adapter({
    server: 'localhost',
    username: 'root',
    password: 'root',
    database: 'geicodb'
});

var smtpTransport = nodemailer.createTransport("SMTP",{
       service: "Gmail",
       auth: {
          user: "allseeingeye1001@gmail.com",
          pass: "nu45edi1"
       }
});

var mailOptions = {
    from: "Signetcs Admin ✔ <admin@signetcs.com>", // sender address
    to: "dmitryro@gmail.com, dmitryro@gmail.com.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
    html: "<b>Hello world ✔</b>" // html body
};
var dboptions = {
   host : 'localhost',
   user : 'root',
   password : 'root',
   database : 'geicodb'
};
// initialize database connection
var conn = mysql.createConnection(dboptions);
//
// initialize soap
var cfg = {
    wsdl_file: 'soap/ScheduleExpertService.wsdl',
    service_url_path: '/services/ScheduleExpertServiceBIPort',
    service_port: 80,
    psp_url: 'http://192.168.51.40:80/admin/if_vac_h'
}

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: './logs/soap.log', category: 'soap' }
  ]
});

var logger = log4js.getLogger('soap');
logger.setLevel('auto');
var ip;
var reqSeq = 0;
var defLog = false;

/**
* Issue a new session
*
*/
function issueNewSessionID() {
    this.sessionID='2411r45sdg56777';
};


// web service description
var SoapService = {
   ScheduleExpertService: {
       ScheduleExpertServiceBIPort: {
           scheduleExpertForTestimony: function(args, callback) {
            var args = args["scheduleExpertForTestimonyRequest"];
          // do_log(args);
            var result = validate_scheduling(args);
                args["record"] = 'Scheduling';
                args["clientID"] = args.clientID;
                args["sessionID"] = new issueNewSessionID();
                do_log(args);
                   var clientReq = {
                    'requestContext': {
                      'applicationName': result['applicationName'],
                      'osName' : result['osName'],
                      'uniqueRequestID' : result['uniqueRequestID'],
                      'userName' : result['userName'],
                      'machineName' : result['machineName'],
                      'userRegion' : result['userRegion'],
                      'echoField' : result['echoField']
                    },
                    'scheduleExpertForTestimonyRequestDto' : {
                      'uniqueRecordIDs': result['uniqueRecordIDs'],
                      'trialDate': result['trialDate'],
                      'expertName': result['expertName'],
                      'expertIDNumber': result['expertIDNumber'],
                      'alternateExpertRequested': result['alternateExpertRequested'],
                      'alternateExpertID' : result['alternateExpertID'],
                      'expertReviewType' : result['expertReviewType'],
                      'courtType' : result['courtType'],
                      'venueCounty' : result['venueCounty'],
                      'injuredParty' : result['injuredParty'],
                      'legalActionNumber' : result['legalActionNumber'],
                      'claimNumber' : result['claimNumber'],
                      'invoiceNumber' : result['invoiceNumber']
                    }
                };

                
                Request({
                },
                function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        callback({
                            SheduleExpertForTestimonyResponse: {
                                 requestContext: {
                                     applicationName: result['applicationName'],
                                     osName: result['osName'],
                                     uniqueRequestID: result['uniqueRequestID'],
                                     userName: result['userName'],
                                     machineName: result['machineName'],
                                     userRegion: result['userRegion'],
                                     echoField: result['echoField']
                                 },
                                 serviceStatus: {
                                     statusCode: result['statusCode'],
                                     statusMessage:result['statusMessage']
                                 }

                            }
                        });
                    } else {
                         callback({
                             ScheduleExpertForTestimonyResponse: {
                                 requestContext: {
                                     applicationName: result['applicationName'],
                                     osName: result['osName'],
                                     uniqueRequestID: result['uniqueRequestID'],
                                     userName: result['userName'],
                                     machineName: result['machineName'],
                                     userRegion: result['userRegion'],
                                     echoField: result['echoField']
                                 },

                                 serviceStatus: {
                                     statusCode: result['statusCode'],
                                     statusMessage:result['statusMessage']
                                 }
                             }
                        });
                    }
                });
            }, // scheduleExpertForTestimony ends


           cancelExpertForTestimony: function(args, callback) {
  // args["sessionID"] = new issueNewSessionID();
  // do_log(args);
            var args = args["cancelExpertForTestimonyRequest"];
            var result = validate_cancellation(args);
        // do_log(args);
                args["record"] = 'Cancellation';
                args["clientID"] = args.clientID;
                args["sessionID"] = new issueNewSessionID();
                do_log(args);

                   var clientReq = {
                    requestContext: {
                       applicationName: result['applicationName'],
                       osName: result['osName'],
                       uniqueRequestID: result['uniqueRequestID'],
                       userName: result['userName'],
                       machineName: result['machineName'],
                       userRegion: result['userRegion'],
                       echoField: result['echoField']
                    },
                    cancelExpertForTestimonyDto : {
                       uniqueRecordIDs: result['uniqueRecordIDs'],
                       Cancellation: result['Cancellation'],
                       cancellationReason: result['cancellationReason'],
                       invoiceNumber: result['invoiceNumber']
                    }
                };
                Request({
                },
                function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        callback({
                            CancelExpertForTestimonyResponse: {
                                 requestContext: {
                                      applicationName: result['applicationName'],
                                      osName: result['osName'],
                                      uniqueRequestID: result['uniqueRequestID'],
                                      userName: result['userName'],
                                      machineName: result['machineName'],
                                      userRegion: result['userRegion'],
                                      echoField: result['echoField']
                                 },
                                 serviceStatus: {
                                     statusCode: result['statusCode'],
                                     statusMessage:result['statusMessage']
                                 }

                            }
                        });
                    } else {
                         callback({
                             CancelExpertForTestimonyResponse: {
                                 requestContext: {
                                      applicationName: result['applicationName'] ,
                                      osName: result['osName'],
                                      uniqueRequestID: result['uniqueRequestID'],
                                      userName: result['userName'],
                                      machineName: result['machineName'],
                                      userRegion: result['userRegion'],
                                      echoField: result['echoField']
                                 },
                                 serviceStatus: {
                                     statusCode: result['statusCode'],
                                     statusMessage:result['statusMessage']
                                 }

                             }
                        });
                    }
                });
            } // cancelExpertForTestimony ends
        } // ScheduleExpertServiceBIPort ends
    } // ScheduleExpertService ends
} // SoapService ends

function check_empty(st) {
   return /\S+/.test(st);
}

function check(st) {
   if (st=='{}') return true;
   else return false;
}

function validate_cancellation(args) {
//    var records;
    result = new Array();
    result['statusMessage'] = 'SUCCESS';
    result['statusCode'] = '00000';
    result['osName'] = args['requestContext'].osName;
    result['applicationName'] = args['requestContext'].applicationName;
    result['uniqueRequestID'] = args['requestContext'].uniqueRequestID;
    result['userName'] = args['requestContext'].userName;
    result['machineName'] = args['requestContext'].machineName;
    result['userRegion'] = args['requestContext'].userRegion;
    result['echoField'] = args['requestContext'].echoField;
    result['uniqueRecordIDs'] = args['cancelExpertForTestimonyRequestDto'].uniqueRecordIDs;
    result['Cancellation'] = args['cancelExpertForTestimonyRequestDto'].Cancellation;
    result['cancellationReason'] = args['cancelExpertForTestimonyRequestDto'].cancellationReason;
    result['invoiceNumber'] = args['cancelExpertForTestimonyRequestDto'].invoiceNumber;

    db.query('SELECT *  FROM access_log where log_status="Cancellation" AND  invoice_number='+result['invoiceNumber'], function(err, results) {

         cancellation_records= results.length;
    });

    if(eval(cancellation_records)>0) {
        result['statusMessage'] = 'SUCCESS - TRYING TO CANCEL AN ALREADY CANCELLED EVENT';
        result['statusCode'] = 'TREAT-AS-SUCCESS-SES-001';
    }

    cancellation_records='';
 
    if (check( util.inspect(result['uniqueRecordIDs'][0],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['Cancellation'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['cancellationReason'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['invoiceNumber'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }
    return result;
  //

}

/**
* Function to validate the scheduling request
* @param args - request arguments array
* @return result - array of response values
*/

function validate_scheduling(args) {
  //  var records;
    result = new Array();
    result['statusMessage'] = 'SUCCESS';
    result['statusCode'] = '00000';
    result['osName'] = args['requestContext'].osName;
    result['applicationName'] = args['requestContext'].applicationName;
    result['uniqueRequestID'] = args['requestContext'].uniqueRequestID;
    result['userName'] = args['requestContext'].userName;
    result['machineName'] = args['requestContext'].machineName;
    result['userRegion'] = args['requestContext'].userRegion;
    result['echoField'] = args['requestContext'].echoField;
    result['uniqueRecordIDs'] = args['scheduleExpertForTestimonyRequestDto'].uniqueRecordIDs;
    result['trialDate'] = args['scheduleExpertForTestimonyRequestDto'].trialDate;
    result['expertName'] = args['scheduleExpertForTestimonyRequestDto'].expertName;
    result['expertIDNumber'] = args['scheduleExpertForTestimonyRequestDto'].expertIDNumber;
    result['alternateExpertRequested'] = args['scheduleExpertForTestimonyRequestDto'].alternateExpertRequested;
    result['alternateExpertID'] = args['scheduleExpertForTestimonyRequestDto'].alternateExpertID;
    result['expertReviewType'] = args['scheduleExpertForTestimonyRequestDto'].expertReviewType;
    result['courtType'] = args['scheduleExpertForTestimonyRequestDto'].courtType;
    result['venueCounty'] = args['scheduleExpertForTestimonyRequestDto'].venueCounty;
    result['injuredParty'] = args['scheduleExpertForTestimonyRequestDto'].injuredParty;
    result['legalActionNumber'] = args['scheduleExpertForTestimonyRequestDto'].legalActionNumber;
    result['claimNumber'] = args['scheduleExpertForTestimonyRequestDto'].claimNumber;
    result['invoiceNumber'] = args['scheduleExpertForTestimonyRequestDto'].invoiceNumber;
   

    db.query('SELECT *  FROM access_log where log_status="Scheduling" AND  invoice_number='+result['invoiceNumber'], function(err, results) {
       scheduling_records = results.length;
    });

    if(eval(scheduling_records)>0) {
        result['statusMessage'] = 'SUCCESS - TRYING TO REBOOK AN EXISTING RECORD';
        result['statusCode'] = 'TREAT-AS-SUCCESS-SES-001';
    }


 
    // Verify the mandatory fields are not empty
    if (check( util.inspect(result['uniqueRequestID'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }


    if (check( util.inspect(result['uniqueRecordIDs'][0],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }


    if (check( util.inspect(result['injuredParty'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['expertName'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['trialDate'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['courtType'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['venueCounty'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['legalActionNumber'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['claimNumber'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }

    if (check( util.inspect(result['invoiceNumber'],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }


    if (check( util.inspect(result['uniqueRecordIDs'][0],true))) {
        result['statusMessage'] = 'ERROR - A mandatory field is missing!';
        result['statusCode'] = 'RETRY-SES-001';
    }


    return result;

}

function get_unique_ids(args) {
    var uniqueids = new Array();
    uniqueids[0] = '121213112111';
    return uniqueids;
}

/**
* create the http server
*/


var server = gc_http.createServer(function(req,res){
   sys.puts("I got kicked");
   var date_now = moment().format('MMMM Do YYYY, h:mm:ss a');
   var id = url.parse(decodeURI(req.url), true).query.id;

   if (id === undefined)
         id = 0;

   if (id === null)
         id = 0;
// setInterval(req, 10000);
   res.writeHeader(200, {'content-type': 'Content-Type: text/xml; charset=utf-8'});
   res.write("{'response':service poked,'date':"+date_now+",'id':"+id+",'db':"+record+"}");
   res.end();

// res.write("{'response':service poked,'date':"+date_now+",'id':"+id+",'db':"+record+"}");
}).listen(80, function() {
  console.log('server bound');
});


// make the web service avaiable
soap.listen(server, '/services/ScheduleExpertServiceBIPort', SoapService, xml);

sys.puts("Server Running on 80");

process.on('SIGTERM', function () {
    if (server === undefined) return;
       
    server.close(function () {
    // Disconnect from cluster master
        process.disconnect && process.disconnect();
    });
});


/**
* verify the string can be properly stripped
*/

function verify_field(st) {
    result = '';
    if (st!=undefined && st.length>0)
           result = concat(st).stripSingleQuotes().stripSlashes();
    return result;
}
/**
* log the soap call into the database
*/
function do_log(params) {
        var context = params['requestContext'];
        var args = [];

        switch(params['record']) {
           case 'Cancellation': args = params['cancelExpertForTestimonyRequestDto']; break;
           case 'Scheduling' : args = params['scheduleExpertForTestimonyRequestDto']; break;
             context = params['requestContext'];
           default: args = params; break;
        }

        var date_now = moment().format('MMMM Do YYYY, h:mm:ss a');
        logger.trace('Remote connection time '+date_now+', ip called:'+concat(args.clientID));

        var uniqueRecordIDs = '';
        var trialDate = '';
        var record = '';
        var expertName = '';
        var expertIDNumber = '';
        var expertReviewType = '';
        var courtType = '';
        var venueCounty = '';
        var injuredParty = '';
        var legalActionNumber = '';
        var claimNumber = '';
        var alternateExpertID = '';
        var alternateExpertRequested = '';
        var clientID = '';
        var invoiceNumber = '';

        invoiceNumber = verify_field(args.invoiceNumber);
        uniqueRecordIDs = verify_field(args.uniqueRecordIDs[0]);
        trialDate = verify_field(args.trialDate);
        record = params['record'];
        expertName = verify_field(args.expertName);
        expertIDNumber = verify_field(args.expertIDNumber);
        expertReviewType = verify_field(args.expertReviewType);
        courtType = verify_field(args.courtType);
        venueCounty = verify_field(args.venueCounty);
        injuredParty = verify_field(args.injuredParty);
        legalActionNumber = verify_field(args.legalActionNumber);
        claimNumber = verify_field(args.claimNumber);
        alternateExpertID = verify_field(args.alternateExpertID);
        alternateExpertRequested = verify_field(args.alternateExpertRequested);
        clientID = verify_field(args.clientID);

        var sql = "INSERT IGNORE INTO access_log (unique_record_id,invoice_number,trial_date,log_status,"+
                  "timestamp,expert_name,expert_id,expert_review_type,court_type,venue_county,"+
                  "injured_party,legal_action_number,claim_number,alternate_expert_id,"+
                  "alternate_expert_requested,client_id) VALUES ?";
        var values = [
            [
             uniqueRecordIDs,
             invoiceNumber,
             trialDate,
             record,
             date_now,
             expertName,
             expertIDNumber,
             expertReviewType,
             courtType,
             venueCounty,
             injuredParty,
             legalActionNumber,
             claimNumber,
             alternateExpertID,
             alternateExpertRequested,
             clientID]
        ];

        conn.query(sql, [values], function(err) {

        if (err) { // report an error if any
               record = 'error';
               throw err;
               return 'FAILURE';
        }
      // conn.end();


     });

     if (params['record']='Scheduling') {

             obj = {'invoiceNumber': verify_field(args.invoiceNumber),
                    'date': verify_field(date_now),
                    'sessionID': verify_field(params['sessionID'].sessionID),
            'userRegion': context['userRegion'],
            'osName': context['osName'],
            'applicationName':context['applicationName'],
            'machineName':context['machineName'],
            'echoField':context['echoField'],
            'record': params['record'],
            'injuredParty':injuredParty,
            'trialDate':trialDate,
            'expertName':verify_field(args.expertName),
            'expertIDNumber':verify_field(args.expertIDNumber),
            'expertReviewType':expertReviewType,
            'courtType':courtType,
            'venueCounty':venueCounty,
            'legalActionNumber':legalActionNumber,
            'claimNumber':claimNumber,
            'alternateExpertID':alternateExpertID,
            'alternateExpertRequested':alternateExpertRequested,
            'clientID':clientID
            };


     }
     else
     if (params['record']='Cancellation') {

     obj = {'invoiceNumber': verify_field(args.invoiceNumber),
            'date': verify_field(date_now),
            'sessionID': verify_field(params['sessionID'].sessionID),
            'userRegion': context['userRegion'],
            'osName': context['osName'],
            'applicationName':context['applicationName'],
            'machineName':context['machineName'],
            'echoField':context['echoField'],
            'record': params['record'],
            'Cancellation':Cancellation,
            'cancellationReason':cancellationReason,
            'userName':userName,
            'clientID':clientID
            };


     }
     else
     obj = {'invoiceNumber': verify_field(args.invoiceNumber),
            'date': verify_field(date_now),
            'sessionID': verify_field(params['sessionID'].sessionID),
            'userRegion': context['userRegion'],
            'osName': context['osName'],
            'applicationName':context['applicationName'],
            'machineName':context['machineName'],
            'echoField':context['echoField']};
     post_job(JSON.stringify(obj));
     mailOptions.subject = 'Geico call';
     mailOptions.html = '<p>Method called:'+params['record']+'</p>'+
                        '<p>Time:'+date_now+'</p>'+
                        '<p>Unique record ID:'+verify_field(args.uniqueRecordIDs)+'</p>'+
                        '<p>Invoice number'+verify_field(args.invoiceNumber)+'</p>';
     mailOptions.text = '';
     send_email(mailOptions);
     return 'SUCCESS';
}
/**
* Strip single quotes
*/

String.prototype.stripSingleQuotes = function(){
    if (this.charAt(0)!="'") return this;
    return this.substring(1,this.length-1);
}

/**
* Strip the slashes
*/

String.prototype.stripSlashes = function(){
    return this.replace(/\\(.)/mg, "$1");
}

/**
* Sanitize the string before logging
*/

function concat(args) {
       
    var init = args;
    args = util.inspect(args,true); // try to inspect

    if (args.toString().charAt(0)!='{') // not a JSON format - return
            return args;
       

    var str='';
    var res='';
      
    args = args.toString();
    args = args.replace("{","");
    args = args.replace("}","");
    res = args.split(",");
       //return res[0];
    var i=0;

    try {
       for(i=0;i<res.length;i++) {
          var parts=res[i].split(':');
          var r = parts[1];
          r = r.replace("'","");
          var san = r.split("'");
          str=str+san[0]; // append the sanitized string
       }
       var fstr='';
            
       for(i=0;i<str.length;i=i+2) { // go over characters, skip empty
             fstr=fstr+str.charAt(i-1); // concatenate characters
       }
       fstr=fstr+str.charAt(str.length-1);// append the last char
       
       return fstr;
   }
   catch(e) {
       return e;
   }
}

function send_email(options) {

    smtpTransport.sendMail(options, function(error, response){
        if (error){
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
       }

    // if you don't want to use this transport object anymore, uncomment following line
    // //smtpTransport.close(); // shut down the connection pool, no more messages
    });
    return false;
}

function post_job(job_json) {
    console.log(job_json);
    thoonk.registerObject('Job', Job, function () {

    var jobPublisher = thoonk.objects.Job('GeicoJobsChannel');
    jobPublisher.subscribe(function () {

        jobPublisher.publish(job_json, {
            onFinish: function () {
                console.log('Job completed!');
            }
        }, function () {
            console.log('Job published');
        });

    });
  });
   logger.trace('A JOB PUBLISHED:'+job_json);

}

