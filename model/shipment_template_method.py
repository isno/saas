#coding:utf-8
from datetime import datetime

from model.shop import Shop

from mongoengine import *

class ShipmentTemplateMethod(Document):
    meta = {
        "indexes":[
            "shop",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)

    shop = ReferenceField(Shop)

    exclude_areas = StringField(default = "") #不出售地区
    
    type = IntField(default = 0)

    @property
    def express(self):
        if self.type == 0:
            return "快递"
        if self.type == 1:
            return "顺丰"
        if self.type == 2:
            return "EMS"
        if self.type == 3:
            return "平邮"
        if self.type == 4:
            return "商家自送"

    fee = ListField(DictField(), default = [])
    fees = ListField(DictField(), default = [])
    pay_type = IntField(default = 0) # 1 到付， 0 线上支付
    is_actived = BooleanField(default = True)

    is_deleted = BooleanField(default = False)
    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)
