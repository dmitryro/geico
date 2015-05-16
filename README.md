==========================================
Geico connection README Instructions
==========================================

Please make sure your local db has a database named geicodb
Please make sure your local db has a table access_log
Please make sure your local db has a table doctors

Alternatively, use mysql -u root -p geicodb < error_log.sql

To get the initial copy (if running from a diferent account), run
git clone git@github.com:dmitryro/geico.git

==========================================
Node.js initial setup
==========================================

If node is not installed, run

yum install nodejs

npm install daemon

npm install moment

To shut the existing daemon run:
kill -9 $(pidof node)

To make sure all the needed node modules are installed, please run
npm update

It's  assumed that the plugins needed by node.js to be used with the soap
server will be configured in /geico/geico/package.json 

The wsdl file, used by the soap server, implemented as lib/app.js is located in
/geico/geico/soap/ScheduleExpertService.wsdl 

To test the node client run
node client.js - this will generate a mock request to the soap server.

To test the existing local SSL certificates run

node ssh_test_client.js

The output should be the wsld file read securely.


To run the node daemon on port 80 run:

cd /geico/geico

sudo bin/node-simple-http-daemon


Now geico test wsld is available on port  80
Make sure nginx reverse proxy is active
or run:

service nginx restart


To test the wsld, run:

curl --insecure https://soap116.sigentcs.com/services/ScheduleExpertServiceBIPort?wsdl

run: 

ps -ef

to see the existing nginx master and slaves, as well as node daemon

Now the server is running on port 443 with the certificates located in /etc/nignx/ssl

To modify the certificates change their names Instructions
/etc/nginx/conf.d/default.conf -  see the server section.

The main nginx configuration file is 
/etc/nginx/nginx.conf
      

To run the signetcs vendor server test run:

cd /geico/geico (skip if there)

node client.js

To run the geico vendor response client run

python2.7 secclient.py

To load new records into the doctors table:

run 

python2.7 parse.py

When asked for the file name, provide the absolute path to the excel file.

This will load all the records into the mysql table named 'doctors'. 




===============
Logs and events
===============

All the incoming SOAP calls are logged in the file

/geico/geico/logs/soap.log 


All the nginx, running as the reverse proxy, errors are
logged in 

/var/www/vhosts/dev.soap116.signetcs.com/logs/ssl-error.log

All the nginx access is logged in

/var/www/vhosts/dev.soap116.signetcs.com/logs/ssl-access.log




===================================================
Sending a vendor response
===================================================


To send a vendor response from your terminal:
- see the following example:

run:

python2.7 response.py


Type in some data, for example:

Enter Invoice Number (integer): 109

Is booked? (true/false).:true

Is original doctor available? (true/false): false

Any reason? (text): Doctor Baron will be in Europe and doctor Garofalo is in California

Enter Substitute Doctor ID (integer): 44

Enter Substitute Doctor Name (text):Mc'Neal, Gerhard

Hit 'Enter' and see the SOAP log.

Alternatively, open secclient.py and replace the data in lines 105-109
-  vendorResponseForTestimonyRequestDto object :
                      invoice,
                      isBooked,
                      isOriginalAvailable,
                      reason,
                      substDoctor,
                      substDoctorID,
                      time
with your own values, and then run:

python2.7 secclient.py

As with response.py, you'll see the SOAP log of your call 
(this time with the hardcoded values)




==================================================================
Vendor Response SOAP Template
==================================================================

The envelope template used in response.py and secclient.py to send the soap

messages is located at 

/var/www/vhosts/dev.soap116.signetcs.com/geico/soap/template.xml

=================================================================
Troubleshooting Tips
=================================================================
1. Verify that redis is running: redis-cli
2. If redis is down, restart: service supervisord restart
3. Stop all the node daemons: kill -9 $(pidof node)
4. Restart node: sudo bin/node-simple-http-daemon
5. Restart nginx:  service nginx restart
6. Run test client: cd /geico/geico
                    node client.js
7. To make changes to supervisor configuration, please modify
 /etc/supervisord.conf
