#coding:utf-8
from datetime import datetime
from hashlib import md5
from mongoengine import *


class ShipmentSupplier(Document):
    meta = {
        "indexes":[
            "entity_id",
        ],
        'ordering': ['entity_id']
    }

    entity_id = SequenceField(unique=True)
    name = StringField(default="")
    code = StringField(default="")


    updated_at = DateTimeField(default = datetime.now)