#coding:utf-8
import os
import random
import string
from io import BytesIO

from util.handler import BaseHandler

from wheezy.captcha.image import captcha

from wheezy.captcha.image import background
from wheezy.captcha.image import curve
from wheezy.captcha.image import noise
from wheezy.captcha.image import smooth
from wheezy.captcha.image import text

from wheezy.captcha.image import offset
from wheezy.captcha.image import rotate
from wheezy.captcha.image import warp

class Captcha(BaseHandler):
    def get(self):
        sms_type = self.get_argument("type", "")
        sms_types = ['login','signup', 'forget_password']
        if sms_types.count(sms_type) != 1:
            self.json_message(1, "抱歉，该操作系统不支持")
            return

        root_path = os.path.dirname(__file__)
        font1 = os.path.join(root_path,'../../static/main/fonts/FreeSans-Bold.ttf')
        font2 = os.path.join(root_path,'../../static/main/fonts/Arial-Bold.ttf')

        name = "%s_vcode" % sms_type
        captcha_image = captcha(drawings=[
            background("#FFF"),
            text(fonts=[font2],
            drawings=[
                warp(),
                rotate(),
                offset()
            ], color = "#dedede"),
            curve(),
            noise(),
            smooth()
        ])

        chars = string.ascii_uppercase.replace("I", "").replace("O", "")
        code  = ''.join([random.choice(chars) for i in range(4)])

        self.session[name] = "".join(code)
        self.session.save()

        image = captcha_image(code)
        msstream = BytesIO()
        image.save(msstream, 'JPEG', quality=85)
        image.close()
        self.set_header('Content-Type', 'image/jpg')
        
        self.write(msstream.getvalue())

handlers = [
    (r"/auth/captcha", Captcha)
    ]