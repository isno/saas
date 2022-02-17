#coding:utf-8

from mongoengine import *

from model.shop import Shop
from model.account import Account

'''
账户关联商城
'''
class AccountToShop(Document):
    meta = {
        "indexes":[
            "account",
            "shop",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)

    shop = ReferenceField(Shop)
    account = ReferenceField(Account)
    modules =  ListField(StringField(default = ""))
    account_type =IntField(default = 1) # 0 创建者、2 管理者
    last_login_at = DateTimeField(default = None)
    is_actived = BooleanField(default = False)
    remark = StringField(default = "")

