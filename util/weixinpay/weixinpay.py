# coding:utf-8
from .import weixinpay_config
from .import weixinpay_core


def make_payment_info(notify_url=None, out_trade_no=None, total_fee=None):
    order_info = {'appid': weixinpay_config.APP_ID,
                  'mch_id': weixinpay_config.MCH_ID,
                  'device_info': 'WEB',
                  'nonce_str': '',
                  'sign_type': weixinpay_config.SIGN_TYPE,
                  'body': weixinpay_config.BODY,
                  'out_trade_no': str(out_trade_no),
                  'total_fee': total_fee,
                  'spbill_create_ip': weixinpay_config.SPBILL_CREATE_IP,
                  'notify_url': notify_url,
                  'trade_type': 'APP'}
    return order_info


def make_payment_request_wx(notify_url, out_trade_no, total_fee):
    """
    微信统一下单，并返回客户端数据
    :param notify_url: 回调地址
    :param out_trade_no: 订单编号
    :param total_fee: 充值金额
    :return: app所需结果数据
    """
    if float(total_fee) < 0.01:
        raise Exception('充值金额不能小于0.01')
    payment_info = make_payment_info(notify_url=notify_url, out_trade_no=out_trade_no, total_fee=total_fee)
    res = weixinpay_core.make_payment_request(payment_info)
    return res


def weixinpay_call_back(args):
    """
    微信支付回调
    :param request: 回调参数
    :return:
    """
    # 验证平台签名
    resp_dict = weixinpay_core.handle_wx_response_xml(args)
    if resp_dict is None:
        raise Exception('参数错误')
    return resp_dict


def weixinpay_response_xml(params):
    """
    生成交易成功返回信息
    """
    return_info = {
        'return_code': params,
        'return_msg': 'OK'
    }
    return weixinpay_core.generate_response_data(return_info)
