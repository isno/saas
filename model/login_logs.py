#coding:utf-8
from datetime import datetime
from mongoengine import *

from model.account import Account

'''
管理员登录日志
'''
class LoginLogs(Document):
    meta = {
        "indexes":[
            "account",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    account  = ReferenceField(Account)

    areas = StringField()
    isp = StringField()
    request_ip =  StringField()
    created_at = DateTimeField(default = datetime.now)

    @property
    def simple_data(self):
        return {
            "id":self.entity_id,
            "areas":self.areas,
            "isp":self.isp,
            "request_ip":self.request_ip,
            "created_at":self.created_at.isoformat()
        }


    