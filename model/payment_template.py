#coding:utf-8
from datetime import datetime
from hashlib import md5
from mongoengine import *


class PaymentTemplate(Document):
    entity_id = SequenceField(unique=True)
    name = StringField(default="")
    pay_type = StringField(default="")
    is_config = BooleanField(default = False)
    collect_by_youdian = BooleanField(default = False)
    fee_ratio =StringField(default="")
    auto_refund = BooleanField(default = True)
    currency = ListField(StringField(default=""))
    browser_scene = ListField(StringField(default=""))
    setting_keys = StringField(default="")
    setting_chs_keys = StringField(default="")
    setting_values = StringField(default="")

    settlement_description = StringField(default="")
    details = StringField(default="")
    client_side_transaction_flow = StringField(default="")

    settings = DictField()
