#coding:utf-8
from tornado.web import addslash,authenticated
from util.handler import BaseHandler

from tornado.escape import json_decode

from model.shop import Shop
from model.account_to_shop import AccountToShop

from tasks.shop import shopInit

'''
用户的商店
'''
class MyShops(BaseHandler):
    @authenticated
    def get(self):
        shops = []
        res =  AccountToShop.objects(account = self.current_user)
        for _var in res:
            shops.append(_var.shop)
        self.render("wo/shops.htm", shops = shops)
'''
创建商店
'''
class New(BaseHandler):
    @authenticated
    def get(self):
        self.render("wo/new.htm")

    @authenticated
    def post(self):
        name = self.get_argument("name", "")
        intro = self.get_argument("intro", "")
        shop_type = self.get_argument("shop_type", "0")
        '''
        检查创建商店的数量, 最大三个
        '''
        count = AccountToShop.objects(account = self.current_user).count()
        if count >=1:
            self.notice("err", "抱歉，每个账户最多创建1个店铺")
            return self.redirect("/my/shops/new")

        new = Shop()
        new.announcement = intro
        new.name = name
        new.shop_type = int(shop_type)

        modules = ["m_account", "m_order", "m_product", "m_customer", "m_promotion", "m_coupon", "m_refund", "m_summary",  "m_setting", "m_payment", "m_shipment"]
        new.modules = modules
        new.save()

        a = AccountToShop()
        a.account = self.current_user
        a.shop = new
        a.is_actived = True
        a.modules = modules
        a.save()

        shopInit.delay(new.entity_id)


        self.redirect("/wo/shop/create_success/%d" % new.entity_id)


class Console(BaseHandler):
    @authenticated
    def get(self, shop_id):

        shop = Shop.objects(entity_id = int(shop_id)).first()
        if not shop:
            return self.json_message(201, {}, "无权限")

        res = AccountToShop.objects(account = self.current_user, shop = shop).first()
        if not res:
            return self.json_message(201, {}, "无权限")

        self.render("main/main.htm", shop = shop)


class ShopCreateSuccess(BaseHandler):
    @authenticated
    def get(self, vid):
        self.render("wo/shop_create_success.htm",  vid = vid)

handlers = [
    (r"/wo/", MyShops),

    (r"/wo/shops/new", New),
    (r"/shop/(\d+)/console/", Console),
    (r"/wo/shop/create_success/(\d+)", ShopCreateSuccess)
]