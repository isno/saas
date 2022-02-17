#coding:utf-8
import math
import uuid
from datetime import datetime

from tornado.escape import json_decode
from util.handler import BaseHandler,authenticated

from model.product import Product
from model.product_type import ProductType
from model.product_image import ProductImage
from model.product_variant import ProductVariant
from model.product_vendor import ProductVendor
from model.shipment_template import ShipmentTemplate

from es.product import ProductES


class CheckLimit(BaseHandler):
    @authenticated("")
    def get(self):
        if self.shop.vip_type == 0:
            count = Product.objects(is_deleted = False).count()
            if count >100:
                return self.json_message(201, {}, "免费商店最多添加100个商铺")

        self.json_message(200, {})

class PreCreate(BaseHandler):
    @authenticated("m_product")
    def post(self):
        product = Product()
        data = {
            "id":product.entity_id,
            "name":"",
            "visibility":False,
            "initial_ratio":20.0,
            "reward_point_enabled":True,
            "v":("%s" % uuid.uuid1()).replace("-",""),
            "need_shipping":"true"
        }
        
        shipment_template = ShipmentTemplate.objects(shop = self.shop)[:1]
        for _shipment_template in shipment_template:
            data["shipment_template"] = {
                "id":_shipment_template.entity_id,
                "name":_shipment_template.name
            }

        self.json_message(200, {"product":data})

class View(BaseHandler):
    @authenticated("")
    def get(self):
        id = self.get_argument("id", 0)
        id = int(id)
        product = Product.objects(shop = self.shop, entity_id = id).first()
        if not product:
            return self.json_message(201, {}, "抱歉，商品不存在")

        variants = []
        for _variant in product.variants:
            variant = {
                "id":_variant.entity_id,
                "option_1":_variant.option_1,
                "option_2":_variant.option_2,
                "option_3":_variant.option_3,
                "price":_variant.price,
                "stock":_variant.stock,
                "point":_variant.point,
                "weight":_variant.weight,
                "volume":_variant.volume,
                "barcode":_variant.barcode,
                "is_alarmed":_variant.is_alarmed,
                "alarm_num":_variant.alarm_num,
                "email_alarm":_variant.email_alarm,
                "phone_alarm":_variant.phone_alarm,
                "weixin_alarm":_variant.weixin_alarm,
                "compare_price":_variant.compare_price,
                "stock_type":_variant.stock_type,
                "image_real_id":None,
                "image_id":None,
                "image_name":None,
                "image_epoch":None,
            }
            try:
                if _variant.image:
                    variant["image_real_id"] = _variant.image.entity_id
                    variant["image_id"] = _variant.image.asset.entity_id
                    variant["image_name"] = _variant.image.asset.file_name
                    variant["image_epoch"] = _variant.image.asset.epoch
            except:
                    pass

            variants.append(variant)


        data = {
            "id":product.entity_id,
            "name":product.name,
            "mobile_desc":product.mobile_desc,
            "short_desc":product.short_desc,
            "visibility":product.visibility,
            "is_saved":product.is_saved,
            "sale":0,
            "display_sale":product.display_sale,
            "options":product.options,
            "variants":variants,
            "types":[],
            "vendor":None,
        }
        
        if product.shipment_template:
            data["shipment_template"] = {
                "id":product.shipment_template.entity_id,
                "name":product.shipment_template.name
            }
    
        '''
        产品品牌
        '''
        if product.vendor:
            data["vendor"] = {"id":product.vendor.entity_id,"name":product.vendor.name}

        '''
        产品分类
        '''
        types = []
        for _type in product.types:
            types.append({"id":_type.entity_id, "name":_type.name})
        data["types"] = types

        self.json_message(200, {"product":data})

class Save(BaseHandler):
    @authenticated("m_product")
    def post(self):
        name = self.get_argument("name", "")
        id   = self.get_argument("id", 0)
        id = int(id)

        data = self.get_argument("data")

        params = json_decode(data)

        product = Product.objects(entity_id = id).first()
        if product and product.shop != self.shop:
            return self.json_message(201, {}, "系统错误")

        if not product:
            product = Product()
            product.entity_id = id

        product.name = params.get("name", "")

        if product.name == "":
            return self.json_message(201, {}, "请填写商品标题")

        product.shop = self.shop
        product.short_desc = params.get("short_desc", "")
        product.meta_field = params.get("meta_field", {})
        product.visibility = True if params.get("visibility","") == "true" else False
        product.mobile_desc = params.get("mobile_desc", "")
        product.display_sale = params.get("display_sale", 0)
    
        product.options = params.get("options",[])
        product.is_saved = True

        shipment_template_id = params.get("shipment_template_id", 0)
        if shipment_template_id:
            product.shipment_template = ShipmentTemplate.objects.get(entity_id = shipment_template_id)
        
        
        ProductVariant.objects(product_id = product.entity_id).update(set__is_deleted = True)

        product.variants = []
        variants = params.get("variants", [])
        for _variant in variants:

            variant_id = _variant.get("id", 0)
            variant = None
            if variant_id:
                variant = ProductVariant.objects(entity_id = variant_id).first()
                
            if not variant:
                variant = ProductVariant()

            
            variant.product_id = product.entity_id

            variant.option_1      = _variant.get("option_1", "")
            variant.option_1_name = product.options[0]["name"] if len(product.options)>0 else "" 
            
            variant.option_2      = _variant.get("option_2", "")
            variant.option_2_name = product.options[1]["name"] if len(product.options)>1 else "" 
            
            variant.option_3      = _variant.get("option_3", "")
            variant.option_3_name = product.options[2]["name"] if len(product.options)>2 else "" 

            variant.price    = _variant.get("price") if isinstance(_variant.get("price"), int) else 0  
            variant.stock    = _variant.get("stock") if isinstance(_variant.get("stock"), int) else 0  
            variant.point    = _variant.get("point") if isinstance(_variant.get("point"), int) else 0 
      

            if _variant.get("weight", 0):
                variant.weight = _variant.get("weight", 0)

            if _variant.get("volume", 0):
                variant.volume = _variant.get("volume", 0)

            variant.barcode       = _variant.get("barcode", "")
            variant.is_alarmed    = _variant.get("is_alarmed", False)
            variant.alarm_num     = _variant.get("alarm_num", 0)
            variant.email_alarm   = _variant.get("email_alarm", False)
            variant.phone_alarm   = _variant.get("phone_alarm", False)
            variant.weixin_alarm  = _variant.get("weixin_alarm", False)
            variant.is_deleted = False

            if _variant.get("compare_price", 0):
                variant.compare_price = _variant.get("compare_price", 0)
            
            variant.stock_type = _variant.get("stock_type")

            image_real_id = _variant.get("image_real_id")
            if image_real_id:
                variant.image = ProductImage.objects.get(entity_id = int(image_real_id))
            variant.save()

            product.variants.append(variant)

        product.types = []
        for _type in params.get("types",[]):
           
            product_type = ProductType.objects(entity_id = _type.get("id")).first()
            if product_type:
                product.types.append(product_type)

        vendor_id = params.get("vendor_id", 0)
        if vendor_id:
            vendor = ProductVendor.objects(entity_id = vendor_id, shop = self.shop).first()
            if vendor:
                product.vendor = vendor


        product.images = []
        images = ProductImage.objects(product_id = product.entity_id)
        for _image in images:
            product.images.append(_image)

        product.save()

        self.json_message(200, {"product":{}})


