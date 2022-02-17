#coding:utf-8
import time
import uuid
from hashlib import md5
import datetime


from tornado.web import RequestHandler,decode_signed_value
from tornado.escape import json_decode,json_encode

import util.session as session

from model.customer import Customer
from model.shop import Shop



class AppHandler(RequestHandler):
    def __init__(self, application, request, **kwargs):
        RequestHandler.__init__(self, application, request, **kwargs)
        self.redis  = self.application.redis
        self.session = session.Session(self.application.session_manager, self)
        self.now = datetime.datetime.now()

        
        self.shop = Shop.objects.get(entity_id = 1)

        '''
        self.cur_time = int(time.time())*1000
        self._asset_host = "http://iyoudian.shengyi8.com"


        self.token = self.get_token()  
        
       
        theme = Theme.objects.get(site = self.site)

        self.site.theme = json_decode(theme.preview) if theme.preview else {}
        '''
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header('Access-Control-Allow-Headers', '*')

    def get_order_id(self):
        date = self.now.strftime("%Y%m%d")
        key = "order_id_%s" % date
        if self.redis.exists(key):
            self.redis.incr(key)
            return "%s%05d" % (date,int(self.redis.get(key)))

        self.redis.incr(key)
        self.redis.expire(key, 84600)
        return "%s00001" % date
        

    def options(self, *key):
        # no body
        self.set_status(204)
        self.finish()

    def render(self, template_name, **kwargs):
        ''''
        kwargs.update({
            "shop":Shop(self.site),
            "linklists":Linklists(self.site),
            'STATIC_URL': self.settings.get('static_url_prefix', '/static/'),
            'VERSION': self.now.isoformat(),
            })
        '''
        super(AppHandler, self).render(template_name, **kwargs)


    def get_token(self):
        uid = self.get_cookie("token")
        if uid:
            return uid

        uid = uuid.uuid4()
        token = md5(str(uid)).hexdigest()
        self.set_cookie("token", token)

        return token



    def get_current_user(self):

        uid = self.request.headers.get("token")
        uid = self.get_secure_cookie("yd_token", uid)
        if not uid:
            return None

        if not uid.isdigit():
            return None
        user = Customer.objects(entity_id = int(uid)).first()
        
        return user

    def json_message(self, error_code = 0, data = {}, message = "" ):
        self.write({"code":error_code, "message":message, "data":data})

