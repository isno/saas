#coding:utf-8
from datetime import datetime
from mongoengine import *

class CustomerEnter(Document):
    meta = {
        "strict":False,
        "indexes":[
             "status_id",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    name = StringField(default="")
    phone = StringField(default="")
    brand = StringField(default="") # 品牌名称
    code = StringField(default="") # 营销码

    status_id = IntField(default = 0) # 0, 1, 2
    category_id = IntField(default = 0)
    shop_type = IntField(default = 0)

    modules = ListField(StringField(default = ""))
    expired_days = IntField(default = 7)

    remark = StringField(default = "")

    location = StringField(default = "")

    created_ip = StringField(default = "")
    created_at = DateTimeField(default = datetime.now)