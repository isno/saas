#coding:utf-8
from tornado.escape import json_decode


from util.handler import BaseHandler,authenticated

from model.product import Product
from model.shipment_template import ShipmentTemplate
from model.product_vendor import ProductVendor
from model.product_variant import ProductVariant
from model.product_type import ProductType

class ChangeVisibility(BaseHandler):
    @authenticated("m_product")
    def post(self):
        visibility = self.get_argument("visibility", "true")
        visibility = True if visibility == "true" else False
        pids = self.get_argument("pids", "")

        for pid in pids.split(","):
            product = Product.objects(entity_id = int(pid), shop = self.shop).first()
            if product:
                product.visibility = visibility
                product.save()

        self.json_message(200)


class Remove(BaseHandler):
    @authenticated("m_product")
    def post(self):
        pids = self.get_argument("pids", "")
        for pid in pids.split(","):
            product = Product.objects.get(entity_id = int(pid), shop = self.shop)
            product.is_deleted = True
            product.save()

        self.json_message(200)


class BatchManagement(BaseHandler):
    @authenticated("m_product")
    def post(self):
        data = self.get_argument("data")
        params = json_decode(data)

        if params.get("column", "") == "price":
            
            adjust_ratio = params.get("adjust_ratio", 0)
            price = int(params.get("amount", 0))

            #  价格重置
            if params.get("type") == "reset":
                for pid in params.get("product_ids"):
                    product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                    ProductVariant.objects(product_id = product.entity_id).update(set__price = price)
                    product.save()

            if params.get("type") == "plus":
                for pid in params.get("product_ids"):
                    product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                    vs = ProductVariant.objects(product_id = product.entity_id)
                    for _v in vs:
                        price = _v.price+_v.price*(float(adjust_ratio)/100.0) if not price else _v.price+price
                        _v.price = price
                        _v.save()
                    product.save()

            if params.get("type") == "minus":
                for pid in params.get("product_ids"):
                    product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                    vs = ProductVariant.objects(product_id = product.entity_id)
                    for _v in vs:
                        price = _v.price - _v.price*(float(adjust_ratio)/100.0) if not price else (_v.price-price)
                        if price > _v.price:
                            price = _v.price
                        _v.price = price
                        _v.save()
                    product.save()

        # 库存设置
        if params.get("column", "") == "stock":
            num = params.get("amount", 0)
            num = int(num)
            
            for pid in params.get("product_ids"):
                product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                vs = ProductVariant.objects(product_id = product.entity_id)
                for _v in vs:
                    if params.get("type") == "minus":
                        num = _v.stock-num
                        if num > _v.stock:
                            num = _v.stock
                    elif params.get("type") == "plus":
                        num = _v.stock + num

                    elif params.get("type") == "reset":
                        _v.stock = num
                        _v.save()
                product.save()

        # 统一模板设置
        if params.get("column", "") == "shipment_template":
            shipment = ShipmentTemplate.objects.get(entity_id = params.get("ids"))
            for pid in params.get("product_ids"):
                product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                product.shipment_template = shipment
                product.save()

        if params.get("column", "") == "vendor":
            vendor = ProductVendor.objects.get(entity_id = params.get("ids"))
            for pid in params.get("product_ids"):
                product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                product.vendor = vendor
                product.save()

        if params.get("column", "") == "types":
            types = ProductType.objects(entity_id__in = params.get("ids"))
            types = [v for v in types]

            for pid in params.get("product_ids"):
                product = Product.objects.get(entity_id = int(pid), shop = self.shop)
                if params.get("type") == "add":
                    ids = []
                    v = product.types + types
                    product.types = []
                    for i in v:
                        if i.entity_id not in ids:
                            ids.append(i.entity_id)
                            product.types.append(i)  
                    #
                else:
                    product.types = types
                product.save()


        
        self.json_message(200)                        


handlers = [
    (r"/main/api/product/multi_change_visibility", ChangeVisibility),
    (r"/main/api/product/multi_remove", Remove),
    (r"/main/api/product/batch_management", BatchManagement)
]