#coding:utf-8
from datetime import datetime

from model.shop import Shop
from mongoengine import *

class CustomerLevelCredit(Document):
    meta = {
        "indexes":[
            "shop",
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    credit_exchange_ratio = IntField(default = 200)
    credit_enabled = BooleanField(default = True)

