#coding:utf-8
from celery import Celery

app = Celery('iyoudian')
app.config_from_object('tasks.config')
