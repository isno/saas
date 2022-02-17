#coding:utf-8

from util.handler import BaseHandler,authenticated

class Positions(BaseHandler):
    def get(self):
        apps = []
        apps.append({
            "handle": "product-mix",
            "title": "爱优店",
            "embedded": False,
            "key":"d148a7e6a43ce2ff7c8d21fd9d8728a3",
            "icon_asset_id": "57b2e58103f22d7bd8000005",
            "icon_file_name": "icon.png",
            "icon_epoch": "1471341953",
            "positions":[
                {

                }
            ]
            })
        self.json_message(200, {"public_app_positions":apps})

handlers = [
    (r"/main/api/apps/positions", Positions),
]