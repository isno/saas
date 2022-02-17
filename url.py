#coding:utf-8
from handler.main.site import handlers as site_handlers
from handler.main.center import handlers as center_handlers
from handler.main.sms_code import handlers as sms_code_handlers

from handler.main.captcha import handlers as captcha_handlers
from handler.main.auth import handlers as  auth_handlers

from handler.main.api import handlers as api_handlers
from handler.app import handlers as app_handlers
from handler.admin import handlers as admin_handlers
from handler.wo import handlers as wo_handlers


handlers = []


handlers.extend(app_handlers)
handlers.extend(admin_handlers)

handlers.extend(site_handlers)
handlers.extend(wo_handlers)

handlers.extend(center_handlers)
handlers.extend(captcha_handlers)
handlers.extend(auth_handlers)
handlers.extend(sms_code_handlers)
handlers.extend(api_handlers)



sub_handlers = []