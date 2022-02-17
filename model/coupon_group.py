#coding:utf-8
from datetime import datetime

from mongoengine import *
from mongoengine import signals

from model.shop import Shop
from es.coupon import CouponES


class CouponGroup(Document):
    meta = {
        "indexes":[
            "shop",
            "is_deleted",
            "ctype",
            "available"
        ],
        'ordering': ['entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField(default = "")
    ctype = StringField(default = "normal", choices = ("normal", "single")) # 优惠券类型
    utype = StringField(default = "normal", choices = ("normal", "amount", "percentage")) #优惠券门槛 
    active_amount =  IntField(default = 0) # 优惠券门槛金额

    atype = StringField(default = "normal", choices = ("normal", "single")) # 优惠券领取规则

    prefix = StringField(default = "") # 优惠券前缀
    quantity_provided = IntField(default = 0) # 优惠券数量
    discount_amount = IntField(default = 0) # 现金抵扣
    discount_percentage = IntField(default = 0) # 打折抵扣
    exported = BooleanField(default = False) # 是否开放领取

    available = BooleanField(default = True)

    is_deleted = BooleanField(default = False)

    export_text = StringField(default = "") # 领取说明
    export_color = StringField(default = "")  # 领取背景颜色

    actived_at = DateTimeField(default = datetime.now)
    expired_at = DateTimeField(default = datetime.now)

    @property
    def status(self):
        now = datetime.now()
        if self.actived_at >= now:
            return "unactived"
        if now >= self.expired_at:
            return "expired"

        return "actived"
        
    created_at = DateTimeField(default = datetime.now)

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        p = CouponES()
        p.shop_id = document.shop.entity_id
        p.entity_id = document.entity_id
        p.name = document.name
        p.ctype = document.ctype

        p.actived_at = document.actived_at
        p.expired_at = document.expired_at

        p.is_deleted = document.is_deleted
        p.save()


signals.post_save.connect(CouponGroup.post_save, sender=CouponGroup)

