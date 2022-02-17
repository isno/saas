#coding:utf-8
from mongoengine import *

from model.shop import Shop

'''
订单包裹商品
'''
class OrderShipmentProduct(Document):
    meta = {
        "indexes":[
            "entity_id",
            "shop",
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    product_id = IntField(default=0)
    name = StringField(default="")
    quantity = IntField(default=0)
    price = IntField(default=0)
    variant_id = IntField(default=0)
    options_desc = StringField(default="")
    weight = IntField(default=0)
    volume = IntField(default=0)
    stock = IntField(default=0)
    barcode = StringField(default="")
    image_path = StringField(default="")

    @property
    def simple_data(self):
        data = {}
        data["id"] = self.entity_id
        data["name"] = self.name
        data["quantity"] = self.quantity
        data["price"] = self.price
        data["options_desc"] = self.options_desc
        data["weight"] = self.weight
        data["volume"] = self.volume
        data["stock"] = self.stock
        data["barcode"] = self.barcode
        data["product_id"] = self.product_id
        data["vendor_name"] = None
        data["image_path"] = self.image_path
        
        return data