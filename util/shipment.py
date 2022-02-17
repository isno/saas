#coding:utf-8
'''
运费模板
'''
from model.product import Product

class Shipment:
    def __init__(self, carts):
        self._carts = []
        shipment_templates = []
        for _item in carts:
            product = Product.objects.get(entity_id = _item.product_variant.product_id)
            shipment_templates.append(product.shipment_template)
            self._carts.append(_item.simple_data)

        self.shipments = []
        for _ship in shipment_templates:
            methods = []
            for _rule in _ship.rules:
                _carts = filter(lambda x: x.get("shipment_template_id") == _ship.entity_id, self._carts)
                
                amount = 0
                if _ship.calculate_type == 0:
                    amount = self.get_amount_of_weight(_carts, _rule.fees)
                if _ship.calculate_type == 1:
                    amount = self.get_amount_of_volume(_carts, _rule.fees)
                if _ship.calculate_type == 2:
                    amount = self.get_amount_of_quantity(_carts, _rule.fees)

                
                methods.append({
                        "id":_rule.entity_id,
                        "type":_rule.type,
                        "ship_type":_rule.type,
                        "amount":amount,
                        "discount":None
                    })

            self.shipments.append(
                {
                    "id":_ship.entity_id,
                    "carts":_carts,
                    "shipment_methods":methods
                })
    def get_shipments(self):
        return self.shipments

    def get_amount_of_weight(self, carts, rules):
        amount = 0
        '''
        按重量
        '''
        all_weight = 0
        for _cart in carts:
            all_weight+=_cart.get("weight",0)*_cart.get("quantity")

        rule = {}
        for _rule in rules:
            if _rule.get("is_default", True):
                rule = _rule
                break


        if rule.get("start") >= all_weight:
            amount = rule.get("postage", 0)
            return amount
        
        amount = (all_weight - rule.get("start"))/float(rule.get("plus"))*rule.get("postageplus")
        amount = max(0, amount)
        amount+=rule.get("postage", 0)
        return amount

    def get_amount_of_volume(self, carts, rules):
        amount = 0
        '''
        按重量
        '''
        all_volume = 0
        for _cart in carts:
            all_volume+=_cart.get("volume",0)*_cart.get("quantity")

        rule = {}
        for _rule in rules:
            if _rule.get("is_default", True):
                rule = _rule
                break


        if rule.get("start") >= all_volume:
            amount = rule.get("postage", 0)
            return amount
        
        amount = (all_volume - rule.get("start"))/float(rule.get("plus"))*rule.get("postageplus")
        amount = max(0, amount)
        amount+=rule.get("postage", 0)
        return amount

    def get_amount_of_quantity(self, carts, rules):
        amount = 0
        '''
        按重量
        '''
        quantity = 0
        for _cart in carts:
            quantity+=_cart.get("volume",0)*_cart.get("quantity")

        rule = {}
        for _rule in rules:
            if _rule.get("is_default", True):
                rule = _rule
                break


        if rule.get("start") >= quantity:
            amount = rule.get("postage", 0)
            return amount
        
        amount = (quantity - rule.get("start"))/float(rule.get("plus"))*rule.get("postageplus")
        amount = max(0, amount)
        amount+=rule.get("postage", 0)
        return amount




