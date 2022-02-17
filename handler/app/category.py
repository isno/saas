#coding:utf-8

from util.app_handler import AppHandler

from model.product_type import ProductType

class Categories(AppHandler):
    def get(self):
        categories = []
        datas = ProductType.objects(shop = self.shop, is_deleted = False)
        for _data in datas:
            categories.append({"id":_data.entity_id, "name":_data.name})

        self.json_message(200, categories)

handlers = [
    ("/api/categories", Categories)
]