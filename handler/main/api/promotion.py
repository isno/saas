#coding:utf-8
import math
from datetime import datetime
from util.handler import BaseHandler,authenticated

from tornado.escape import json_decode

from model.promotion import Promotion
from es.promotion import PromotionES

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):

        size = self.get_argument("size", 30)
        size = int(size)
        page = self.get_argument("page", 1)
        page = max(1, int(page))
        page_start = (page-1)*size

        status = self.get_argument("status", "")
        search = self.get_argument("search", "")
        discount_type = self.get_argument("discount_type", "")
        
        active_earlier = self.get_argument("active_earlier", "")
        active_later = self.get_argument("active_later", "")

        s = PromotionES.search().sort({"entity_id" : {"order" : "desc"}})
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)

        if discount_type:
            s = s.query("term", discount_type = discount_type)
        if search:
            s = s.query("match", name = search)

        if status:
            if status == "expired": # 过期
                s = s.filter("range", expired_at={"lt":self.now})
            if status == "actived":
                s = s.filter("range", expired_at={"gte":self.now})
                s = s.filter("range", actived_at={"lte":self.now})
            if status == "pending":
                s = s.filter("range", actived_at={"gte":self.now})
                s = s.filter("range", expired_at={"gte":self.now})

        if active_earlier and active_earlier != "0":
            active_earlier = datetime.strptime(active_earlier,'%Y-%m-%dT%H:%M:%S.%f+08:00')
            s = s.filter("range", actived_at={"gte":active_earlier})
        if active_later and active_later != "0":
            active_later = datetime.strptime(active_later,'%Y-%m-%dT%H:%M:%S.%f+08:00')
            s = s.filter("range", expired_at={"lte":active_later})

        s = s[page_start:page_start+size]
        count = s.count()
        resp = s.execute()
  
        
        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))

        promotions = []
        res = Promotion.objects(entity_id__in = ids)
        for _var in res:
            promotions.append(_var.simple_data)

        page_count = int(math.ceil(float(count)/size))

        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":True if not count else False,
            "promotions":promotions
        }
        self.json_message(200, data, "ok")

class PreCreate(BaseHandler):
    @authenticated("m_promotion")
    def post(self):
        
        promotion = Promotion()
        data = {
            "id":promotion.entity_id,
            "stores":[],
            "delivery_type":[],
            "products":[],
            "customers":[],
        }
        self.json_message(200, {"promotion":data}, "ok")

class GetSingle(BaseHandler):
    @authenticated("")
    def get(self):
        id = self.get_argument("id", 0)
        pro = Promotion.objects.get(entity_id = int(id), shop = self.shop)
       
    
        self.json_message(200, {"promotion":pro.simple_data}, "ok")

class Save(BaseHandler):
    @authenticated("m_promotion")
    def post(self):
        entity_id = self.get_argument("id",0)
        name = self.get_argument("name", "")
        introduce = self.get_argument("introduce", "")
        actived_at = self.get_argument("actived_at", "")
        expired_at = self.get_argument("expired_at", "")
        range_type = self.get_argument("range_type", "")
        active_type = self.get_argument("active_type", "")
        discount_type = self.get_argument("discount_type", "")
        promotion_offs = self.get_argument("promotion_offs", "[]")
        products = self.get_argument("products","[]")
        active_amount = self.get_argument("active_amount", 0)
        active_amount = int(active_amount)
        areas = self.get_argument("areas", "")
        delivery_type = self.get_argument("delivery_type", "[]")

        customer_levels = self.get_argument("customer_levels","[]")
        customers = self.get_argument("customers","[]")
        entity_id = int(entity_id)

        pro = Promotion.objects(entity_id = entity_id).first()
        if pro and pro.shop != self.shop:
            return json_message(201)

        if not pro:
            pro = Promotion()
            pro.entity_id = entity_id
            pro.shop = self.shop
        

        product_ids = []
        for _id in json_decode(products):
            product_ids.append(_id.get("id"))


        pro.name = name
        pro.introduce = introduce
        pro.actived_at = self.utc_datetime(actived_at)
        pro.expired_at = self.utc_datetime(expired_at)
        pro.promotion_offs = json_decode(promotion_offs)
        pro.range_type = range_type
        pro.products = product_ids
        pro.active_type = active_type
        pro.customer_levels = json_decode(customer_levels)
        pro.customers = json_decode(customers)
        pro.discount_type = discount_type
        pro.active_amount = active_amount
        pro.delivery_type = json_decode(delivery_type)
        pro.areas = areas

        pro.save()

        self.json_message(200, {"id":pro.entity_id})


class Avail(BaseHandler):
    @authenticated("m_promotion")
    def post(self):
        id = self.get_argument("id", "")
        range_type = self.get_argument("range_type", "")
        products = self.get_argument("products")

        self.json_message(200, {"avail":1})


class Remove(BaseHandler):
    @authenticated("m_promotion")
    def post(self):
        id = self.get_argument("id", "")
        Promotion.objects(entity_id = int(id), shop = self.shop).update(set__is_deleted = True)
        self.json_message(200)

handlers = [
    (r"/main/api/promotion/save", Save),
    (r"/main/api/promotion/remove", Remove),
    (r"/main/api/promotion/get_single", GetSingle),
    (r"/main/api/promotion/avail", Avail),
    (r"/main/api/promotion/get_all", GetAll),
    (r"/main/api/promotion/pre_create", PreCreate)
]