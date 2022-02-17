#coding:utf-8
import math
import datetime
from random import randint

from util.handler import BaseHandler,authenticated
from util.const import modules

from model.account import Account
from model.account_to_shop import AccountToShop
from model.login_logs import LoginLogs
from model.sms_log import SMSLog 

from tasks.sms import send_sms

'''
创建管理员
'''
class Create(BaseHandler):
    @authenticated("m_account")
    def post(self):
        name = self.get_argument("name", "")
        phone = self.get_argument("account", "")

        module_codes = self.get_argument("module_codes", "")
        remark = self.get_argument("remark", "")

        if not module_codes:
            return self.json_message(201, {},  "请添加权限")

        account = Account.objects(account = phone).first()
        if not account:
            account = Account()
            account.account = phone
            account.name = name
            account.is_actived = False
            account.save()
        
        count = AccountToShop.objects(account = account, shop = self.shop).count()
        if count:
            return self.json_message(201, {},  "抱歉， 该账户已经添加过")

        auth = AccountToShop()
        auth.shop = self.shop
        auth.account = account
        auth.modules = module_codes.split(",")
        auth.remark = remark
        auth.save()

        self.json_message(200)

class Save(BaseHandler):
    @authenticated("m_account")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)

        model = AccountToShop.objects(entity_id = id, shop = self.shop,).first()
        if not model:
            return self.json_message(201, {}, "为找到账户")

        if self.current_user.entity_id == model.account.entity_id:
            return self.json_message(201, {},  "抱歉， 不可以操作自己的账户")

        remark = self.get_argument("remark", "")
        module_codes = self.get_argument("module_codes", "")

        model.remark = remark
        model.modules = module_codes.split(",")
        model.save()

        self.json_message(200)



class GetSingle(BaseHandler):
    @authenticated("")
    def get(self):
        entity_id = self.get_argument("id", 0)
        entity_id = int(entity_id)
        res = AccountToShop.objects(entity_id = entity_id).first()
        if not res:
            return self.json_message(201)

        logins = []
        data = LoginLogs.objects(account = res.account).limit(10)
        for log in data:
            logins.append(log.simple_data)

        account = {
            "id":res.entity_id,
            "name":res.account.name,
            "account":res.account.account,
            "remark":res.remark,
            "is_actived":res.is_actived,
            "image_path":res.account.image_path,
            "last_in":"" if not res.account.last_login_at  else res.account.last_login_at.isoformat(),
            "account_type":res.account_type,
            "logins":logins,
            "modules":filter(lambda v:v["code"] in res.modules, modules),
        }

        self.json_message(200, {"account":account})



class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        page = self.get_argument("page", "1")
        page = int(page)

        size = 10
        page = max(1, page)
        page_start = (page-1)*size

        count = AccountToShop.objects(shop = self.shop).count()
        res = AccountToShop.objects(shop = self.shop).skip(page_start).limit(size)

        accounts = []
        for _var in res:

            accounts.append({
                "id":_var.entity_id,
                "name":_var.account.name,
                "remark":_var.remark,
                "account":_var.account.account,
                "last_in":"" if not _var.account.last_login_at else _var.account.last_login_at.isoformat(),
                "account_type":_var.account_type,
                "is_actived":_var.is_actived,
                })

        page_count = int(math.ceil(float(count)/size))

        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":True if count == 0 else False,
            "accounts":accounts,
        }

        self.json_message(200, data)

class CheckLimit(BaseHandler):
    @authenticated("")
    def get(self):
        data = {}
        self.json_message(200, data, "success")

class Modules(BaseHandler):
    def get(self):
        self.json_message(200, modules)

class operate_log(BaseHandler):
    def get(self):
        data = {
            "item_count":0,
            "operate_logs":[],
        }
        self.json_message(200, data)

class Remove(BaseHandler):
    @authenticated("m_account")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)
        account = AccountToShop.objects(entity_id = id, shop = self.shop).first()

        if account and account.account_type != 0:
            account.delete()

        self.json_message(200)

'''
转让网站所有权
'''
class ChangeOwner(BaseHandler):
    @authenticated("m_account")
    def post(self):
        new_owner_account = self.get_argument("new_owner_account", "")
        code = self.get_argument("code", "")

        account = Account.objects(account = new_owner_account).first()
        if not account:
            return self.json_message(202, {}, "为找到相关账户 400")

        model = AccountToShop.objects(account = account, shop = self.shop).first()
        if not model:
            return self.json_message(202, {}, "未找到相关账户 401")
        if not model.is_actived:
            return self.json_message(202, {}, "账户未激活 402")

        params = {}
        params["shop"] = self.shop
        params["phone"] = account.account
        params["send_type"] = "change_owner"
        params["created_at__gte"] = self.now - datetime.timedelta(minutes=15)

        code = SMSLog.objects(params).count()
        if not code:
            return self.json_message(202, {}, "验证码错误")


        model.account_type = 0
        model.save()

        my = AccountToShop.objects(account = self.current_user, shop = self.shop).first()
        my.account_type = 1
        my.save()

        self.json_message(200)


class SendChangeOwnerCode(BaseHandler):
    @authenticated("m_account")
    def post(self):
        account = AccountToShop.objects(account = self.current_user, shop = self.shop).first()
        if account.account_type != 0:
            return self.json_message(201, {}, "无权限")

        code = randint(100000,999999)

        sms_log = SMSLog()
        sms_log.phone = self.current_user.account
        sms_log.code = "%d" % code
        sms_log.shop = self.shop
        sms_log.send_type = "change_owner"
        sms_log.created_ip = self.request.remote_ip
        sms_log.save()

        # celery 发送短信
        send_sms.delay(phone, code, "change_owner")

        self.json_message(200)

handlers = [
    (r"/main/api/account/create", Create),
    (r"/main/api/account/change_owner", ChangeOwner),
    (r"/main/api/account/send_change_owner_code", SendChangeOwnerCode),
    (r"/main/api/account/save", Save),
    (r"/main/api/account/remove", Remove),
    (r"/main/api/account/get_single", GetSingle),
    (r"/main/api/account/get_all", GetAll),
    (r"/main/api/account/check_limit", CheckLimit),
    (r"/main/api/account/get_modules", Modules),
    (r"/main/api/account/operate_log", operate_log)
]