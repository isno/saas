#coding:utf-8

from model.order import Order
from util.handler import BaseHandler,authenticated

'''
退单handler
'''
class Refund(BaseHandler):
    @authenticated
    def post(self):
        no = self.get_argument("id", "")
        order = Order.objects(no = no, shop = self.shop).first()
        order.status = "4"
        order.save()

        self.json_message(200)

handlers = [
    (r"/main/api/trade/refund", Refund)
]