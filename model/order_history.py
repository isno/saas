#coding:utf-8
from datetime import datetime
from hashlib import md5
from mongoengine import *
from model.account import Account

class OrderHistory(Document):
    meta = {
        "indexes":[
            "entity_id"
        ],
        'ordering': ['-entity_id']
    }

    entity_id = SequenceField(unique=True)
    user  = ReferenceField(Account)
    note = StringField(default="")
    

    created_at = DateTimeField(default = datetime.now)
