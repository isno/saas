#coding:utf-8

from tasks import app

from model.coupon import Coupon
'''
店铺数据初始化
'''

@app.task
def CouponInit(coupon_group):
    for i in range(coupon_group.quantity_provided):
        c = Coupon()
        c.shop = coupon_group.shop
        c.coupon_group = coupon_group
        c.code = coupon_group.prefix + c.generate_code()
        c.save()