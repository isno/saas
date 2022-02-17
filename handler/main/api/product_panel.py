#coding:utf-8
import math
from tornado.escape import  json_decode
from util.handler import BaseHandler,authenticated

from model.product import Product
from model.product_variant import ProductVariant
from model.product_image import ProductImage

from es.product import ProductES
from elasticsearch_dsl.search import Search, Q, A

class Products(BaseHandler):
    @authenticated("")
    def post(self):
        search = self.get_argument("search", "")
        only_selected = self.get_argument("only_selected", "false")

        product_ids = self.get_argument("products", "[]")
        product_ids = json_decode(product_ids)

        page = self.get_argument("page", "1")
        page = int(page)
        size = self.get_argument("size", "30")
        size = int(size)

        page = max(1, page)
        page_start = (page-1)*size

        selected_ids = []
        for _var in product_ids:
            selected_ids.append(_var.get("id"))
     
        s = ProductES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)
        if search:
            s = s.query("match", name=search)
        if only_selected == "true":      
            s = s.query('terms', entity_id=selected_ids)
        s = s[page_start:page_start+size]
        
        count = s.count()
        resp = s.execute()
        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))
            
        products = []
        res = Product.objects(entity_id__in = ids)
        for _var in res:
            products.append(_var.simple_data)
            continue
            products.append({
                    "id":_var.entity_id,
                    "top":False,
                    "top_at":None,
                    "image_path":_var.image_path,
                    "name":_var.name,
                    "visibility":_var.visibility,
                    "created_at":_var.created_at.isoformat(),
                    "selected":False if _var.entity_id not in product_ids else True,
                    "price_min":_var.price_min,
                    "price_max":_var.price_max,
                    "stock_sum":_var.stock_sum,
                    "variant_count":_var.variant_count,
                    "types":["%s" % ptype.name for ptype in _var.types],
                    "vendors":None
                })

        data = {}
        data["page_count"] =  int(math.ceil(float(count)/size))
        data["item_count"] = count
        data["item_selected_count"] = len(product_ids)
        data["products"] = products
        self.json_message(200, data)


handlers = [
    (r"/main/api/product/get_all_panel", Products)
]