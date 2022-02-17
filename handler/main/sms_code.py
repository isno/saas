#coding:utf-8
import re
import time
from random import randint

from util.handler import BaseHandler

from model.sms_log import SMSLog 
from model.account import Account

from tasks.sms import send_sms

'''
发送短信验证码
'''
class SendCode(BaseHandler):
    def post(self):
        sms_type = self.get_argument("sms_type", "")
        phone    = self.get_argument("phone", "")
        if phone == "":
            return self.json_message(1, {}, "请填写手机号")

        if not re.match("^1[3456789]\\d{9}$", phone):
            return self.json_message(1, {}, "手机号码格式错误")

        account = Account.objects(account = phone).first()

        if sms_type == "signup":
            if account:
                if account.is_actived == True:
                    return self.json_message(1,{}, "该手机号已经在注册过")

        if sms_type == "forget_password":
            if not account:
                return self.json_message(1,{}, "该手机号还未注册")

            if account.is_actived == False:
                return self.json_message(1,{}, "该手机号还未注册激活")

        if SMSLog.objects(created_ip = self.request.remote_ip).count() > 50:
            self.json_message(1, {},"抱歉，您当日操作过于频繁，请明日再试")

        #60s 内同一手机号只能发送一次
        key = "sms_%s_%s" % (sms_type, phone)
        timestamp = self.redis.get(key)
        if timestamp:
            k = int(timestamp) - int(time.time())
            if k < 0:
                self.redis.delete(key)
            else:
                self.json_message(1, {},"请您%s秒后再试。" % k)
                return

        self.redis.set(key,str(int(time.time())+60))
        self.redis.expire(key, 60)


        code = randint(100000,999999)

        sms_log = SMSLog()
        sms_log.phone = phone
        sms_log.code = "%d" % code
        sms_log.send_type = sms_type
        sms_log.created_ip = self.request.remote_ip
        sms_log.save()
        
        # celery 发送短信
        send_sms.delay(phone, code, sms_type)

        self.json_message(0, {},"验证码发送成功")

handlers = [
    (r"/auth/send_sms_code", SendCode)
]


