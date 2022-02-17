#coding:utf-8
from tornado.escape import json_encode
from util.app_handler import AppHandler

from model.area import Area
from model.product import Product

from data.product import Product as ProductData

from es.product import ProductES


class ProductHandler(AppHandler):
    def get(self, entity_id):
        
        product = Product.objects(entity_id = int(entity_id)).first()
        if not product:
            return self.json_message(201)

        data = {}
        '''
        计算sku options
        '''
        options = []
        k = 1
        for _var in product.options:
            _values = []
            for _value in _var.get("values", []):
                _values.append({"name":_value})
            options.append({"k_s":"option_%s" % k,"name":_var.get("name", ""),"values":_values})
            k+=1

        
        variants = []

        sku_keys = []

        for _var in product.variants:
            _options = {}
            if _var.option_1:
                _options["option_1"] = _var.option_1
            if _var.option_2:
                _options["option_2"] = _var.option_2
            if _var.option_3:
                _options["option_3"] = _var.option_3

            _variant = {"id":_var.entity_id,"price":_var.price,"stock":_var.stock}
            _variant.update(_options)

            variants.append(_variant)

        if variants:
            data["variant"] = {"price":variants[0]["price"], "stock":variants[0]["stock"]}
        '''
        template 运费模板
        '''
        data["shipment"] = {}
        if product.shipment_template:
            data["shipment"]["id"] = product.shipment_template.entity_id
            if product.shipment_template.shipment_area_post:
                areas = ""
                area = Area.objects(code = product.shipment_template.shipment_area_post).first()
                if area and not area.father:
                    areas = area.name
                if area and area.father:
                    areas = area.father.name
                    
                data["shipment"]["area"] = areas
            express = []
            for rule in product.shipment_template.rules:
                express.append(rule.express)
            data["shipment"]["express"] = " ".join(express)




        data["name"] = product.name
        data["options"] = options
        data["variants"] = variants
        data["price"] = "￥%.2f" % (product.price_min/100.0)
        data["images"] = product.image_urls
        data["cover_image"] = "%s!400x400.jpg" % product.feature_image
        data["desc"] = product.mobile_desc

        data["sku"] = {"keys":[], "contents":[]}

        return self.json_message(200, data)

        data = ProductData(product)
        self.render("app/product.htm", data = json_encode(data.json), product = data)



class Products(AppHandler):
    def get(self):

        size = self.get_argument("size", 15)
        size = int(size)
        page = self.get_argument("page",1)
        page = max(int(page),1)
        page_start = (page-1)*size


        product_type_id = self.get_argument("product_type_id", "")


        s = ProductES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)
        s = s.query("term", visibility = True)

        if product_type_id:
            s = s.query("term", types = int(product_type_id))

        s = s[page_start:page_start+size]

        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))

        products = []
        datas = Product.objects(entity_id__in = ids)
        for _data in datas:
            products.append(_data.simple_data)

        self.json_message(200, products)


handlers = [
    (r"/api/product/(\w+)", ProductHandler),
    (r"/api/products", Products)
]