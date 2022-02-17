#coding:utf-8
from datetime import datetime
from hashlib import md5
from model.shop import Shop
from mongoengine import *
from mongoengine import signals
from model.customer_level import CustomerLevel

from es.customer import CustomerES

class Customer(Document):
    meta = {
        "strict":False,
        "indexes":[
            "shop",
            "openid"
        ],
        'ordering': ['entity_id'],
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)

    openid = StringField(default="")
    session_key = StringField(default="")

    name = StringField(default="")
    regist_source = IntField(default = 6) # 默认注册，微信

    account = StringField(default="")
    password_hash = StringField(default="")

    sex = StringField(default="")

    phone = StringField(default="137648916600")
    birthday = DateTimeField()

    accept_marketing = BooleanField(default = True)
    avatar_path = StringField(default="")

    credit = IntField(default = 0) #用户积分

    '''
    是否首次下单
    '''
    def is_first_order(self, shop):
        return True

    @property
    def password(self):
        raise AttributeError("password is not a readable")


    @property
    def avatar_url(self):
        if self.avatar_path:
            return self.avatar_path
        else:
            return "/image/2020/1/c2bb14eb455aa12c389e80086b386647.png"


    @property
    def level(self):
        return CustomerLevel.objects(shop = self.shop, credits__gte=self.credit).first()
        
    @property
    def level_icon(self):
        if self.level.avatar:
            return "%s!16x16.jpg" % (self.level.avatar.file_path)

    @password.setter
    def password(self, password):
        self.password_hash = md5(password).hexdigest()

    def verify_password(self,password):
        return md5(password).hexdigest() == self.password_hash


    trade_total_count = IntField(default = 0) # 用户订单数
    trade_total_amount = IntField(default = 0)  # 用户总金额


    @property
    def simple_data(self):
        data = {}
        data["id"] = self.entity_id
        data["name"] = "无名称" if not self.name else self.name
        data["phone"] = "无手机号" if not self.phone else self.phone

        data["level"] = True
        if not self.level:
            data["level"] = False
        else:
            data["level_name"] = self.level.name
        
        data["regist_source"] = "weixin"
        data["avatar_path"] =  self.avatar_url
        data["created_at"] = self.created_at.isoformat()
        data["trade_total_count"] = self.trade_total_count
        data["trade_total_amount"] = self.trade_total_amount

        data["last_trade_date"] = None
        data["last_trade_no"] = None
        
        return data


    created_ip = StringField(default="")
    
    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)

    last_order_id = IntField(default = 0) 
    last_order_at = DateTimeField(default = datetime.now)

    last_logined_at = DateTimeField(default = datetime.now)

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        e = CustomerES()
        e.shop_id = document.shop.entity_id
        e.entity_id = document.entity_id
        e.name = document.name
        e.account = document.account
        if document.last_order_id:
            e.last_order_at = document.last_order_at
        e.trade_total_count = document.trade_total_count
        e.trade_total_amount = document.trade_total_amount
        e.credit = document.credit
        level = document.level
        if level:
            e.level_id = document.level.entity_id
        e.created_at = document.created_at
        e.save()

signals.post_save.connect(Customer.post_save, sender=Customer)
 
