#coding:utf-8
from tornado.web import authenticated
from util.handler import BaseHandler

from model.product_option import ProductOption

class GetAll(BaseHandler):
    @authenticated
    def get(self):
        res = ProductOption.objects(shop = self.shop)
        options = []
        for _var in res:
            _option = {
                "id":_var.entity_id,
                "name":_var.name,
                "default_value":"默认"
            }
            options.append(_option)

        data = {
            "page_count":0,
            "item_count":res.count(),
            "options":options
        }
        self.json_message(200, data)


class Create(BaseHandler):
    @authenticated
    def post(self):
        name = self.get_argument("name", "")
        try:
            res = ProductOption.objects.get(shop = self.shop, name = name)
            self.json_message(200, {"id":res.entity_id})
            return 
        except:
            pass

        option = ProductOption()
        option.name = name
        option.shop = self.shop
        option.save()

        self.json_message(200, {"id":option.entity_id})



class  GetOne(BaseHandler):
    @authenticated
    def get(self):
        id = self.get_argument("id", 0)
        id = int(id)

        try:
            res = ProductOption.objects.get(entity_id = id)
        except:
            raise HTTPError(500)

        data = {
            "_id":res.entity_id,
            "name":res.name,
            "options":res.options
        }

        self.json_message(200, data, "")



handlers = [
    (r"/main/api/option/get_all",GetAll),
    (r"/main/api/option/create", Create),
    (r"/main/api/option/get_one", GetOne)
]