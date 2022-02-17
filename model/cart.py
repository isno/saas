#coding:utf-8
from datetime import datetime
from mongoengine import *

from model.shop import Shop
from model.customer import Customer
from model.product import Product
from model.product_variant import ProductVariant


class Cart(Document):
    meta = {
        "indexes":[
            "entity_id",
            "token",
            "shop",
            "customer",
        ],
        'ordering': ['-entity_id']
    }

    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    token = StringField(default="")
    customer = ReferenceField(Customer)
    quantity = IntField(default=1)
    product_variant = ReferenceField(ProductVariant)
    is_check = BooleanField(default = False)
    

    updated_at = DateTimeField(default = datetime.now)



    @property
    def simple_data(self):
        options_desc = []
        if self.product_variant.option_1:
            options_desc.append("%s:%s" % (self.product_variant.option_1_name, self.product_variant.option_1))

        if self.product_variant.option_2:
            options_desc.append("%s:%s" % (self.product_variant.option_2_name, self.product_variant.option_2))

        if self.product_variant.option_3:
            options_desc.append("%s:%s" % (self.product_variant.option_3_name, self.product_variant.option_3))

        product = Product.objects.get(entity_id = self.product_variant.product_id)

        data = {
            "shipment_template_id":product.shipment_template.entity_id,
            "variant_id":self.product_variant.entity_id,
            "product_id":product.entity_id,
            "quantity":self.quantity,
            "options_desc":" ".join(options_desc),
            "price":self.product_variant.price,
            "point":self.product_variant.point,
            "weight":self.product_variant.weight,
            "volume":self.product_variant.volume,
            "is_check":self.is_check,
            "name":product.name,
            "line_price":self.product_variant.price*self.quantity,
            "image_url":"%s%s!100x100.jpg" % ("http://iyoudian.shengyi8.com", product.image_path),
            "is_available":True,
            "available_desc":""
        }
        return data

