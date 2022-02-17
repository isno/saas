#coding:utf-8
import copy
from bson.objectid import ObjectId
from datetime import timedelta,datetime
from tornado.escape import json_decode
from util.handler import BaseHandler,authenticated


from model.order_shipment import OrderShipment
from model.shipment_supplier import ShipmentSupplier

class Save(BaseHandler):
    @authenticated("")
    def post(self):
        id = self.get_argument("id", 0) #订单ID
        ship_no = self.get_argument("ship_no", 0)
        ssid    = self.get_argument("ssid", 0)
        ssid = int(ssid)
        scsname = self.get_argument("scsname", "")

        data = OrderShipment.objects(entity_id = int(id), shop = self.shop).first()
        if not data:
            return self.json_message(201, {}, "数据未找到")

        if ssid <2:
            data.ssid = 1
            data.sscode = "selfserver"
            data.ssname = "无需物流"
            data.ship_no = ""

        else:
            supplier = ShipmentSupplier.objects().get(entity_id = ssid)
            data.ssid = ssid
            data.sscode = supplier.code
            data.ssname = supplier.name
            data.ship_no = ship_no
        data.save()


        self.json_message(200, {}, "")


class Send(BaseHandler):
    @authenticated("")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)
        shipment = OrderShipment.objects(entity_id = id, shop = self.shop).first()
        if not shipment:
            return self.json_message(201, {}, "订单未找到")
        shipment.status = 1
        shipment.auto_received_at = self.now + timedelta(days=15)
        shipment.save()

        shipments = OrderShipment.objects(order = shipment.order)
        is_all_send = True
        for _ship in shipments:
            if _ship.status == 0:
                is_all_send = False
                break

        shipment.order.shipment_status = 1 if is_all_send else 3 # 部分发货
        shipment.order.save()



        self.json_message(200)

class MultiSend(BaseHandler):
    @authenticated("")
    def post(self):
        ids = self.get_argument("ids","[]")
        ids = json_decode(ids)

        for _id in ids:
            shipment = OrderShipment.objects(entity_id = _id, shop = self.shop).first()
            if not shipment:
                continue
            shipment.auto_received_at = self.now + timedelta(days=15)
            shipment.status = 1
            shipment.save()

        shipments = OrderShipment.objects(order = shipment.order)
        is_all_send = True
        for _ship in shipments:
            if _ship.status == 0:
                is_all_send = False
                break

        shipment.order.shipment_status = 1 if is_all_send else 3 # 部分发货
        shipment.order.save()

        self.json_message(200)
        
class Change(BaseHandler):
    @authenticated("")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)
        auto_received_at = self.get_argument("auto_received_at", "")
        shipment = OrderShipment.objects(entity_id = id, shop = self.shop).first()
        if not shipment:
            return self.json_message(201, {}, "订单未找到")
        auto_received_at = datetime.strptime(auto_received_at,'%Y-%m-%d')
        shipment.auto_received_at = auto_received_at
        shipment.save()

        self.json_message(200)



class Merge(BaseHandler):
    @authenticated("")
    def post(self):
        ids = self.get_argument("ids","[]")
        ids = json_decode(ids)
        ship_type = self.get_argument("ship_type", 0)
        ship_type = int(ship_type)

        ships = []
        ship = None
        res = OrderShipment.objects(entity_id__in = ids, shop = self.shop)
        for _ship in res:
            if not ship:
                ship = _ship
            else:
                ship.products = ship.products + _ship.products
                _ship.delete()

        ship.ship_type = ship_type
        ship.save()
    
        self.json_message(200)

class Split(BaseHandler):
    @authenticated("")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)

        ship_type = self.get_argument("ship_type", 0)
        ship_type = int(ship_type)

        shipment = OrderShipment.objects(entity_id = id, shop = self.shop).first()
        if not shipment:
            return self.json_message(201, {}, "订单未找到")

        products = copy.deepcopy(shipment.products)
        i = 0
        for _product in products:
            if i ==0:
                ship = shipment
                ship.serial_number = "0%d" % i
                ship.products = [_product]
                ship.ship_type = ship_type
                ship.save()
            else:
                ship =  OrderShipment()
                ship.shop = shipment.shop
                ship.ship_type = ship_type
                ship.order = shipment.order
                ship.serial_number = "0%d" % i
                ship.status = shipment.status
                ship.ssid = shipment.ssid 
                ship.sscode = shipment.sscode
                ship.ship_type = shipment.ship_type
                ship.ship_no = shipment.ship_no
                ship.amount = shipment.amount
                ship.auto_received_at = shipment.auto_received_at
                ship.products = [_product]
                ship.save()

            
            i+=1


        self.json_message(200)



handlers = [
    (r"/main/api/shipment/save", Save),
    (r"/main/api/shipment/change", Change),
    (r"/main/api/shipment/send", Send),
    (r"/main/api/shipment/split", Split),
    (r"/main/api/shipment/merge", Merge),
    (r"/main/api/shipment/multi_send", MultiSend)

]