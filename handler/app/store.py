#coding:utf-8
from util.app_handler import AppHandler

class StoreInfo(AppHandler):
    def get(self):
        data = {
            "name":"✨上海凌空SOHO Go店",
            "distance":"距离您1.5km"
        }
        self.write(data)


handlers = [
    (r"/api/store/(\d+)", StoreInfo)
]