#coding:utf-8
from util.handler import BaseHandler

class Track(BaseHandler):
    def get(self):
        ssid = self.get_argument("sid", 0) #物流id
        sscode = self.get_argument("type", "")#物流code
        postid = self.get_argument("postid", "") #物流单号

        self.json_message(200, [])

handlers = [
    (r"/main/api/track", Track)
]