#coding:utf-8
import math
from tornado.escape import json_decode

from util.handler import BaseHandler,authenticated
from model.product_type import ProductType
from model.product import Product

from es.product_type import ProductTypeES

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        page = self.get_argument("page", "1")
        page = int(page)
        size = self.get_argument("size", "30")
        size = int(size)

        page = max(1, page)
        page_start = (page-1)*size

        search  = self.get_argument("search", "")
        is_used = self.get_argument("used", "")
        tid = self.get_argument("tid", "")

        s = ProductTypeES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)

        if search:
            s = s.query("match", name=search)
        if is_used:
            s = s.query("term", is_used = True if is_used == "true" else False)
        if tid:
            pass

        s = s[page_start:page_start+size]

        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))


        res = ProductType.objects(entity_id__in = ids)
        
        types = []
        for _var in res:
            used = Product.objects(types__contains = _var).count()
            _type = {
                "id":_var.entity_id,
                "name":_var.name,
                "used":used
            }
            types.append(_type)
        
        page_count = int(math.ceil(float(count)/size))
        data = {
            "page":page_count,
            "item_count":count,
            "is_empty":True if not types  else False,
            "types":types
        }
        self.json_message(200, data)

class Create(BaseHandler):
    @authenticated("m_product")
    def post(self):
        name = self.get_argument("name", "")
        if not name:
            return self.json_message(201, {}, "请填写分类名称")

        count = ProductType.objects(shop = self.shop, name = name, is_deleted = False).first()
        if count>0:
            return self.json_message(201, {}, "商品分类已经存在")

        product_type = ProductType()
        product_type.name = name
        product_type.shop = self.shop
        product_type.save()

        self.json_message(200, {"id":product_type.entity_id})

'''
商品批量创建
'''
class MultiCreate(BaseHandler):
    @authenticated("m_product")
    def post(self):
        names = self.get_argument("names")
        names = json_decode(names)

        types = []
        for _name in names:
            count = ProductType.objects(shop = self.shop, name = _name, is_deleted = False).count()
            if count>0:
                continue
            if not _name:
                continue

            product_type = ProductType()
            product_type.name = _name
            product_type.shop = self.shop
            product_type.save()

            _type = {
                "id":product_type.entity_id,
                "name":product_type.name,
                "used":0
            }
            types.append(_type)

        self.json_message(200, {"types":types})

class MultiRemove(BaseHandler):
    @authenticated("m_product")
    def post(self):
        ids = self.get_argument("ids")
        for _id in ids.split(","):
            _data = ProductType.objects(shop = self.shop, entity_id = int(_id)).first()
            if not _data:
                continue
            _data.is_deleted=True
            _data.save()

        self.json_message(200)

class Remove(BaseHandler):
    @authenticated("m_product")
    def post(self):
        id = self.get_argument("id")
        data = ProductType.objects(shop = self.shop, entity_id = int(id)).first()
        if not data:
            return self.json_message(201, {}, "数据错误")

        data.is_deleted = True
        data.save()

        self.json_message(200)


class Save(BaseHandler):
    @authenticated("m_product")
    def post(self):
        id = self.get_argument("id")
        name = self.get_argument("name", "")

        product_type = ProductType.objects(shop = self.shop, entity_id = int(id), is_deleted = False).first()
        if not product_type:
            return self.json_message(201)
        if product_type:
            if product_type.entity_id != int(id):
                return self.json_message(201, {"message":"分类名称已经存在"})

        product_type.name = name
        product_type.save()

        self.json_message(200, {"id":product_type.entity_id})

class CheckExist(BaseHandler):
    def get(self):
        name = self.get_argument("name", "")

        self.json_message(200, {"exist":False})
        pass

handlers = [
    (r"/main/api/type/get_all", GetAll),
    (r"/main/api/type/create", Create),
    (r"/main/api/type/multi_create", MultiCreate),
    (r"/main/api/type/multi_remove", MultiRemove),
    (r"/main/api/type/remove", Remove),
    (r"/main/api/type/save", Save),
    (r"/main/api/type/check_exist", CheckExist)
]