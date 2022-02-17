#coding:utf-8
from datetime import datetime
from mongoengine import *

from model.account import Account

'''
管理员登录日志
'''
class LoginErrors(Document):
    meta = {
        "indexes":[
            "account"
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)

    account  = StringField()
    log_type = StringField(required=True, choices = ("login","signup", "forget_password"))
    request_ip =  StringField()
    created_at = DateTimeField(default = datetime.now)

