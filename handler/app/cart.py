#coding:utf-8

from tornado.escape import json_encode
from util.app_handler import AppHandler
from model.cart import Cart
from model.product_variant import ProductVariant
from model.product import Product
from model.promotion import Promotion
from tornado.web import authenticated


'''
购物车管理
'''
class Create(AppHandler):
    def get(self):
        params = {}
        if self.current_user:
            params = {"customer":self.current_user}

        res = Cart.objects(**params)
        count = Cart.objects(**params).count()

        items = []
        for _item in res:
            items.append(_item.simple_data)

        self.write({"code":200, "cart":{"products":items, "count":count}})

    @authenticated
    def post(self):
        
        sku_id = self.get_argument("sku_id", 0)
        sku_id = int(sku_id)
        quantity = self.get_argument("quantity",1)
        is_check = self.get_argument("is_check", "")
        
        params = {}
        sku = ProductVariant.objects(entity_id = sku_id, is_deleted=False).first()
        if not sku:
            return self.json_message(201, {}, "商品不存在")
        
        params["product_variant"] = sku
        if self.current_user:
            params["customer"] = self.current_user


        cart = Cart.objects(**params).first()
        if not cart:
            cart = Cart()
            cart.quantity = 0
            if self.current_user:
                cart.customer = self.current_user
            else:
                cart.token = self.token


        cart.quantity = cart.quantity+1
        cart.product_variant = sku
        cart.is_check = True if is_check == "true" else False
           
        cart.save()

        self.json_message(200, {}, "添加成功")


class Update(AppHandler):
    @authenticated
    def post(self):
        variant_id = self.get_argument("variant_id", 0)
        variant_id = int(variant_id)
        

        product_variant = ProductVariant.objects.get(entity_id = variant_id)

        quantity = self.get_argument("quantity", 0)
        quantity = int(quantity)

        product_variant = ProductVariant.objects.get(entity_id = variant_id)

        params = {"token":""}
        params["product_variant"] = product_variant
        if self.current_user:
            params = {"customer":self.current_user}


        data = Cart.objects.get(**params)
        data.quantity = quantity
        data.save()


class Remove(AppHandler):
    def post(self):
        variant_id = self.get_argument("variant_id", 0)
        variant_id = int(variant_id)
  
        quantity = self.get_argument("quantity", 0)
        quantity = int(quantity)

        product_variant = ProductVariant.objects.get(entity_id = variant_id)

        params = {"token":self.token}
        params["product_variant"] = product_variant
        if self.current_user:
            params = {"customer":self.current_user}


        Cart.objects(**params).delete()

        self.json_message(212, {}, "账号未登录，无操作权限")

class MultiRemove(AppHandler):
    def post(self):
        variant_ids = self.get_arguments("variant_ids[]")
        
        params = {"token":self.token}
        
        if self.current_user:
            params = {"customer":self.current_user}

        for _id in variant_ids:
            product_variant = ProductVariant.objects.get(entity_id = int(_id))
            params["product_variant"] = product_variant

            Cart.objects(**params).delete()




handlers = [
    (r"/api/cart", Create),
    (r"/api/cart/set", Update),
    (r"/api/cart/remove", Remove),
    (r"/api/cart/remove/multi", MultiRemove)
]