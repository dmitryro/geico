from turbogears import controllers, expose, flash
from tgwebservices.controllers import WebServicesRoot, wsexpose, wsvalidate

class EchoService(WebServicesRoot):
    """EchoService web service definition"""

    @wsexpose(str)
    @wsvalidate(value=str)
    def echo(self, value):
        "Echo the input back to the caller."
        return value

class Root(controllers.RootController):
    """The root controller of the application."""

    echo = EchoService('http://192.168.51.40:8080/echo/')
