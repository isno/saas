#coding:utf-8
from datetime import datetime
from mongoengine import *

from model.shop import Shop

class SMSLog(Document):
    meta = {
        "indexes":[
            "phone",
            "created_at",
        ],
        'ordering': ['created_at']
    }

    _id = SequenceField()
    phone = StringField(required=True)
    code = StringField()
    shop = ReferenceField(Shop)
    created_ip = StringField()
    send_type = StringField(required=True, choices = ("entry","signup","forget_password", "change_owner"))
    created_at = DateTimeField(default = datetime.now)