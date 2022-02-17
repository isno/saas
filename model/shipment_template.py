#coding:utf-8
from datetime import datetime

from model.shop import Shop

from mongoengine import *
from model.shipment_template_method import ShipmentTemplateMethod

class ShipmentTemplate(Document):
    meta = {
        "indexes":[
            "shop",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)

    shop = ReferenceField(Shop)
    name = StringField(default = "")
    shipment_area_post = StringField(default = "0")
    calculate_type = IntField(default = 0) # 计费方式 0 重量,1 体积 ,2 数量
    rules = ListField(ReferenceField(ShipmentTemplateMethod), default = [])
    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)

    
'''
    @classmethod
    def post_new(cls, *args, **kwargs):
        print "new"

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        print "save"

def update_search(sender, document):
    print "ok"

signals.post_save.connect(update_search)
'''