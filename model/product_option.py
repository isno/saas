#coding:utf-8
from datetime import datetime
from model.shop import Shop
from mongoengine import *

class ProductOption(Document):
    meta = {
        "indexes":[
            "shop",
            "name"
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField()
    default_value = StringField(default = "默认")
    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)