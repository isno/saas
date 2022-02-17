#coding:utf-8

from util.app_handler import AppHandler

class RewardPoint(AppHandler):
    def get(self):
        data = {
            "code":200,
            "limit":10,
            "exchange_ratio":100,
            "enabled":True
        }
        self.write(data)

class RewardPointDetail(AppHandler):
    def get(self):
        data = {
            "code":200,
            "reward_point_details":[],
            "item_count":0,
            "page_count":0,
            "is_empty":True,
            "reward_point_total":0,
            "last_year_point":0
        }
        self.write(data)

handlers = [
    (r"/api/reward_point", RewardPoint),
    (r"/api/reward_point_details", RewardPointDetail)
]