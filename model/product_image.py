#coding:utf-8
from datetime import datetime

from mongoengine import *

from model.shop import Shop

class ProductImage(Document):
    meta = {
        "indexes":[
            "entity_id",
            "product_id",
            "shop",
        ],
        'ordering': ['entity_id','sort_num']
    }
    entity_id = SequenceField(unique=True)
    sort_num = IntField(default = 0)
    product_id = IntField(default = 0)
    shop = ReferenceField(Shop)
    image_path = StringField(default = "")
    image_name = StringField(default = "")
    is_cover = BooleanField(default = False) 
    alt = StringField(default = "")

    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)