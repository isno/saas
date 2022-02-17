#coding:utf-8
from datetime import datetime
from mongoengine import *

from model.area import Area
from model.shop import Shop

class Store(Document):
    meta = {
        "indexes":[
            "shop",
            "geo_point"
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField(default="")  # 分店名称
    area = ReferenceField(Area)
    address = StringField(default="") # 地址
    traffic_guide = StringField(default="") # 交通指引
    phone = StringField(default="") # 联系电话
    geo_point = GeoPointField()
    image_path = StringField(default="")

    star_at = StringField(default="09:00")
    end_at = StringField(default="21:00")

    @property
    def is_closed():
        now = datetime.now().strftime("%H%M")
        now = int(now)
        time1 = int(star_at.replace(":",""))
        time2 = int(end_at.replace(":",""))
        if now>time1 and now<time2:
            return False
        return True

    @property
    def simple_data(self):
        area_code = ""
        if self.area:
            area_code = self.area.code
            
        return {
            "name":self.name,
            "area_code":area_code,
            "id":self.entity_id,
            "image_path":self.image_path,
            "address":self.address,
            "phone":self.phone,
            "traffic_guide":self.traffic_guide,
            "start_at":self.star_at,
            "end_at":self.end_at,
            "created_at":self.created_at.isoformat(),
            "is_closed":self.is_deleted,
            "is_avalible":"true" if self.is_avalible else "false"
        }

    is_avalible = BooleanField(default = True)
    is_deleted = BooleanField(default = False)
    

    created_at = DateTimeField(default = datetime.now)