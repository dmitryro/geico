// curl -k https://localhost:8000/
var https = require('https');
var fs = require('fs');

var options = {
  hostname: 'localhost',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('/var/www/vhosts/dev.soap116.signetcs.com/geico/certs/soap116.signetcs.com.private.pem'),
  cert: fs.readFileSync('/var/www/vhosts/dev.soap116.signetcs.com/geico/certs/soap116.signetcs.com.public.pem')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("Say hello to SSL\n");
}).listen(443);
