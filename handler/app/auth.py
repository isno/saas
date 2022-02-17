#coding:utf-8
from util.weixin import WXAPPAPI

from util.app_handler import AppHandler
from model.customer import Customer

APP_ID = ""
APP_SECRET = ""


class GetToken(AppHandler):
    def post(self):

        code = self.get_argument("code", "")

        api = WXAPPAPI(appid=APP_ID, app_secret=APP_SECRET)
        session_info = api.exchange_code_for_session_key(code=code)

        user = Customer.objects(shop = self.shop, openid = session_info.get("openid")).first()
        if not user:
            user = Customer()
            user.shop = self.shop
            user.openid = session_info.get("openid")
            user.session_key = session_info.get("session_key")
            user.save()

        token = self.create_signed_value("yd_token", "%d" % user.entity_id)

        return self.json_message(0, {"uid":user.entity_id, "token":token})




handlers = [
    (r"/api/wxlogin", GetToken)
]