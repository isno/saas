#coding:utf-8
from util.handler import BaseHandler,authenticated
from model.shop import Shop

'''
基础管理模块
'''
class SettingHandler(BaseHandler):
    @authenticated("")
    def get(self):
        data = self.shop.simple_data
        self.json_message(200, data, "ok")

    @authenticated("m_setting")
    def post(self):
        name = self.get_argument("name", "")
        if not name:
            self.json_message(201,{}, "请填写品牌名称")

        service_phone = self.get_argument("service_phone", "")
        announcement  = self.get_argument("announcement", "")

        close_desc  = self.get_argument("close_desc", "")
        status = int(self.get_argument("status", 0))
        password = self.get_argument("password", "")

        '''
        积分
        '''
        reward_point_enabled = True if self.get_argument("reward_point_enabled", "") == "true" else False
        initial_ratio = int(self.get_argument("initial_ratio", 0))
        reward_point_limit = int(self.get_argument("reward_point_limit", 0))
        exchange_ratio = int(self.get_argument("exchange_ratio",0))

        '''
        订单
        '''
        trade_expired_after = int(self.get_argument("trade_expired_after",30))
        trade_expired_after = trade_expired_after if trade_expired_after>30 else 30
        
        auto_delivered_received = True if self.get_argument("auto_delivered_received", "") == "true" else False

        auto_received_day = int(self.get_argument("auto_received_day", 0))
        auto_delivered_received = True if self.get_argument("auto_delivered_received", "") == "true" else False

        
        logo_image_path = self.get_argument("logo_image_path", "")
     
        model = self.shop


        model.logo_image_path = logo_image_path

        model.name = name
        model.service_phone = service_phone
        model.announcement = announcement
        model.close_desc = close_desc
        model.password = password
        model.status = status


        model.reward_point_enabled = reward_point_enabled
        model.initial_ratio = initial_ratio
        model.reward_point_limit = reward_point_limit
        model.exchange_ratio = exchange_ratio

        model.trade_expired_after = trade_expired_after
        model.auto_delivered_received = auto_delivered_received
        model.auto_received_day = auto_received_day
        model.auto_delivered_received = auto_delivered_received
        model.save()

        self.json_message(200, {}, "ok")


class check_init_module(BaseHandler):
    def get(self):
        self.json_message(200, {"init":True})
        
handlers = [
    (r"/main/api/setting", SettingHandler),
    (r"/main/api/check_init_module", check_init_module)
]