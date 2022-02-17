#coding:utf-8
from __future__ import division
from operator import itemgetter
from itertools import groupby
from datetime import datetime

from model.product import Product
from model.coupon import Coupon
from model.promotion import Promotion

from model.shipment_template import ShipmentTemplate

'''
活动cost
'''
class OrderHelper:

    def __init__(self, shop, products, customer, address, coupon_code):

        self.shop = shop
        self.products = products
        self.customer = customer
        self.address = address

        self.coupon_info = {}

        self.amount_total = 0 # 商品费用
        # 对 products 重新排序
        products.sort(key=itemgetter('shipment_template_id'))
        self.products = []
        for _ship_id, _items in groupby(products, key=itemgetter('shipment_template_id')):
            v = {
                "is_post_free":False,
                "amount_total":0, # 商品总价 
                "post_fee":0,
                "amount_total":0,
                "products":[], 
                "ship_id":_ship_id,
                "is_available":True
            }
            for i in _items:
                v["amount_total"]+=i["line_price"]
                v["products"].append(i)

            self.amount_total+=v["amount_total"]
            self.products.append(v)

        self.post_fee_total = 0 # 邮费
        self.deduct = 0 # 活动费用扣除
        
        

        # 折扣率 100/100
        self.discount = 100
        self.discount_amount = 0

        # 计算活动
        self.promotions = []
        percent_offs = []
        amount_offs = []

        now = datetime.now()
        res = Promotion.objects(\
            actived_at__lte = now, \
            expired_at__gte = now, \
            is_deleted = False, \
            shop = self.shop)

        for _var in res:
            # 判断折扣活动
            if _var.discount_type == "percent_off":
                percent_offs.append(_var)
            # 判断满减活动
            if _var.discount_type == "amount_off":
                amount_offs.append(_var)

            self.promotions.append(_var)
        # 判断折扣活动
        for _var in percent_offs:
            hit,self.discount = self._percent_off(_var, self.amount_total)
            if hit:
                break

        # 判断满减活动
        for _var in amount_offs:
            hit,self.discount_amount = self._amount_off(_var, self.amount_total*(self.discount/100.0))
            if hit:
                break

        self._init_ships()
        amount_total = self.amount_total*(self.discount/100) - self.discount_amount

        amount_total = self._use_coupon(coupon_code, amount_total)
        self.new_amount_total = float(amount_total + self.post_fee_total)

        
        # 检查地区是否配送
        

    '''
    判断商品是否可售
    @无货
    @地区不可售
    '''
    def _init_ships(self):
        i = 0
        for _ship in self.products:
            shipment = ShipmentTemplate.objects.get(entity_id = _ship.get("ship_id"))
            for _method in shipment.rules:
                _ids = []
                for _var in _method.exclude_areas.split(","):
                    if _var:
                        _ids.append(int(_var))
                is_area = list(set(_ids).intersection(set(self.address.get("area_ids"))))
                self.products[i]["is_available"] = False if is_area else True
            self.products[i]["post_fee"] = self._get_post_fee(shipment, _ship.get("products"))
            
            # 判断是否免邮
            is_post_free = False
            for _promotion in self.promotions:
                if _promotion.discount_type == "free_shipping":
                    is_post_free = self._free_shipping(_promotion,0,self.products[i]["amount_total"])
                    if is_post_free == True:
                        break
            self.products[i]["is_post_free"] = is_post_free
            if not is_post_free:
                self.post_fee_total+=self.products[i]["post_fee"]
            i+=1

    def _use_coupon(self, code, amount_total):
        coupon = Coupon.objects(code = code, shop = self.shop).first()
        if not coupon:
            return amount_total
        if coupon.is_used:
            return amount_total
        if coupon.coupon_group.active_amount > 0:
            if coupon.coupon_group.active_amount > amount_total:
                return amount_total
        if coupon.coupon_group.status != "actived":
            return amount_total
        if coupon.coupon_group.is_deleted or not coupon.coupon_group.available:
            return amount_total

        if coupon.coupon_group.utype == "amount":
            self.coupon_info = {"type":"amount", "discount_amount":coupon.coupon_group.discount_amount}
            return amount_total-coupon.coupon_group.discount_amount

        self.coupon_info = {"type":"percentage", "discount_percentage":coupon.coupon_group.discount_percentage}
        return amount_total*(discount_percentage/100)




    '''
    计算订单内邮费
    '''
    def _get_post_fee(self, shipment, products):
        amount_total = 0
        for _rule in shipment.rules:
            if shipment.calculate_type == 0:
                amount_total+=self._get_post_fee_detail(products, _rule.fees, "weight")
            elif shipment.calculate_type == 1:
                amount_total+=self._get_post_fee_detail(products, _rule.fees, "volume")
            elif shipment.calculate_type == 2:
                amount_total+=self._get_post_fee_detail(products, _rule.fees, "quantity")

        return amount_total
    '''
    计算运费，详细
    '''
    def _get_post_fee_detail(self, carts, rules, stype):
        amount = 0
        all_size = 0
        for _cart in carts:
            # 按件数算运费
            if stype == "quantity": 
                all_size+=_cart.get("quantity")
            else:  
                all_size+=_cart.get(stype,0)*_cart.get("quantity")

        rule = None
        for _rule in rules:
            if _rule.get("is_default", True):
                rule = _rule
            if not _rule.get("is_default", False):
                _ids = []
                for var in _rule.get("include_areas","").split(","):
                    if var:
                        _ids.append(int(var))
                is_area = list(set(_ids).intersection(set(self.address.get("area_ids"))))
                if is_area:
                    rule = _rule


        if rule.get("start") >= all_size:
            amount = rule.get("postage", 0)
            return amount
        
        amount = (all_size - rule.get("start"))/float(rule.get("plus"))*rule.get("postageplus")
        amount = max(0, amount)
        amount+=rule.get("postage", 0)
        return amount


    '''
    满减
    '''
    def _amount_off(self, promotion, amount_total):
        is_product_hit = False
        is_customer_hit = False

        # 判断商品是否命中
        if promotion.range_type == "partial":
            for _product in self.products:
                if _product.get("product_id") in promotion.products:
                    is_product_hit = True
                    break
        elif promotion.range_type == "entire":
            is_product_hit = True

        # 判断用户是否命中
        if promotion.active_type == "entire":
            is_customer_hit = True

        # 指定会员等级
        if promotion.active_type == "customer_level":
            level = self.customer.level
            if level:
                for _level in promotion.customer_levels:
                    if level.entity_id == _level.get("id", 0):
                        is_customer_hit = True
                        break
        # 指定会员
        if promotion.active_type == "partial":
            for _customer in promotion.customers:
                if _customer.get("id") == self.customer.entity_id:
                    is_customer_hit = True
                    break
        # 首单客户
        if promotion.active_type == "first_trade":
            if self.customer.is_first_order(self.shop):
                is_customer_hit = True

        if not is_customer_hit or not is_product_hit:
            return False, 0

        promotion.promotion_offs.sort(key=lambda k: k["active_amount"])
        for _rule in promotion.promotion_offs:
            if amount_total >= _rule.get("active_amount", 0):
                return True, _rule.get("discount_amount", 0)

        return False, 0

        
    def _percent_off(self, promotion, amount_total):
        is_product_hit = False
        is_customer_hit = False
      
        # 判断商品是否命中
        if promotion.range_type == "partial":
            for _product in self.products:
                if _product.get("product_id") in promotion.products:
                    is_product_hit = True
                    break
        elif promotion.range_type == "entire":
            is_product_hit = True

        # 判断用户是否命中
        if promotion.active_type == "entire":
            is_customer_hit = True

        # 指定会员等级
        if promotion.active_type == "customer_level":
            level = self.customer.level
            if level:
                for _level in promotion.customer_levels:
                    if level.entity_id == _level.get("id", 0):
                        is_customer_hit = True
                        break
        # 指定会员
        if promotion.active_type == "partial":
            for _customer in promotion.customers:
                if _customer.get("id") == self.customer.entity_id:
                    is_customer_hit = True
                    break
        # 首单客户
        if promotion.active_type == "first_trade":
            if self.customer.is_first_order(self.shop):
                is_customer_hit = True

        discount = 100 # 默认不打折

        if not is_customer_hit or not is_product_hit:
            return False, discount

        promotion.promotion_offs.sort(key=lambda k: k["active_amount"])
        for _rule in promotion.promotion_offs:
            if amount_total >= _rule.get("active_amount", 0):
                discount = _rule.get("discount_percent", 100)
                break

        return True,discount
    '''
    @ 判断包裹是否免邮
    ''' 
    def _free_shipping(self, promotion, delivery_type, package_amount_total):
        
        is_product_hit = False # 指定商品
        is_delivery_type_hit = False # 指定快递方式
        is_areas_hit = False
        is_customer_hit = True
        is_amount_hit = False

        # 判断商品是否命中
        if promotion.range_type == "partial":
            for _product in self.products:
                if _product.get("product_id") in promotion.products:
                    is_product_hit = True
                    break
        elif promotion.range_type == "entire":
            is_product_hit = True

        # 判断地区是否命中
        if not promotion.areas:
            is_areas_hit = True
        else:
            _ids = []
            for var in promotion.areas.split(","):
                if var:
                    _ids.append(int(var))
            is_area = list(set(_ids).intersection(set(self.address.get("area_ids"))))
            is_areas_hit = False if is_area else True
        
        # 判断用户是否命中
        if promotion.active_type == "entire":
            is_customer_hit = True

        # 指定会员等级
        if promotion.active_type == "customer_level":
            level = self.customer.level
            if level:
                for _level in promotion.customer_levels:
                    if level.entity_id == _level.get("id", 0):
                        is_customer_hit = True
                        break
        # 指定会员
        if promotion.active_type == "partial":
            for _customer in promotion.customers:
                if customer.get("id") == self.customer.entity_id:
                    is_customer_hit = True
                    break
        # 首单客户
        if promotion.active_type == "first_trade":
            if self.customer.is_first_order(self.shop):
                is_customer_hit = True

        # 指定金额，按包裹算
        if promotion.active_amount == 0:
            is_amount_hit = True
        if promotion.active_amount >0:
            is_amount_hit = True if promotion.active_amount >= package_amount_total else False

        if delivery_type in promotion.delivery_type:
            is_delivery_type_hit = True

        return is_product_hit and is_delivery_type_hit and \
        is_areas_hit and is_customer_hit and is_amount_hit

        







