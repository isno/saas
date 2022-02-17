#coding:utf-8
from util.handler import BaseHandler
from config import conf
from io import BytesIO
import qrcode 

from model.order_system import OrderSystem
from weixin.pay import WeixinPay, WeixinPayError

weipay = WeixinPay(
        conf.get("weipay", "app_id"), 
        conf.get("weipay", "mch_id"), 
        conf.get("weipay", "mch_key"),
        conf.get("weipay", "notify_url"),
        conf.get("weipay", "key_file"),
        conf.get("weipay", "cert_file"))

class Pay(BaseHandler):
    def get(self):
        self.render("wo/pay.htm")

    def post(self):
        pass


class WeixinPay(BaseHandler):
    def get(self):
        order_id = self.get_argument("order_id", "0")
        order = OrderSystem.objects(entity_id = int(order_id)).first()
        if not order:
            return "error"


        res = weipay.unified_order(
            trade_type="NATIVE", 
            body=order.body, 
            out_trade_no=order_id, 
            total_fee=1, 
            product_id = product_id)

        if res["result_code"] == "SUCCESS":
            image = qrcode.make(res["code_url"])
            msstream = BytesIO()
            image.save(msstream)
            image.close()
            self.set_header('Content-Type', 'image/jpg')
            
            self.write(msstream.getvalue())


handlers = [
    (r"/wo/pay", Pay)
]