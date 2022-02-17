#coding:utf-8
import math
from tornado.escape import json_decode
from util.handler import BaseHandler,authenticated

from model.shipment_template import ShipmentTemplate
from model.shipment_template_method import ShipmentTemplateMethod
from model.product import Product

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        search = self.get_argument("search", "")
        size = self.get_argument("size", 30)
        size = int(size)
        page = self.get_argument("page", 1)
        page = max(1, int(page))

        page_start = (page-1)*size

        excid = self.get_argument("excid", 0)

        params = {}
        params["shop"] = self.shop
        if excid:
            params["entity_id__ne"] = excid

        items = []
        count = ShipmentTemplate.objects(**params).count()
        res = ShipmentTemplate.objects(**params).skip(page_start).limit(size)
        for _var in res:
            _item = {
                "id":_var.entity_id,
                "name":_var.name,
                "shipment_area_post":_var.shipment_area_post,
                "calculate_type":_var.calculate_type
            }
            items.append(_item)

        page_count = int(math.ceil(float(count)/size))
        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":True if not count else False,
            "shipment_templates":items
        }
        self.json_message(200, data)


'''
预先创建运送模板
'''
class PreCreate(BaseHandler):
    @authenticated("m_shipment")
    def post(self):
        shipment = ShipmentTemplate()
        data = {
            "id":shipment.entity_id,
            "name":"",
            "shipment_area":None,
            "calculate_type":0,
            "rules":[]
        }
        self.json_message(200, {"shipment_template":data})


'''
创建运费模板
'''
class Save(BaseHandler):
    @authenticated("m_shipment")
    def post(self):
        entity_id = self.get_argument("id", 0 )
        entity_id = int(entity_id)

        shipment_area_post = self.get_argument("shipment_area_post", "0")
        name = self.get_argument("name", "")
        calculate_type = self.get_argument("calculate_type", 0)
        rules = self.get_argument("rules", "[]")
    
        shipment = ShipmentTemplate.objects(shop = self.shop, entity_id = entity_id).first()
        if not shipment:
            shipment = ShipmentTemplate()
        else:
            for _ship in shipment.rules:
                _ship.delete()


        methods = []
        rules = json_decode(rules)
        for _var in rules:
            method = ShipmentTemplateMethod()
            method.shop = self.shop
            method.exclude_areas = _var.get("exclude_areas", "")
            method.type = _var.get("type", 0)

     
            method.fees = _var.get("fees", [])
            method.pay_type = _var.get("pay_type", 0)

            feeds = []
            for _feed in _var.get("fee",[]):
                if not _var.has_key("include_areas"):
                    _var["include_areas"] = ""
                feeds.append(_feed)

            method.fee = feeds

            method.save()
            methods.append(method)
                

        shipment.entity_id = entity_id
        shipment.shop = self.shop
        shipment.shipment_area_post = shipment_area_post
        shipment.name = name
        shipment.calculate_type = int(calculate_type)
        shipment.rules = methods
        shipment.save()

        self.json_message(200)

class GetSingle(BaseHandler):
    @authenticated("")
    def get(self):
        entity_id = self.get_argument("id", 0)
        entity_id = int(entity_id)

        shipment = ShipmentTemplate.objects(entity_id = entity_id, shop = self.shop).first()
        if not shipment:
            return self.json_message(201)

        data = {
            "id":shipment.entity_id,
            "name":shipment.name,
            "shipment_area":{},
            "shipment_area_post":shipment.shipment_area_post,
            "calculate_type":shipment.calculate_type,
            "rules":[]
        }
        rules = []
        for _var in shipment.rules:
            rules.append({
                "id":_var.entity_id,
                "exclude_areas":_var.exclude_areas,
                "type":_var.type,
                "fee":_var.fee,
                "fees":_var.fees,
                "pay_type":_var.pay_type,
                "is_actived":_var.is_actived
                })

        data["rules"] = rules

        self.json_message(200, {"shipment_template":data})

'''
模板付费
'''
class Duplicate(BaseHandler):
    @authenticated("m_shipment")
    def post(self):
        entity_id = self.get_argument("id", 0)
        entity_id = int(entity_id)

        name = self.get_argument("name", "")
        shipment = ShipmentTemplate.objects(entity_id = int(id), shop = self.shop).first()
        if not shipment:
            return self.json_message(201)

        new_shipment = ShipmentTemplate()
        new_shipment.shop = self.shop
        new_shipment.shipment_area_post = shipment.shipment_area_post
        new_shipment.name = name
        new_shipment.calculate_type = shipment.calculate_type
        new_shipment.rules = shipment.rules
        new_shipment.save()

        self.json_message(200,{"shipment_template":new_shipment.entity_id})

'''
检测模板是否有用
'''
class CheckUnused(BaseHandler):
    @authenticated("")
    def get(self):
        id = self.get_argument("id", 0)
        entity_id = int(id)
        shipment = ShipmentTemplate.objects(entity_id = entity_id, shop = self.shop).first()
        if not shipment:
            return self.json_message(201)

        count = Product.objects(shop = self.shop, shipment_template = shipment).count()
        
        self.json_message(200, {"unused":False if count>0 else True})


'''
模板删除
'''
class Remove(BaseHandler):
    @authenticated("m_shipment")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)
        replace_id = self.get_argument("replace_id", 0)
        replace_id = int(replace_id)

        if id == replace_id:
            return self.json_message(201)

        shipment = ShipmentTemplate.objects(entity_id = id, shop = self.shop).first()
        replace_shipment = ShipmentTemplate.objects(entity_id =replace_id, shop = shop).first()
        
        if not shipment or not replace_shipment:
            return self.json_message(201)
        
        Product.objects(shop = self.shop, shipment_template = shipment).update(set__shipment_template = shipment)

        ShipmentTemplate.objects(entity_id = id, shop = self.shop).delete()

        self.json_message(200)


handlers = [
    (r"/main/api/shipment_template/get_all", GetAll),
    (r"/main/api/shipment_template/pre_create", PreCreate),
    (r"/main/api/shipment_template/save", Save),
    (r"/main/api/shipment_template/get_single", GetSingle),
    (r"/main/api/shipment_template/duplicate", Duplicate),
    (r"/main/api/shipment_template/check_unused", CheckUnused),
    (r"/main/api/shipment_template/remove", Remove),
    
]