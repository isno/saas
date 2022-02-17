#coding:utf-8
import math
from tornado.escape import json_decode
from util.handler import BaseHandler,authenticated

from model.product import Product
from model.product_vendor import ProductVendor

from es.product_vendor import ProductVendorES

class GetAll(BaseHandler):
    @authenticated("m_product")
    def get(self):
        page = self.get_argument("page", "1")
        page = max(1, int(page))
        size = self.get_argument("size", "30")
        size = int(size)

        page_start = (page-1)*size

        search  = self.get_argument("search", "")
        is_used = self.get_argument("used", "")

        s = ProductVendorES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)

        if search:
            s = s.query("match", name=search)
        if is_used:
            s = s.query("term", is_used = True if is_used == "true" else False)


        s = s[page_start:page_start+size]

        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))


        res = ProductVendor.objects(entity_id__in = ids)
        
        vendors = []
        for _res in res:
            vendor = {
                "id":_res.entity_id,
                "name":_res.name,
                "image_path":_res.image_path,
                "used":0
            }
            vendors.append(vendor)

        page_count = int(math.ceil(float(count)/size))
        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":False if vendors else True,
            "vendors":vendors
        }
        self.json_message(200, data)


class Update(BaseHandler):
    @authenticated("m_product")
    def post(self):
        id = self.get_argument("id", 0)

        name = self.get_argument("name", "")
        sub_name = self.get_argument("sub_name", "")
        introduce = self.get_argument("introduce", "")
  
        image_path = self.get_argument("image_path", "")


        res = ProductVendor.objects(shop = self.shop, name = name).first()
        if res:
            if res.entity_id != int(id):
                return self.json_message(201, {"message":"分类名称已经存在"})
                

        vendor = ProductVendor.objects.get(entity_id = id, shop = self.shop)
        vendor.name = name
        vendor.sub_name = sub_name
        vendor.introduce = introduce
        vendor.image_path = image_path
       

        vendor.save()
        self.json_message(200)


class View(BaseHandler):
    @authenticated("")
    def get(self):
        id = self.get_argument("id", 0)
        vendor = ProductVendor.objects.get(entity_id = int(id), shop = self.shop)

        data = {
            "id":vendor.entity_id,
            "name":vendor.name,
            "sub_name":vendor.sub_name,
            "introduce":vendor.introduce,
            "image_path":vendor.image_path
        }
            

        self.json_message(200, {"vendor":data})



class MultiCreate(BaseHandler):
    @authenticated("m_product")
    def post(self):
        names = self.get_argument("names")
        names = json_decode(names)

        vendors = []
        for _name in names:
            res = ProductVendor.objects(shop = self.shop, name = _name).count()
            if res:
                continue

            vendor = ProductVendor()
            vendor.name = _name
            vendor.shop = self.shop
         
            vendor.save()

            vendors.append({
                    "id":vendor.entity_id,
                    "name":vendor.name
                })

            self.shop.update(inc__vendor_handle_id=1)

        self.json_message(200, {"vendors":vendors})


'''
预创建
'''
class Create(BaseHandler):
    @authenticated("m_product")
    def post(self):
        name = self.get_argument("name", "")
        
        res = ProductVendor.objects(shop = self.shop, name = name).count()
        if res:
            return self.json_message(201, {"message":"品牌名称已经存在"})

        vendor = ProductVendor()
        vendor.name = name
        vendor.shop = self.shop
        vendor.save()

        self.json_message(200, {"id":vendor.entity_id})



class FullCreate(BaseHandler):
    @authenticated("m_product")
    def post(self):
        name = self.get_argument("name", "")
        sub_name = self.get_argument("sub_name", "")
        introduce = self.get_argument("introduce", "")
        image_path = self.get_argument("image_path", "")


        # 判断是否已经创建频道

        res = ProductVendor.objects(shop = self.shop, name = name).count()
        if res:
            return self.json_message(201, {"message":"品牌名称已经存在"})


        vendor = ProductVendor()
        vendor.shop = self.shop
        vendor.name = name
        vendor.sub_name = sub_name
        vendor.introduce = introduce
        vendor.image_path = image_path


        vendor.save()

        self.json_message(200,{"vendor":{"v":""}})


class Remove(BaseHandler):
    @authenticated("m_product")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)
        vendor = ProductVendor.objects(entity_id = id, shop = self.shop)
        vendor.is_deleted = True
        vendor.save()

        self.json_message(200)


class GetAllPanel(BaseHandler):
    @authenticated("m_product")
    def post(self):
        products = self.get_argument("products")
        product_ids = []
        for _product in json_decode(products):
            product_ids.append(_product.get("id"))


        vendors = []
        count = ProductVendor.objects(shop = self.shop).count()
        res = ProductVendor.objects(shop = self.shop)
        for _type in res:
            _count = Product.objects(vendor = _type).count()
            selected = 0
            images = []
            for _product in Product.objects(vendor = _type).limit(10):
                images.append(_product.image_path)
                if _product.entity_id in product_ids:
                    selected+=1

            data = {
                "id":_type.entity_id,
                "name":_type.name,
                "sort_num":0,
                "page_url":_type.page_url,
                "feature_images":",".join(images) if images else "",
                "selected":selected,
                "total":_count
            }
            vendors.append(data)

        data = {
            "page_count":1,
            "item_count":count,
            "vendors":vendors
        }
        self.json_message(200, data)

class GetAllExclude(BaseHandler):
    @authenticated("m_product")
    def post(self):
        vid = self.get_argument("vid",0)

        products =[]

        product_vendor = ProductVendor.objects.get(shop = self.shop, entity_id = int(vid))
        res = Product.objects(vendor = product_vendor)
        for _var in res:
            products.append(_var.simple_data)

        self.json_message(200, {"products":products})

class GetAllInclude(BaseHandler):
    @authenticated("m_product")
    def post(self):
        vid = self.get_argument("vid",0)
        product_ids = self.get_argument("products")
        product_ids = json_decode(product_ids)
        products = []

        product_vendor = ProductVendor.objects.get(shop = self.shop, entity_id = int(vid))

        for _id in product_ids:
            res = Product.objects.get(vendor = product_vendor, entity_id = int(_id.get("id")))
            products.append(res.simple_data)

        self.json_message(200, {"products":products})

handlers = [
    (r"/main/api/vendor/get_all", GetAll),
    (r"/main/api/vendor/get_all_panel", GetAllPanel),
    (r"/main/api/vendor/get_all_exclude", GetAllExclude),
    (r"/main/api/vendor/get_all_include", GetAllInclude),
    (r"/main/api/vendor/update", Update),
    (r"/main/api/vendor/get_single", View),
    (r"/main/api/vendor/full_create", FullCreate),
    (r"/main/api/vendor/multi_create", MultiCreate),
    (r"/main/api/vendor/remove", Remove),
    (r"/main/api/vendor/create", Create)
]