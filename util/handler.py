#coding:utf-8
import functools
import base64
import time
import random
import calendar
from decimal import Decimal
from hashlib import md5
import datetime
from tornado.escape import json_encode
from tornado.web import RequestHandler,decode_signed_value

import util.session as session

from model.account import Account
from model.shop import Shop
from model.account_to_shop import AccountToShop



class BaseHandler(RequestHandler):
    def __init__(self, application, request, **kwargs):
        RequestHandler.__init__(self, application, request, **kwargs)
        self.redis  = self.application.redis
        self.session = session.Session(self.application.session_manager, self)
        self.now = datetime.datetime.now()
        

        self.set_header("Content-Security-Policy", "frame-ancestors isno.iyoudian.cn")
        self.cur_time = int(time.time())*1000
        
        shop_id = self.request.headers.get("Shop-Id", 0)
        if not shop_id:
            shop_id = self.get_argument("shop_id", 0)
        self.shop = None
        if shop_id and shop_id.isdigit():
            self.shop =  Shop.objects(entity_id = int(shop_id)).first()
            

        self._asset_host = "http://iyoudian.shengyi8.com/"
        
    
    def get_current_user(self):

        uid = self.get_secure_cookie("auth")
        if not uid:
            return None

        if not uid.isdigit():
            return None
        user = Account.objects(entity_id = int(uid)).first()
        if self.shop:
            auth  = AccountToShop.objects(shop = self.shop, account = user).first()
            user.account_modules = json_encode(auth.modules)

        
        return user

    def notice(self, types ='err', message = ''):
        message = "%s\n%s" % (types, message)
        self.session["notice"] = message
        self.session.save()

    def notice_clear(self):
        self.session["notice"] = None
        self.session.save()
        return ""

    def utc_datetime(self, value):
        format = '%Y-%m-%d %H:%M:%S'
        utc_format ='%Y-%m-%dT%H:%M:00.000+08:00'
        local = datetime.datetime.strptime(value,utc_format)
        dt   = datetime.datetime.strftime(local,format)
        return dt

    '''
    UPYUN sdk
    '''
    @property
    def upyun_policy(self):
        policy = {}
        policy["bucket"] = "youdian360"
        policy["save-key"] = "/uploads/{year}/{mon}/{day}/{filemd5}{.suffix}"
        policy["expiration"] = int(time.time()) + 3600
        return base64.b64encode(json_encode(policy))
    @property
    def upyun_signature(self):
        return md5("%s&%s" % (self.upyun_policy, "+t4aQJxYWMFi3jwAjyoRgZJ2JIU=")).hexdigest()

    def json_message(self, error_code = 0, data = {}, message = "" ):
        self.write({"code":error_code, "message":message, "data":data})


def authenticated(module = ""):
    def func_wrapper(method):
        @functools.wraps(method)
        def return_wrapper(self, *args, **kwargs):
            if not self.shop:
                return self.json_message(201, {}, "商店状态异常，请联系爱优店")

            res = AccountToShop.objects(shop = self.shop, account = self.current_user).first()
            if not res:
                return self.json_message(201, {}, "用户无权限")

            if module == "m_account" and res.account_type!=0:
                return self.json_message(201, {}, "无权限")

            if res.account_type != 0:
                if module!= "" and  module not in res.modules:
                    return self.json_message(201, {}, "商店无权限")
            return method(self, *args, **kwargs)
        return return_wrapper
    return func_wrapper

