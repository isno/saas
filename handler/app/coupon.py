#coding:utf-8
from util.app_handler import AppHandler

from io import BytesIO
import qrcode 

class Qrcode(AppHandler):
    def get(self):
        image = qrcode.make('hello, qrcode')


        msstream = BytesIO()
        image.save(msstream)
        image.close()
        self.set_header('Content-Type', 'image/jpg')
        
        self.write(msstream.getvalue())


handlers = [
    (r"/coupon/get", Qrcode)
]