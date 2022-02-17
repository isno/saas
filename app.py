#coding:utf-8
import os
import sys
from redis import Redis

from tomako import MakoTemplateLoader

import jinja2
from tornado_jinja2 import Jinja2Loader

from tornado import web
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.options import define, options

from util.session import SessionManager

from url import handlers,sub_handlers

from config import conf

reload(sys)
sys.setdefaultencoding("utf-8")

define('port', default=8081, type=int)
options.parse_command_line()

jinja2_env = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
jinja2_loader = Jinja2Loader(jinja2_env)

class Main(web.Application):
    def __init__(self):
        settings = dict(
            debug = True,
            cookie_secret = "",
            xsrf_cookies = False,
            login_url = "/auth/login",
            static_path = os.path.join(os.path.dirname(__file__), "static"),
            template_path = os.path.join(os.path.dirname(__file__), "templates"),
            template_loader = jinja2_loader,
        )
        super(Main, self).__init__(handlers, **settings)

        self.redis = Redis(host=conf.get("redis", "host"), port=conf.get("redis", "port"), db =2)
        self.session_manager = SessionManager(self.redis)

        for sub_handler in sub_handlers:
            self.add_handlers(sub_handler[0], sub_handler[1])


if __name__ == "__main__":
    http_server = HTTPServer(Main(), xheaders=True)
    http_server.bind(options.port)
    http_server.start(1)
    print "start on port %s..." % options.port
    IOLoop.instance().start()