#coding:utf-8
import math
from tornado.escape import json_decode
from util.handler import BaseHandler

from model.shipment_supplier import ShipmentSupplier


class GetAll(BaseHandler):
    def get(self):
        page = self.get_argument("page", 1)
        page = max(1, int(page))
        page_start = (page-1)*10

        shipment_suppliers = []
        count = ShipmentSupplier.objects().count()
        data = ShipmentSupplier.objects().skip(page_start).limit(10)
        for _var in data:
            shipment_suppliers.append({
                "id":_var.entity_id,
                "code":_var.code,
                "desc":_var.name
            })

        page_count = math.ceil(count/10.0)
        data = {
            "page_count":int(page_count),
            "item_count":count,
            "shipment_suppliers":shipment_suppliers
        }

        self.json_message(200, data)

handlers = [
    (r"/main/api/shipment_supplier/get_all",GetAll )
]
