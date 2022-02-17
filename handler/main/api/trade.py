#coding:utf-8

from tornado.web import authenticated
from util.handler import BaseHandler

from model.order import Order
from model.order_shipment import OrderShipment
from model.order_note import OrderNote

class GetAll(BaseHandler):
    @authenticated
    def get(self):

        trades = []
        res = Order.objects(shop = self.shop)
        for _order in res:
            trade = {
                "id":_order.no,
                "no":_order.no,
                "created_at":_order.created_at.isoformat(),
                "status":_order.status,
                "gateway":"wppay",
                "device":_order.device,
                "shipment_status":_order.shipment_status,
                "status_v2":"closed",
                "address":_order.address,
                "total_amount":100,
            }
            trades.append(trade)
        '''
        trades = [
            {   
            "id":111,
            "pay_at":"2018-07-27T12:54:48.229+08:00",
            "shipment_at":None,
            "receive_at":None,
            "close_at":"2018-07-27T23:00:27.304+08:00",
            "customer_id":100,
            "customer_name":"isnono",
            "consignee_name":"王伟峰",
            "status_v2":"closed",
            "unique_no":"adadasdasd",
            "mobile":"13764891668",
            "total_amount":1,
            "currency":None,
            "status":"4",
            "payment_status":2,
            "shipment_status":0,
            "created_at":"2018-07-27T12:53:49.254+08:00",
            "gateway":"alipay",
            "collect_by_yhsd":True,
            "device":"pc",
            "is_star":False,
            "new_status":8,
            "note_cnt":0
            }
        ]
        '''

        data = {
            "page_count":0,
            "item_count":1,
            "is_empty":False,
            "trades":trades,
          
        }
        self.json_message(200, data)


class View(BaseHandler):
    @authenticated
    def get(self):
        no = self.get_argument("id", "")
        order = Order.objects( no = no).first()
        if not order:
            return self.json_message(201, {}, "订单未找到")

        data = {
            "is_star":order.is_star,
            "auto_total_amount":1,
            "total_amount":1,
            "created_at":order.created_at.isoformat(),
            "no":order.no,
            "device":order.device,
            "history":[],
            "preferential_records":[],
            "item_amount":order.item_amount,
            "address":order.address_simple_data,
            "notes":order.notes_simple_data,
            "status":order.status,
            "customer":order.customer.simple_data,
            "payment_status":2, # 0 未付款, 2 付款成功， 3付款超时
            "customer_ip":order.created_ip,
            "shipments":[],
            "payment_method":order.payment_method
        }
        if order.status == "4":
            data["request_refund_reason"] = "商家直接退单"

        shipments = OrderShipment.objects(order = order)
        for _ship in shipments:
            data["shipments"].append(_ship.simple_data)

        return self.json_message(200, {"trade":data})

class NoteSave(BaseHandler):
    @authenticated
    def post(self):
        no = self.get_argument("id", 0)
        text = self.get_argument("note", "")

        order = Order.objects(no = no, shop = self.shop).first()
        if not order:
            return self.json_message(201, {}, "订单未找到")

        node = OrderNote()
        node.user = self.current_user
        node.note = text
        node.save()

        order.notes.append(node)
        order.save()
        self.json_message(200)

class get_single_capture(BaseHandler):
    @authenticated
    def get(self):
        id = self.get_argument("id", 0)

class Refund(BaseHandler):
    def post(self):
        pass

class saveTotalAmount(BaseHandler):
    def post(self):
        id = self.get_argument("id", 0)
        total_amount = self.get_argument("total_amount", 0)
        total_amount = int(total_amount)

        order = Order.objects.get(entity_id = int(id))
        order.is_total_amount = True
        order.total_amount = total_amount
        order.save()

        self.json_message(200)


handlers = [
    (r"/main/api/trade/get_all", GetAll),
    (r"/main/api/trade/get_single", View),
    (r"/main/api/trade/save_total_amount", saveTotalAmount),
    (r"/main/api/trade/save_note", NoteSave),
    (r"/main/api/trade/get_single_capture", get_single_capture),
]