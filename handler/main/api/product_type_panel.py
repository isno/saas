#coding:utf-8
import math
from tornado.escape import json_decode
from util.handler import BaseHandler,authenticated

from es.product_type import ProductTypeES

from model.product import Product
from model.product_type import ProductType


class GetAllPanel(BaseHandler):
    @authenticated("")
    def post(self):

        page = self.get_argument("page", "1")
        page = int(page)
        size = self.get_argument("size", "30")
        size = int(size)

        page = max(1, page)
        page_start = (page-1)*size

        search = self.get_argument("search", "")
        
        products = self.get_argument("products")
        product_ids = []
        for _product in json_decode(products):
            product_ids.append(_product.get("id"))

        s = ProductTypeES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)

        if search:
            s = s.query("match", name=search)

        s = s[page_start:page_start+size]

        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))

        res = ProductType.objects(entity_id__in = ids)
        types = []
        for _type in res:
            _count = Product.objects(types__contains = _type, is_deleted = False).count()
            selected = 0

            images = []
            for _product in Product.objects(types__contains = _type).limit(10):
                images.append(_product.image_path)
                if _product.entity_id in product_ids:
                    selected+=1
            data = {
                "id":_type.entity_id,
                "name":_type.name,
                "sort_num":0,
                "feature_images":",".join(images) if images else "",
                "selected":selected,
                "total":_count
            }
            types.append(data)

        page_count = int(math.ceil(float(count)/size))
        data = {
            "page_count":page_count,
            "item_count":count,
            "types":types
        }
        self.json_message(200, data)

class GetAllInclude(BaseHandler):
    @authenticated("")
    def post(self):
        tid = self.get_argument("tid",0)
        product_ids = self.get_argument("products")
        product_ids = json_decode(product_ids)
        products = []

        product_type = ProductType.objects.get(shop = self.shop, entity_id = int(tid), is_deleted = False)

        for _id in product_ids:
            _product = Product.objects(types__contains = product_type, \
                entity_id = int(_id.get("id")), is_deleted = False).first()
            if not _product:
                continue
            products.append(_product.simple_data)

        self.json_message(200, {"products":products})


class GetAllExclude(BaseHandler):
    @authenticated("m_product")
    def post(self):
        tid = self.get_argument("tid",0)

        products =[]

        product_type = ProductType.objects(shop = self.shop, entity_id = int(tid)).first()
        res = Product.objects(types__contains = product_type)
        for _var in res:
            products.append(_var.simple_data)

        self.json_message(200, {"products":products})


handlers = [
    (r"/main/api/type/get_all_panel", GetAllPanel),
    (r"/main/api/type/get_all_include", GetAllInclude),
    (r"/main/api/type/get_all_exclude", GetAllExclude)
]