var async = require('async');
var thoonk = require('thoonk').createClient();
var Job = require('thoonk-jobs');
var streamBuffers = require("stream-buffers");
var net = require('net');
var client = new net.Socket();
var redis = require("redis"),
    rclient = redis.createClient();

var i = 0;

//myReadableStreamBuffer.put(aBuffer);

var jobsReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
    frequency: 10, // in milliseconds.
    chunkSize: 2048 // in bytes.
});

client.connect(8010, '127.0.0.1', function() {
    console.log('Connected');
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
});
 
client.on('close', function() {
console.log('Connection closed');
})

jobsReadableStreamBuffer.on("data", function(data) {
    // Yup.
    // Store into redis to process
   rclient.set("claimed", data.toString(), redis.print);
//   console.log(data.toString());
 
});

function process_jobs() {
    thoonk.registerObject('Job', Job, function () {
        var jobWorker = thoonk.objects.Job('GeicoJobsChannel');
        async.forever(function (next) {
            jobWorker.get(0, function (err, item, id) {
                if (err) return next();
            
                item = JSON.parse(item);
                if (eval(i) > 0) {
                    jobsReadableStreamBuffer.put(', ');
                }

                jobsReadableStreamBuffer.put(i+": ");

                jobsReadableStreamBuffer.put(item);


                jobWorker.finish(id, 'the results', function (err) {
                    i++;
                    next();
                });
            });
        });
    });
    return false;
}
process_jobs();
