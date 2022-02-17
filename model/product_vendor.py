#coding:utf-8
from datetime import datetime

from mongoengine import *
from mongoengine import signals

from model.shop import Shop

from es.product_vendor import ProductVendorES

class ProductVendor(Document):
    meta = {
        "indexes":[
            "shop"
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField(default = "")
    image_path = StringField(default = "/image/2018/8/c1efe3f4acd68ff95cceeca89c843b6f.png")
    

    is_deleted = BooleanField(default = False)

    sub_name = StringField(default = "") # 品牌描述
    introduce = StringField(default = "") # 品牌介绍


    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        p = ProductVendorES()
        p.shop_id = document.shop.entity_id
        p.entity_id = document.entity_id
        p.name = document.name
        p.is_deleted = document.is_deleted
        p.save()

signals.post_save.connect(ProductVendor.post_save, sender=ProductVendor)