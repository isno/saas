#coding:utf-8
import time
from tasks import app
from tornado.escape import json_encode

from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest

client = AcsClient('', '', '')


@app.task
def send_sms(phone, code, type):
    request = CommonRequest()
    request.set_accept_format('json')
    request.set_domain('dysmsapi.aliyuncs.com')
    request.set_method('POST')
    request.set_protocol_type('https') # https | http
    request.set_version('2017-05-25')
    request.set_action_name('SendSms')

    request.add_query_param("TemplateParam", json_encode({"code":code}))
    request.add_query_param('RegionId', "cn-hangzhou")
    request.add_query_param('PhoneNumbers', phone)
    request.add_query_param('SignName', "爱优店")
    request.add_query_param('TemplateCode', "SMS_126355001")

    response = client.do_action(request)