class CheckBatchProcessStatus(BaseHandler):
    @authenticated("")
    def get(self):
        data = {
            "processed":1,
            "total_count":0,
            "status":"done"
        }
        self.json_message(200, data)

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        
        size = self.get_argument("size", 30)
        size = int(size)
        page = self.get_argument("page",1)
        page = max(int(page),1)
        page_start = (page-1)*size


        visibility = self.get_argument("visibility", "")
        search = self.get_argument("search", "")

        tids = self.get_argument("tid", "")
        vids = self.get_argument("vid", "")
        amount_smaller = self.get_argument("amount_smaller", "")
        amount_greater = self.get_argument("amount_greater", "")

        point_smaller = self.get_argument("point_smaller", "")
        point_greater = self.get_argument("point_greater", "")

        stock_smaller = self.get_argument("stock_smaller", "")
        stock_greater = self.get_argument("stock_greater", "")

        created_earlier = self.get_argument("created_earlier", "")
        created_later = self.get_argument("created_later", "")
        

        s = ProductES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)

        if visibility:
            s = s.query("term", visibility = True if visibility == "true" else False)
        if search:
            s = s.query("match", name=search)

        if amount_smaller.isdigit():
            s = s.filter("range", price={"gte":int(amount_smaller)})
        if amount_greater.isdigit():
            s = s.filter("range", price={"lte":int(amount_greater)})

        if point_smaller.isdigit():
            s = s.filter("range", point={"gte":int(point_smaller)})
        if point_greater.isdigit():
            s = s.filter("range", point={"lte":int(point_greater)})

        if stock_smaller.isdigit():
            s = s.filter("range", stock={"gte":int(stock_smaller)})
        if stock_greater.isdigit():
            s = s.filter("range", stock={"lte":int(stock_greater)})

        if tids:
            s = s.filter("terms", types=[int(v) for v in tids.split(",")])
        if vids:
            s = s.filter("terms", vendor=[int(v) for v in vids.split(",")])

        if created_earlier and created_earlier != "0":
            created_earlier = datetime.strptime(created_earlier,'%Y-%m-%dT%H:%M:%S+08:00')
            s = s.filter("range", created_at={"gte":created_earlier})
        if created_later and created_later != "0":
            created_later = datetime.strptime(created_later,'%Y-%m-%dT%H:%M:%S+08:00')
            s = s.filter("range", created_at={"lte":created_later})


        s = s[page_start:page_start+size]

        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))


        products = []
        ret = Product.objects(entity_id__in = ids)
        for _product in ret:
            product = {
                "id":_product.entity_id,
                "name":_product.name,
                "top":False,
                "image":_product.image_path,
                "visibility":_product.visibility,
                "created_at":_product.created_at.isoformat(),
                "updated_at":_product.updated_at.isoformat(),
                "sale":0,
                "price_min":_product.price_min,
                "price_max":_product.price_max,
                "point_min":_product.point_min,
                "point_max":_product.point_max,
                "stock_sum":_product.stock_sum,
                "variant_count":_product.variant_count,
                "stock_debt":0,
                "image_path":_product.image_path,
                "product_types":None,
                "product_vendors":None
            }
            if _product.vendor:
                product["product_vendors"] = _product.vendor.name

            types = []
            for _type in _product.types:
                try:
                    types.append(_type.name)
                except:
                    pass

            if types:
                product["product_types"] = ",".join(types)

            products.append(product)

        page_count = int(math.ceil(float(count)/size))
        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":False if products else True,
            "products":products
        }
        self.json_message(200, data)


class ProductResort(BaseHandler):
    def post(self):
        pass

handlers = [
    (r"/main/api/product/pre_create",PreCreate),
    (r"/main/api/product/get_single", View),
    (r"/main/api/product/save", Save),
    (r"/main/api/product/resort", ProductResort),
    (r"/main/api/product/get_all", GetAll),
    (r"/main/api/product/check_limit",CheckLimit),
    (r"/main/api/product/check_batch_process_status", CheckBatchProcessStatus)
]