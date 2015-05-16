var sys = require("sys"),
gc_http = require("http"); // required for http connection
var url = require('url'); // required for url processing
var mysql = require('mysql'); // required for mysql logging
var soap = require('soap'); // soap connection library
var fs = require('fs'); // file system utils
var Request = require('request');

var https = require('https');
var fs = require("fs");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var options = {
//  hostname: 'partnerservicestest.geico.com',
  hostname: 'scheduletestimonytest.geico.com',
  port: 443,
  path: '/ExpertVendorResponseServices/services/ExpertVendorResponseServices?wsdl',
//  method: 'GET',
  key: fs.readFileSync('/etc/nginx/ssl/soap116-dev_signetcs_com.in.key.pem'),
  cert: fs.readFileSync('/etc/nginx/ssl/soap116-dev_signetcs_com.in.crt.pem'),
//  ca: fs.readFileSync('/etc/pki/tls/certs/chain.pem'),
  requestCert: true,
  rejectUnauthorized: false
};

var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);

  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});
/*
server = https.createServer(options, function (req, res) {
  res.writeHead(200, {
  'server':'node',
  'content-type': 'text/html; charset=iso-8859-1',
  'content-length': '202',
  'keep-alive': 'timeout=5, max=100',
  'date':date_now});
  res.end("Say hello to SSL\n");
}).listen(7000);
*/

