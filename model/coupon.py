#coding:utf-8
from datetime import datetime
from random import choice
from string import ascii_uppercase as uc, digits as dg

from mongoengine import *

from model.shop import Shop
from model.order import Order
from model.customer import Customer
from model.coupon_group import CouponGroup

class Coupon(Document):
    meta = {
        "indexes":[
            "coupon_group",
            "shop",
            "customer",
            "is_taked",
            "is_used"
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    customer = ReferenceField(Customer)
    coupon_group = ReferenceField(CouponGroup)
    is_used = BooleanField(default = False)
    is_taked = BooleanField(default = False)
    order = ReferenceField(Order)
    code = StringField(default = "")

    def num_convert(self, num):
        b = 32
        return ((num == 0) and "0") or (self.num_convert(num // b).lstrip("0") + "0123456789abcdefghijklmnopqrstuvwxyz"[num % b])


    def generate_code(self):
        base = self.num_convert(self.entity_id)
        num = 5-len(base) if len(base)<5 else 3
        part1 = ''.join(choice(uc) for j in range(num))
        return (base+part1).upper()


