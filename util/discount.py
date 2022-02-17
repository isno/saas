from model.coupon_group import CouponGroup
class Discount:
    def __init__(self, carts, promotions):
        self._carts = []
        for _cart in carts:
            self._carts.append({
                "product_id":_cart.product_variant.product_id,
                "price_total":_cart.product_variant.price*_cart.quantity,
                })


        self._discounts = self.promotions(promotions)

    def get_discounts(self):
        return self._discounts

    def get_price_all(self):
        price_total = 0
        for _price in self._carts:
            price_total+=_price.get("price_total")
        return price_total

    def get_price_partial(self, product_ids):
        price_total = 0
        for _price in self._carts:
            if _price.product_id not in product_ids:
                continue
            price_total+=_price.get("price_total")
        return price_total


    def promotions(self, promotions):
        datas = []
        for _promotion in promotions:
            _data = {
                "name":_promotion.name,
                "discount_type":_promotion.discount_type,
                "range_type":_promotion.range_type,
            }
            price_total = 0
            if _promotion.range_type == "entire":
                price_total = self.get_price_all()
            else:
                price_total = self.get_price_partial(_promotion.products)

            details = sorted(_promotion.promotion_offs, key=lambda x:x['active_amount'], reverse=False)

            has = False

            items = []
            for rule in details:
                
                if price_total>=rule.get("active_amount"):
                    has = True
                    if _promotion.discount_type == "percent_off":
                        _data["discount_amount"] = price_total*rule.get("discount_percent", 100)/100
                    if _promotion.discount_type == "amount_off":
                        _data["discount_amount"] = rule.get("discount_amount", 0)

                    if _promotion.discount_type == "coupon":
                        _data["discount_amount"] = 0
                        coupon = CouponGroup.objects(entity_id = rule.get("coupon_group_id")).first()
                        if coupon:
                            rule["coupon_discount_amount"] = coupon.discount_amount

                items.append(rule)
            
            if has:
                _data["details"] = items
                datas.append(_data)
            
        return datas



