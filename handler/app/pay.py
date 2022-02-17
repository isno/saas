#coding:utf-8
from util.app_handler import AppHandler
import util.weixinpay.weixinpay as  Weixinpay

from model.pay import Pay
from model.order import Order


'''
生成支付链接
'''
class GeneratePay(AppHandler):
    def get(self):
        order_id = self.get_argument("order_id", "")
        order = Order.objects(no = out_trade_no).first()
        if not order:
            return self.json_message(1)

        callback_url = "https://www.iyoudian.cn/api/pay/notify"

        res = Weixinpay.make_payment_request_wx(callback_url, order_id, order.amount)

        res["appId"]        = res["appid"]
        res["partnerId"]    = res["partnerid"]
        res["prepayId"]     = res["prepayid"]
        res["packageValue"] = res["package"]
        res["nonceStr"]     = res["noncestr"]
        res["timeStamp"]    = res["timestamp"]

        self.json_message(0, {"params":res})
'''
支付异步通知
'''
class Notify(AppHandler):
    def post(self):
        error_msg = '''
                <xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[签名错误]]></return_msg></xml>
            '''
        body =  self.request.body
        try:
            res = Weixinpay.weixinpay_call_back(body)
        except:
            self.write(error_msg)
            return
        out_trade_no = res.get("out_trade_no")

        order = Order.objects(no = out_trade_no).first()
        if not order:
            self.write(error_msg)
            return

        order.is_payed = True
        order.save()

        self.write('''
                <xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>
            ''')


