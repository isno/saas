#coding:utf-8
from datetime import datetime

from mongoengine import *

from model.product_image import ProductImage

class ProductVariant(Document):
    meta = {
        "indexes":[
            "product_id",
            "is_deleted",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    product_id = IntField(default = 0)

    option_1 = StringField(default = "")
    option_1_name = StringField(default = "")

    option_2 = StringField(default = "")
    option_2_name = StringField(default = "")
    option_3 = StringField(default = "")
    option_3_name = StringField(default = "")

    price = IntField(default = 0) # 价格 单位分
    stock = IntField(default = 0)
    point = IntField(default = 0)
    weight = IntField(default = 0)
    volume = IntField(default = 0)

    barcode = StringField(default = "")

    is_alarmed = BooleanField(default = False)
    alarm_num = IntField(default = 0)


    email_alarm = BooleanField(default = False) 
    phone_alarm = BooleanField(default = False)
    weixin_alarm = BooleanField(default = False)

    compare_price = IntField(default = 0) # 原价
    stock_type =  StringField(default = "B", choices = ("A","B")) 
    image = ReferenceField(ProductImage)

    is_deleted = BooleanField(default = False) 

    @property
    def options_desc(self):
        options_desc = []
        if self.option_1:
            options_desc.append("%s:%s" % (self.option_1_name, self.option_1))

        if self.option_2:
            options_desc.append("%s:%s" % (self.option_2_name, self.option_2))

        if self.option_3:
            options_desc.append("%s:%s" % (self.option_3_name, self.option_3))

        return " ".join(options_desc)

    
