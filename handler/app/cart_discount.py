#coding:utf-8

from util.app_handler import AppHandler

from model.cart import Cart
from model.promotion import Promotion
from util.discount import Discount as DiscountHelper

'''
判断商品是否有优惠
'''
class Discount(AppHandler):
    def get(self):
        params = {"token":self.token}
        if self.current_user:
            params = {"customer":self.current_user}

        carts = Cart.objects(**params)

        discounts = []
        '''
        把符合时间的活动查询出来
        '''
        promotions = Promotion.objects(site = self.site, \
            is_deleted = False, \
            actived_at__lt = self.now, \
            expired_at__gte = self.now)
        discounts = DiscountHelper(carts, promotions).get_discounts()


        data = {
            "code":200,
            "message":"",
            "discounts":discounts,
            "point":0,
            "reward_point_limit":10,
            "reward_point_enabled":True,
            "reward_point_exchange_ratio":100
        }
        self.write(data)

handlers = [
    (r"/api/discount/match/cart", Discount)
]