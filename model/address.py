#coding:utf-8
from datetime import datetime
from hashlib import md5
from mongoengine import *

from model.customer import Customer
from model.area import Area

class Address(Document):
    meta = {
        "indexes":[
            "entity_id",
            "is_deleted",
            "customer",
        ],
        'ordering': ['-entity_id']
    }

    entity_id = SequenceField(unique=True)
    customer  = ReferenceField(Customer)
   
    name = StringField(default="")


    phone = StringField(default="")
    area = ReferenceField(Area)
    detail = StringField(default="")
    is_default = BooleanField(default = False)

    is_deleted = BooleanField(default = False)

    updated_at = DateTimeField(default = datetime.now)
    created_at = DateTimeField(default = datetime.now)
    
    @property
    def simple_data(self):
        data = {}
        data["name"] = self.name
        data["phone"] = self.phone
        data["detail"] = self.detail
        data["last_area_id"] = self.area.code
        data["area_ids"] = []
        areas = []
        areas.append({"post":"%s" % self.area.code, "name":self.area.name})
        data["area_ids"].append(self.area.code)
        father = self.area.father
        if father:
            areas.append({"post":"%s" % father.code, "name":father.name})
            data["area_ids"].append(father.code)
        father = father.father
        if father:
            areas.append({"post":"%s" % father.code, "name":father.name})
            data["area_ids"].append(father.code)
            
        areas.reverse()
        data["areas"] = areas
        return data




