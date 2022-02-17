#coding:utf-8
from datetime import timedelta
from celery.schedules import crontab

BROKER_URL = 'redis://localhost:6379/0'
# 中间件 地址
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'


CELERY_TIMEZONE = "Asia/Shanghai"

CELERYD_CONCURRENCY = 2
CELERYD_FORCE_EXECV = True
CELERYD_MAX_TASKS_PER_CHILD = 100

'''
任务列表
'''
CELERY_IMPORTS = [
   'tasks.sms',
   'tasks.crontab',
   'tasks.shop',
   'tasks.coupon'
]


CELERYBEAT_SCHEDULE = {
    'clear_sms_log': {
        'task': 'tasks.crontab.clear_sms_log',
        'schedule': crontab(hour=0,minute=0)
    },
    'clear_auth_log':{
        'task': 'tasks.crontab.clear_auth_log',
        'schedule': crontab(hour=0,minute=0)
    }
}
