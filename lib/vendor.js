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
var async = require('async');
var thoonk = require('thoonk').createClient();
var Job = require('thoonk-jobs');
var QueryString = require('querystring');
var Request = require('request');
var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
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
}
// initialize database connection
var conn = mysql.createConnection({
   host : 'localhost',
   user : 'root',
   password : 'root',
   database : 'geicodb'
});

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
* Service Status Object
*/
function serviceStatus(code,message) {
    this.statusCode = code;
    this.statusMessage = message;
};

/**
*Request Conext Object
*/
function requestContext(req) {
    this.applicationName=req.applicationName;
    this.osName=req.osName;
    this.uniqueRequestID=req.uniqueRequestID;
    this.userName=req.userName;
    this.machineName=req.machineName;
    this.userRegion=req.userRegion;
    this.echoField=req.echoField;
};

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
            var result = validate_scheduling(args);
                args["record"] = 'Scheduling';
                args["clientID"] = args.clientID;
                args["sessionID"] = new issueNewSessionID();

                   var clientReq = {
                    'requestContext': {
                      'applicationName': result['applicationName'],
                      'osName' : result['osName'],
                      'uniqueRequestID' : result['uniqueRequestID'],
                      'userName' : result['userName'],
                      'machineName' : result['machineName'],
                      'userRegion' : result['userRegion'],
                      'echoField' :  result['echoField']
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
                                     userRegion:  result['userRegion'],
                                     echoField: result['echoField']
                                 },
                                 serviceStatus:  {
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
                                     userRegion:  result['userRegion'],
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
            var args = args["cancelExpertForTestimonyRequest"];
            var result = validate_cancellation(args);
        
                args["record"] = 'Cancellation';
                args["clientID"] = args.clientID;
                args["sessionID"] = new issueNewSessionID();

                   var clientReq = {
                    requestContext: {
                       applicationName: result['applicationName'],
                       osName: result['osName'],
                       uniqueRequestID: result['uniqueRequestID'],
                       userName: result['userName'],
                       machineName: result['machineName'],
                       userRegion:  result['userRegion'],
                       echoField: result['echoField']
                    },
                    cancelExpertForTestimonyDto : {
                       uniqueRecordIDs:  result['uniqueRecordIDs'],
                       Cancellation:  result['Cancellation'],
                       cancellationReason:  result['cancellationReason'],
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
                                      userRegion:  result['userRegion'],
                                      echoField: result['echoField']
                                 },
                                 serviceStatus:  {
                                     statusCode: result['statusCode'],
                                     statusMessage:result['statusMessage']
                                 }

                            }
                        });
                    } else {
                         callback({
                             CancelExpertForTestimonyResponse: {
                                 requestContext: {
                                      applicationName: result['applicationName'],
                                      osName: result['osName'],
                                      uniqueRequestID: result['uniqueRequestID'],
                                      userName: result['userName'],
                                      machineName: result['machineName'],
                                      userRegion:  result['userRegion'],
                                      echoField: result['echoField']
                                 },
                                 serviceStatus:  {
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



function validate_cancellation(args) {
    result = new Array();
    result['statusMessage'] = 'Success';
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
    return result;
}

function validate_scheduling(args) {
    result = new Array();
    result['statusMessage'] = 'Success';
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
    result['injuredParty'] = args['scheduleExpertForTestimonyRequestDto'].injuredParty+'-test';
    result['legalActionNumber'] = args['scheduleExpertForTestimonyRequestDto'].legalActionNumber;
    result['claimNumber'] = args['scheduleExpertForTestimonyRequestDto'].claimNumber;
    result['invoiceNumber'] = args['scheduleExpertForTestimonyRequestDto'].invoiceNumber;
    result['injuredParty']='test';
    if(result['injuredParty']=='' || result['injuredParty'].length<=0) {
        result['statusMessage'] = 'Injured party cannnot be empty!';
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
* Get statuses for
*/
function get_status(args) {
    var statuses = new Array();
    statuses[0] = new serviceStatus('00000',do_log(args));
 // statuses[1] = new serviceStatus('00000','ERROR');
    return statuses;
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
//   setInterval(req, 10000);
   res.writeHeader(200, {'content-type': 'Content-Type: text/xml; charset=utf-8'});
   res.write("{'response':service poked,'date':"+date_now+",'id':"+id+",'db':"+record+"}");
   res.end();

//   res.write("{'response':service poked,'date':"+date_now+",'id':"+id+",'db':"+record+"}");
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
* log the soap call into the database
*/

function do_log(params) {
        var context = params['requestContext']; 
        var args = [];
        switch(params['record']) {
           case 'Cancellation': args = params['cancelExpertForTestimonyRequestDto']; break;
           case 'Scheduling' :  args = params['scheduleExpertForTestimonyRequestDto']; break;
             context = params['requestContext'];
           default: args = params; break;
        }
        var date_now = moment().format('MMMM Do YYYY, h:mm:ss a');
        logger.trace('Remote connection time '+date_now+', ip called:'+concat(args.clientID));
                   
        var sql = "INSERT INTO access_log (unique_record_id,invoice_number,trial_date,log_status,"+
                  "timestamp,expert_name,expert_id_number,expert_review_type,court_type,venue_county,"+
                  "injured_party_name,legal_action_number,claim_number,alternate_expert_id_number,"+
                  "alternate_expert_requested,client_id) VALUES ?";
        var values = [
            [
             concat(args.uniqueRecordIDs).stripSingleQuotes(),
             concat(args.invoiceNumber).stripSingleQuotes(),
             concat(args.trialDate).stripSingleQuotes(),
             concat(args.record).stripSingleQuotes(),
             concat(date_now).stripSingleQuotes(),
             concat(args.expertName).stripSlashes().stripSingleQuotes(),
             concat(args.expertIDNumber).stripSingleQuotes(),
             concat(args.expertReviewType).stripSingleQuotes(),
             concat(args.courtType).stripSingleQuotes(),
             concat(args.venueCounty).stripSingleQuotes(),
             concat(args.injuredParty).stripSlashes().stripSingleQuotes(),
             concat(args.legalActionNumber).stripSingleQuotes(),
             concat(args.claimNumber).stripSingleQuotes(),
             concat(args.alternateExpertID).stripSingleQuotes(),
             concat(args.alternateExpertRequested).stripSingleQuotes(),
             concat(args.clientID).stripSingleQuotes()]
        ];

        conn.query(sql, [values], function(err) {

        if (err) { // report an error if any
               record = 'error';
               throw err;
               return 'FAILURE';
        }
        conn.end();
     });
     obj = {'invoiceNumber': concat(args.invoiceNumber).stripSingleQuotes(),
            'date': concat(date_now).stripSingleQuotes(),
            'sessionID': concat(params['sessionID'].sessionID).stripSingleQuotes(),
            'userRegion':  context['userRegion'],
            'osName': context['osName'],
            'applicationName':context['applicationName'],
            'machineName':context['machineName'],
            'echoField':context['echoField']};
     post_job(JSON.stringify(obj));
     mailOptions.subject = 'Geico call';
     mailOptions.html = '<p>Method called:'+params['record']+'</p>'+
                        '<p>Time:'+date_now+'</p>'+
                        '<p>Unique record ID:'+concat(args.uniqueRecordIDs).stripSingleQuotes()+'</p>'+
                        '<p>Invoice number'+concat(args.invoiceNumber).stripSingleQuotes()+'</p>';
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
