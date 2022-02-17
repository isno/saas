#coding:utf-8
from time import time
import datetime
from util.app_handler import AppHandler
from tornado.web import authenticated


class Home(AppHandler):
    def get(self):
        self.render("app/theme.html")

class Save(AppHandler):
    @authenticated
    def post(self):
        
        name = self.get_argument("name", "")
        realname  = self.get_argument("real_name", "")
        sex = self.get_argument("sex", "")

        indentity_card = self.get_argument("indentity_card", "")

        birthday = self.get_argument("birthday", "")
        birthday = datetime.datetime.strptime(birthday, "%Y/%m/%d") if birthday else False

        customer = self.current_user
        customer.name = name
        customer.realname = realname
        customer.sex = sex
        customer.indentity_card = indentity_card
        if birthday:
            customer.birthday = birthday
        customer.save()

        self.json_message(200)

class Current(AppHandler):
    def get(self):
        customer = None
        if self.current_user:
            customer = {
                "id":self.current_user.entity_id,
                "name":self.current_user.name if  self.current_user.name else self.current_user.account,
                "notify_email":self.current_user.notify_email,
                "notify_phone":self.current_user.notify_phone,
                "birthday":"" if not self.current_user.birthday else self.current_user.birthday.strftime("%Y-%m-%dT00:00:00.000+08:00"),
                "sex":self.current_user.sex,
                "avatar_url":"%s%s!158x158.jpg" % (self._asset_host, self.current_user.avatar_url),
                "social_accounts":[]
            }
            customer["customer_level"] = {
                "avatar_url":"",
                "credits":0,
                "discount":100,
                "id":1,
                "name":"普通会员"
            }
        
        self.write({"code":200, "customer":customer})



class CustomerLevel(AppHandler):
    def get(self):
        data = {
            "credits":0,
            "discount":100,
            "id":1,
            "name":"黄金会员"
        }
        self.write({"code":200, "customer_level":[data]})

handlers = [
    (r"/account/?", Home),
    (r"/account/orders|", Home),
    (r"/api/account/save", Save),
    (r"/api/account/current", Current),
    (r"/api/customer_level",CustomerLevel )
]