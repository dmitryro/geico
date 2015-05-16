var tls = require('tls'), fs = require('fs'), sys = require('sys'), net = require('net');
 
var options = {
    cert: fs.readFileSync('/etc/nginx/ssl/soap116-dev_signetcs_com.in.crt.pem'),
    key: fs.readFileSync('/etc/nginx/ssl/soap116-dev_signetcs_com.in.key.pem'),
    host: 'soap116-dev.signetcs.com'
//    host: 'scheduletestimonytest.geico.com'
};
 
sys.puts("Tunnel started.");
var client = this;
 
// try to connect to the server
client.socket = tls.connect(443, options, function() {
    if (client.socket.authorized) {
        sys.puts("Auth success, connected to TLS server");
    } else {
        //Something may be wrong with your certificates
        sys.puts("Failed to auth TLS connection: ");
        sys.puts(client.socket.authorizationError);
    }
});
 
client.socket.addListener("data", function (data) {
    sys.puts("Data received from server: " + data);
});
 
var server = net.createServer(function (socket) {
    socket.addListener("connect", function () {
        sys.puts("Connection from " + socket.remoteAddress);
        //sync the file descriptors, so that the socket data structures are the same
        client.socket.fd = socket.fd;
        //pipe the incoming data from the client directly onto the server
        client.socket.pipe(socket);
        //and the response from the server back to the client
        socket.pipe(client.socket);
    });
 
    socket.addListener("data", function (data) {
        sys.puts("Data received from client: " + data);
    });
 
    socket.addListener("close", function () {
        //close the tunnel when the client finishes the connection.
        server.close();
    });
});
 
server.listen(7000);
