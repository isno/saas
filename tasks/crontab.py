#coding:utf-8
from datetime import datetime
from model.sms_log import SMSLog
from model.logins import Logins

from tasks import app

'''
每天凌晨定时删除短信日志，防止数据库过大
'''
@app.task
def clear_sms_log():
    start = datetime.now + timedelta(minutes=15)
    SMSLog.objects(created_at__lte = start).delete()

'''
每日清除权限错误表
'''
@app.task
def clear_auth_log():
    Logins.objects().delete()