#coding:utf-8
import math

from tornado.escape import json_decode
from model.area import Area
from model.store import Store

from util.handler import BaseHandler,authenticated

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        page = self.get_argument("page", "1")
        page = int(page)

        size = 10
        page = max(1, page)
        page_start = (page-1)*size

        count = Store.objects(shop = self.shop, is_deleted = False).count()
        res = Store.objects(shop = self.shop, is_deleted = False).skip(page_start).limit(size)

        stores = []
        for _store in res:
            stores.append(_store.simple_data)

        
        page_count = int(math.ceil(float(count)/size))

        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":True if count == 0 else False,
            "stores":stores,
        }
        self.json_message(200, data)


class Get(BaseHandler):
    def get(self):
        id = self.get_argument("id", 0)
        store = Store.objects(shop = self.shop, entity_id = int(id)).first()

        self.json_message(200, {"store":store.simple_data})

class Create(BaseHandler):
    def post(self):

        id = self.get_argument("id", "")

        name = self.get_argument("name", "")
        image_path = self.get_argument("image_path", "")

        phone = self.get_argument("phone", "")
        address = self.get_argument("address", "")

        traffic_guide = self.get_argument("traffic_guide", "")
        start_at = self.get_argument("start_at", "09:00")
        end_at = self.get_argument("end_at", "21:00")
        is_avalible = self.get_argument("is_avalible", "true")

        area_code = self.get_argument("area_code", "")

        if not area_code:
            return self.json_message(201, {}, "请选择省市地址")

        if not address:
            return self.json_message(201, {}, "请填写分店地址")

        if id == "new":
            model = Store()
            model.shop = self.shop
        else:
            model = Store.objects(shop = self.shop, entity_id = int(id)).first()


        model.name = name
        model.image_path = image_path
        model.phone = phone
        if area_code:
            model.area = Area.objects.get(code = area_code)

        model.address = address
        model.traffic_guide = traffic_guide
        model.star_at = start_at
        model.end_at = end_at
        model.is_avalible = True if is_avalible=="true" else False
        model.save()

        self.json_message(200, {"id":model.entity_id})


class Remove(BaseHandler):
    def post(self):
        id = self.get_argument("id", 0)
        model = Store.objects(shop = self.shop, entity_id = int(id)).first()
        model.is_deleted = True
        model.save()

        self.json_message(200)

handlers = [
    (r"/main/api/store/create", Create),
    (r"/main/api/store/save", Create),
    (r"/main/api/store/remove", Remove),
    (r"/main/api/store/get", Get),
    (r"/main/api/store/get_all", GetAll)
]