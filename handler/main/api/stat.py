#coding:utf-8
import math
from datetime import datetime,time,date
from util.handler import BaseHandler,authenticated

from model.order import Order

class Summary(BaseHandler):
    @authenticated("")
    def get(self):
        shop = {
            "id":self.shop.entity_id,
            "name":self.shop.name,
            "vip_expired_at":self.shop.vip_expired_at.isoformat(),
            "expired_days":self.shop.expired_days,
            "is_pay_tip":self.shop.is_pay_tiped,
            "vip_type":self.shop.vip_type,
            "vip_type_name":self.shop.vip_type_name
        }

        today_start = datetime.combine(date.today(), time.min)

        params = {}
        params["created_at__gte"] = today_start

        data = {
            "shop":shop,
            "today_order_pending":12,
            "today_amount":32010,
        }
        self.json_message(200, data)

class Order(BaseHandler):
    def get(self):
        data = {
            "need_shipping":1,
            "refunding":0,
            "after_sale":1,
            "pending":1
        }
        self.json_message(200, data)



handlers = [
    (r"/main/api/stat", Summary),
    (r"/main/api/stat/order", Order)
]