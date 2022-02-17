#coding:utf-8
from datetime import datetime
from mongoengine import *

from tornado.escape import json_encode

class Shop(Document):
    meta = {
        "strict":False,
        "indexes":[
            "entity_id"
        ],
    }
    entity_id = SequenceField(unique=True)

    logo_image_path = StringField(default = "")

    shop_type = IntField(default = 0, choices = (0, 1, 2))


    #0 体验版， 1基础版 2 高级版 3 品牌定制客户
    vip_type = IntField(default = 0, choices = (0, 1, 2, 3))

    @property
    def vip_type_name(self):
        if self.vip_type == 0:
            return "体验版"
        if self.vip_type == 1:
            return "基础版"
        if self.vip_type == 2:
            return "专业版"
        if self.vip_type == 3:
            return "品牌定制客户"

    vip_expired_at = DateTimeField(default = datetime.now)

    @property
    def expired_days(self):
        a = datetime.now() - self.vip_expired_at
        return a.days
  

    @property
    def is_pay_tiped(self):
        a = datetime.now() - self.vip_expired_at
        return False if a.days <=14 else True

    year_custom_fee = IntField(default = 0) # 3 定制版年费，单位分


    name = StringField(default = "")
    service_phone = StringField(default = "")
    announcement = StringField(default = "") # 公告

    close_desc = StringField(default = "")
    
    password = StringField(default = "")
    trace_code = StringField(default = "")
    status = IntField(default = 0)

    reward_point_enabled = BooleanField(default = False)
    initial_ratio = IntField(default = 0)
    reward_point_limit = IntField(default = 0)
    exchange_ratio = IntField(default = 0)

    trade_expired_after = IntField(default = 30) # 订单失效时间, 默认30分钟

    auto_delivered_received = BooleanField(default = False) # 物流自动确认收货

    auto_received_day =  IntField(default = 15)  #订单自动确认天数
    auto_delivered_received = BooleanField(default = False) #订单自动确认收货

    modules = ListField(StringField(default = ""))

    @property
    def simple_data(self):
        data = {
            "name":self.name,
            "announcement":self.announcement,
            "service_phone":self.service_phone,
            "close_desc":self.close_desc,
            "password":self.password,
            "status":self.status,

            "logo_image_path":self.logo_image_path,

            "reward_point_enabled":self.reward_point_enabled,
            "initial_ratio":self.initial_ratio,
            "reward_point_limit":self.reward_point_limit,
            "exchange_ratio":self.exchange_ratio,
            "trade_expired_after":self.trade_expired_after,
            "auto_delivered_received":self.auto_delivered_received,
            "auto_received_day":self.auto_received_day,
            "auto_delivered_received":self.auto_delivered_received
        }
        return data

    @property
    def shop_id(self):
        return "v%d" % self.entity_id


    @property
    def store_modules(self):
        return json_encode(self.modules)


    updated_at = DateTimeField(default = datetime.now)
    created_at = DateTimeField(default = datetime.now)


if __name__ == "__main__":
    print "111"


   