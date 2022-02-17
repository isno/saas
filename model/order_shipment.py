#coding:utf-8

from datetime import datetime
from mongoengine import *

from model.shop import Shop
from model.order import Order
from model.order_shipment_product import OrderShipmentProduct

'''
订单包裹
'''
class OrderShipment(Document):
    meta = {
        "indexes":[
            "entity_id",
            "shop",
            "order"
        ],
        'ordering': ['entity_id']
    }

    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    order = ReferenceField(Order)

    serial_number = StringField(default="00")
    status = IntField(default=0) #0 未发货、 1 已发货 2 已签收 3 部分发货

    
    ssid = IntField(default=1) # 物流id
    sscode = StringField(default="selfserver") # 物流code
    ssname = StringField(default="无需物流") # 物流名称

    ship_no = StringField(default="") # 物流单号
    ship_type = IntField(default=4)
    

    amount = IntField(default=0)
    supplier = StringField(default="")

    products = ListField(ReferenceField(OrderShipmentProduct), default = [])

    auto_received_at =  DateTimeField(default = datetime.now)

    updated_at = DateTimeField(default = datetime.now)
    created_at = DateTimeField(default = datetime.now)

    @property
    def simple_data(self):
        data = {}
        data["id"] = self.entity_id
        data["serial_number"] = "00"
        data["amount"] = self.amount
        data["status"] = self.status
        data["status_desc"] = ""
        data["ship_no"] = self.ship_no
        data["ship_type"] = self.ship_type
        data["type"] = 1
        data["created_at"] = self.created_at.isoformat()
        data["auto_received_at"] = self.auto_received_at.isoformat()
        data["shipment_at"] = None
        data["receive_at"] = None

        data["ssid"] = self.ssid
        data["ssname"] = self.ssname
        data["sscode"] = self.sscode
        data["line_items"] = []
        data["items"] = []

        for _item in self.products:
            data["items"].append(_item.simple_data)

        return data