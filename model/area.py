#coding:utf-8
from datetime import datetime
from hashlib import md5
from mongoengine import *


class Area(Document):
    meta = {
        "indexes":[
            "entity_id",
            "code",
            "father"
        ],
        'ordering': ['entity_id']
    }

    entity_id = SequenceField(unique=True)
   
    father = ReferenceField('self')

    name = StringField(default="")
    code = IntField(default=0)
    level = IntField(default=0)

    updated_at = DateTimeField(default = datetime.now)