#coding:utf-8
from __future__ import division
import requests
import math
from tornado.escape import json_decode

from model.customer import Customer
from model.account import Account
from model.shop import Shop
from model.account_to_shop import AccountToShop
from model.shipment_supplier import ShipmentSupplier
from model.shipment_template import ShipmentTemplate
from model.shipment_template_method import ShipmentTemplateMethod
from model.coupon import Coupon
from decimal import getcontext, Decimal

'''
shop = Shop.objects.get(entity_id = 1)

account_to_shop = AccountToShop.objects.get(shop = shop)
'''
from itertools import groupby
from operator import itemgetter

from random import choice
from string import ascii_uppercase as uc, digits as dg

from weixin.pay import WeixinPay, WeixinPayError

pay = WeixinPay('xx', 'xx', 'xx', 'notify_url', '../cert/apiclient_key.pem', '../cert/apiclient_cert.pem') # 后两个参数可选
try:
    out_trade_no = "test_001"
    product_id = "test_001"
    raw = pay.unified_order(trade_type="NATIVE", body=u"测试", out_trade_no=out_trade_no, total_fee=1, attach="other info", product_id = product_id)
    print raw
except WeixinPayError, e:
    print e.message
    pass