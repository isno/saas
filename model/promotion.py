#coding:utf-8
from datetime import datetime

from mongoengine import *
from mongoengine import signals

from model.shop import Shop
from model.product import Product

from es.promotion import PromotionES


class Promotion(Document):
    meta = {
        "indexes":[
            "shop",
            "discount_type",
            "actived_at",
            "expired_at",
            "is_deleted",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)
    name = StringField(default = "")
    introduce = StringField(default = "")
    discount_type = StringField(default = "amount_off",  choices = ("coupon","free_shipping","amount_off", "percent_off"))

    promotion_offs = ListField(DictField(), default = [])
    range_type =  StringField(default = "partial",  choices = ("entire", "partial"))
    active_type = StringField(default = "partial",  choices = ("partial","entire","first_trade","customer_level"))
    customer_levels = ListField(DictField(), default = [])
    products = ListField(IntField(), default = [])
    customers = ListField(DictField(), default = [])
    active_amount = IntField(default = 0)

    areas = StringField(default = "")
    delivery_type = ListField(IntField(), default = [])
    actived_at = DateTimeField(default = datetime.now)
    expired_at = DateTimeField(default = datetime.now)


    is_deleted = BooleanField(default = False)
    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)

    @property
    def status(self):
        now = datetime.now()
        if self.actived_at >= now:
            return "pending"
        if now >= self.expired_at:
            return "expired"

        return "actived"
    @property
    def simple_data(self):
        
        products = []
        for _var in self.products:
            p = Product.objects.get(entity_id = _var)
            products.append({"id":_var, "name":p.name, "image_path":p.image_path})

        data = {}
        data["id"] = self.entity_id
        data["name"] = self.name
        data["introduce"] = self.introduce
        data["actived_at"] = self.actived_at.isoformat()
        data["expired_at"] = self.expired_at.isoformat()
        data["status"] = self.status
        data["promotion_offs"] = self.promotion_offs
        data["range_type"] = self.range_type
        data["products"] = products
        data["active_type"] = self.active_type
        data["customer_levels"] = self.customer_levels
        data["customers"] = self.customers
        data["delivery_type"] = self.delivery_type
        data["active_amount"] = self.active_amount
        data["areas"] = self.areas
        data["discount_type"] = self.discount_type if self.discount_type else "amount_off"
        data["created_at"] = self.created_at.isoformat()
        return data


    @classmethod
    def post_save(cls, sender, document, **kwargs):
        p = PromotionES()
        p.shop_id = document.shop.entity_id
        p.entity_id = document.entity_id
        p.name = document.name
        p.discount_type = document.discount_type

        p.actived_at = document.actived_at
        p.expired_at = document.expired_at

        p.is_deleted = document.is_deleted
        p.save()
        
signals.post_save.connect(Promotion.post_save, sender=Promotion)

