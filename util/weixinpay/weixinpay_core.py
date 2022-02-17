# coding:utf-8
from .import weixinpay_config
from hashlib import md5
import uuid
import requests
import json
import xmltodict
import time


def make_payment_request(params_dict):
    """
    生成返回给客户端APP的数据参数
    """
    data = generate_request_data(params_dict)
    headers = {'Content-Type': 'application/xml'}
    res = requests.post(weixinpay_config.UNIFIED_ORDER_URL, data=data, headers=headers)
    if res.status_code == 200:
        result = json.loads(json.dumps(xmltodict.parse(res.content)))
        if result['xml']['return_code'] == 'SUCCESS':
            prepay_id = result['xml']['prepay_id']
            return generate_call_app_data(params_dict, prepay_id)
        else:
            return result['xml']['return_msg']
    return None


def generate_call_app_data(params_dict, prepay_id):
    """
    客户端APP的数据参数包装
    """
    request_order_info = {'appid': params_dict['appid'],
                          'partnerid': params_dict['mch_id'],
                          'prepayid': prepay_id,
                          'package': 'Sign=WXPay',
                          'noncestr': generate_nonce_str(),
                          'timestamp': str(int(time.time()))}
    request_order_info['sign'] = generate_sign(request_order_info)
    return request_order_info


def generate_request_data(params_dict):
    """
    生成统一下单请求所需要提交的数据
    """
    params_dict['nonce_str'] = generate_nonce_str()
    params_dict['sign'] = generate_sign(params_dict)
    return xmltodict.unparse({'xml': params_dict}, pretty=True, full_document=False).encode('utf-8')


def generate_nonce_str():
    """
    生成随机字符串
    """
    return str(uuid.uuid4()).replace('-', '')


def generate_sign(params):
    """
    生成md5签名的参数
    """
    if 'sign' in params:
        params.pop('sign')
    src = '&'.join(['%s=%s' % (k, v) for k, v in sorted(params.items())]) + '&key=%s' % weixinpay_config.KEY
    return md5(src.encode('utf-8')).hexdigest().upper()


def handle_wx_response_xml(params):
    """
    处理微信支付返回的xml格式数据
    """
    resp_dict = xmltodict.parse(params)['xml']
    return_code = resp_dict.get('return_code')
    if return_code == 'SUCCESS':  # 仅仅判断通信标识成功，非交易标识成功，交易需判断result_code
        if validate_sign(resp_dict):
            return resp_dict
    else:
        print('FAIL')
    return


def validate_sign(resp_dict):
    """
    验证微信返回的签名
    """
    if 'sign' not in resp_dict:
        return False
    wx_sign = resp_dict['sign']
    sign = generate_sign(resp_dict)
    if sign == wx_sign:
        return True
    return False


def generate_response_data(resp_dict):
    """
    字典转xml
    """
    return xmltodict.unparse({'xml': resp_dict}, pretty=True, full_document=False).encode('utf-8')
