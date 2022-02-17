#coding:utf-8
from datetime import datetime

from mongoengine import *

from model.shop import Shop
from model.customer import Customer
from model.order_note import OrderNote

'''
用户订单
'''
class Order(Document):
    meta = {
        "indexes":[
            "entity_id",
            "shop",
            "no"
        ],
        'ordering': ['-entity_id']
    }

    entity_id = SequenceField(unique=True)
    no = StringField(default = "")
    shop = ReferenceField(Shop)

    
    payment_status = IntField(default = 0)  #支付状态
    shipment_status = IntField(default = 0) # 物流状态

    item_amount = IntField(default = 0) #商品总价


    is_total_amount = BooleanField(default = False) # 是否改价
    total_amount = IntField(default = 0) #商品总价

    '''
    0 无效
    1 交易成功
    2 交易成功
    3 退单申请
    4 退单完成
    '''
    status = StringField(default = "0_0") 

    @property
    def auto_total_amount(self):
        return item_amount+0

    customer = ReferenceField(Customer)
    address = DictField(default = {})

    notes = ListField(ReferenceField(OrderNote), default = [])

    @property
    def notes_simple_data(self):
        datas = []
        for _note in self.notes:
            datas.append({
                "account":_note.user.simple_data,
                "note":_note.note,
                "created_at":_note.created_at.isoformat()
                })
        return datas
    

    device = StringField(default = "mobile")
    is_star = BooleanField(default = False) 

    timeout_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)
    created_at = DateTimeField(default = datetime.now)
    created_ip = StringField(default = "")


    @property
    def payment_method(self):
        return {
            "id": 1135188,
            "name": "货到付款",
            "pay_type": "offline",
            "desc": "货到付款",
            "gateway": "offline",
            "currency": "CNY",
            "collect_by_yd": False
            }

    @property
    def address_simple_data(self):
        address = self.address

        
        areas = []
        for _area in address.get("areas", []):
            areas.append(_area.get("name", ""))

        address["areas"] =  ",".join(areas)
        address["detail"] = ",".join(areas) + address["detail"]
        return address

    @property
    def consignee_name(self):
        return self.address.get("userName", "")

    @property
    def consignee_mobile(self):
        return self.address.get("telNumber", "")
    
