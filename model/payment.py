#coding:utf-8
from datetime import datetime
from hashlib import md5
from model.shop import Shop
from mongoengine import *
from model.payment_template import PaymentTemplate

class Payment(Document):
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    template = ReferenceField(PaymentTemplate)
    pass_test = BooleanField(default = False)
    is_config = BooleanField(default = False)
    is_actived = BooleanField(default = False)
    setting_values = StringField(default="")