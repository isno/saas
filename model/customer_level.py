#coding:utf-8
from datetime import datetime

from model.shop import Shop
from mongoengine import *

class CustomerLevel(Document):
    meta = {
        "indexes":[
            "shop",
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField(default="")
    credits = IntField(default = 0)
    image_path = StringField(default= "/image/2020/1/8ecc4e7662e21ab96419c8ec3d81b6d3.png")

    
    discount = IntField(default = 100)
    deletable =  BooleanField(default = True) # 默认等级不允许删除
    created_at = DateTimeField(default = datetime.now)