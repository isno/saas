#coding:utf-8

from util.handler import BaseHandler
from model.payment import Payment

class check(BaseHandler):
    def get(self):
        data = {
            "store_certification":{"status":0}
        }
        self.json_message(200, data)

class Filter(BaseHandler):
    def get(self):
       
        payment_methods = [
            #{"name":"支付宝", "value":"alipay"},
            {"name":"微信", "value":"wppay"}
       ]

        data = {
            "payment_methods":payment_methods
        }
    
        self.json_message(200, data)

class GetAll(BaseHandler):
    def get(self):

        datas = Payment.objects(shop = self.shop)
        payment_methods = []
        for _var in datas:
            payment_methods.append({
                "id":_var.entity_id,
                "name":_var.template.name,
                "pay_type":_var.template.pay_type,
                "pass_test":_var.pass_test,
                "is_config":_var.is_config,
                "pass_test":_var.pass_test,
                "is_actived":_var.is_actived,
                "collect_by_youdian":_var.template.collect_by_youdian,
                "fee_ratio":_var.template.fee_ratio,
                "order":1,
                "settlement_description":_var.template.settlement_description,
                "details":_var.template.details,
                "client_side_transaction_flow":_var.template.client_side_transaction_flow,
                "auto_refund":_var.template.auto_refund,
                "browser_scene":_var.template.browser_scene,
                "currency":_var.template.currency,
                "range_type":2,
                "api_url":"xx",
                "collect_mode":0,

                })

        data = {
            "payment_methods":payment_methods
        }
    
        self.json_message(200, data)

class View(BaseHandler):
    def get(self):
        id = self.get_argument("id",0)
        id = int(id)
        payment = Payment.objects.get(entity_id = id)
        data = {
            "id":payment.entity_id,
            "name":payment.template.name,
            "pay_type":payment.template.pay_type,
            "is_config":payment.is_config,
            "collect_by_youdian":payment.template.collect_by_youdian,
            "pass_test":payment.pass_test,
            "is_actived":payment.is_actived,
            "currency":payment.template.currency[0],
            "setting_keys":payment.template.setting_keys,
            "setting_chs_keys":payment.template.setting_chs_keys,
            "setting_values":payment.setting_values,
            "settings":payment.template.settings
        }
        data = {
            "payment_method":data
        }
    
        self.json_message(200, data)


class SaveConfig(BaseHandler):
    def post(self):
        id = self.get_argument("id",0)
        id = int(id)
        setting_values = self.get_argument("setting_values","")
        payment = Payment.objects.get(entity_id = id)
        payment.setting_values = setting_values
        payment.save()
        self.json_message(200, {})

class Test(BaseHandler):
    def post(self):
        id = self.get_argument("id",0)
        id = int(id)

        callback_url = "http://if.f-space.cn/pay/alipay/callback"


    
        order_id = "%s%d" % (self.now.strftime("%Y%m%d%05d"), 1)
        alipay_pay_url = Alipay.make_payment_request_ali(callback_url, order_id, 1)



        self.json_message(200, {"done":False, "url":alipay_pay_url})

handlers = [
    (r"/main/api/payment_method/get_single", View),
    (r"/main/api/payment_method/go_test", Test),
    (r"/main/api/payment_method/save_config", SaveConfig),
    (r"/main/api/payment_method/filter", Filter),
    (r"/main/api/payment_method/get_all", GetAll),
    (r"/main/api/store_certification/check", check)
]