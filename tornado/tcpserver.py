import daemon
import errno
import functools
import socket
import redis
from tornado import ioloop, iostream, gen
from tornado.tcpserver import TCPServer
import clienttypes
#def _read(stream):
# stream.read_until('\r\n', self._eol_callback)

class TCPHandler(TCPServer):
# def __init__(self,client_id):
# self.client_id = client_id
# return
    @gen.coroutine
    def handle_stream(self,stream,address):
        self._stream = stream
        self._read_line()
          
  
    @gen.coroutine
    def _read_line(self):
        self._stream.read_until('\n',self._handle_read)

    @gen.coroutine
    def _handle_read(self, data_in):
        self._stream.write('You sent: %s' % data_in)
        self._read_line()


@gen.coroutine
def on_headers(data):
    headers = {}
    for line in data.split("\r\n"):
       parts = line.split(":")
       if len(parts) == 2:
           headers[parts[0].strip()] = parts[1].strip()
    stream.read_bytes(int(headers["Content-Length"]), on_body)

@gen.coroutine
def on_body(data):
    print data
    stream.close()
    ioloop.IOLoop.instance().stop()

@gen.coroutine
def connection_ready( sock, fd, events):
    while True:
        try:
            connection, address = sock.accept()
        except socket.error, e:
            if e[0] not in (errno.EWOULDBLOCK, errno.EAGAIN):
                raise
            return
        connection.setblocking(0)
        stream = iostream.IOStream(connection)
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        pipe = r.pipeline()
        jobs = r.get('claimed')
        jobs = "{" + jobs + "}"
        stream.write("HTTP/1.0 200 OK\r\nContent-Length: 5\r\n\r\n"+jobs+"\r\n", stream.close)

@gen.coroutine
def on_events(fd, events, error=None):

    if events & ioloop.IOLoop.READ:
        print 'Socket read: %r' % fd.recv(1024)

    if events & ioloop.IOLoop.ERROR:
        print 'Error received: %r' % error

    if events & ioloop.IOLoop.WRITE:
        pass

@gen.coroutine
def main():

    io_loop = ioloop.IOLoop.instance()
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.setblocking(0)
    sock.bind(("", 8010))
    sock.listen(5000)
    callback = functools.partial(connection_ready, sock)
    io_loop.add_handler(sock.fileno(), callback, io_loop.READ)

    try:
        io_loop.start()
    except KeyboardInterrupt:
        io_loop.stop()
        print "exited cleanly"


with daemon.DaemonContext():
    if __name__ == '__main__':
        io_loop = ioloop.IOLoop.instance()
        io_loop.run_sync(main)
