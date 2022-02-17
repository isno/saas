#coding:utf-8
from datetime import datetime

from mongoengine import *
from mongoengine import signals

from model.shop import Shop
from es.product_type import ProductTypeES

class ProductType(Document):
    meta = {
        "indexes":[
            "shop",
            "is_deleted"
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField()

    is_deleted = BooleanField(default = False)

    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        p = ProductTypeES()
        p.shop_id = document.shop.entity_id
        p.entity_id = document.entity_id
        p.name = document.name
        p.is_deleted = document.is_deleted
        p.save()

signals.post_save.connect(ProductType.post_save, sender=ProductType)




    