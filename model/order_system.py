#coding:utf-8
from datetime import datetime
from hashlib import md5
from mongoengine import *


class OrderSystem(Document):
    meta = {
        "indexes":[
            "entity_id"
        ],
        'ordering': ['entity_id']
    }

    entity_id = SequenceField(unique=True)
    pay_type = StringField(default="weipay")

    status_id = IntField(default=0)
    
    total_fee = IntField(default=0)
    

    body = StringField(default="")


    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)