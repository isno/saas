#coding:utf-8
from datetime import datetime

from mongoengine import *
from mongoengine import signals

from model.shop import Shop

from model.product_type import ProductType
from model.shipment_template import ShipmentTemplate
from model.product_variant import ProductVariant
from model.product_vendor import ProductVendor
from model.product_image import ProductImage

from es.product import ProductES

class Product(Document):
    meta = {
        "indexes":[
            "shop",
            "vendor",
            "is_deleted",
            "is_saved",
            "shipment_template"
        ],
        "strict":False,
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    shop = ReferenceField(Shop)

    meta_field = DictField(default = {})

    name = StringField(default = "")
    short_desc = StringField(default = "")

    visibility =  BooleanField(default = False) # 是否可见

    is_deleted =  BooleanField(default = False)


    desc = StringField(default = "") # 简介
    mobile_desc = StringField(default = "") # 移动端简介
    shipment_template  = ReferenceField(ShipmentTemplate)

    types  = ListField(ReferenceField(ProductType), default = [])

    options = ListField(DictField(), default = [])
    variants = ListField(ReferenceField(ProductVariant), default = [])

    vendor = ReferenceField(ProductVendor)
    images = ListField(ReferenceField(ProductImage), default = [])

    @property
    def image_urls(self):
        images = []
        for _image in self.images:
            images.append("http://iyoudian.shengyi8.com%s!400x400.jpg" % _image.image_path)
        return images


    @property
    def feature_image(self):
        return "http://iyoudian.shengyi8.com%s!full.jpg" % self.image_path
    


    @property
    def feature_image_asset(self):
        image = None
        for _image in self.images:
            if _image.is_cover:
                image = _image.image_path
                break
        if  image:
            return image
        for _image in self.images:
            return _image.image_path
        return image


    @property
    def price_min(self):
        prices = []
        for _var in self.variants:
            if not _var:
                continue
            prices.append(_var.price)
        return min(prices) if prices else 0

    @property
    def price_max(self):
        prices = []
        for _var in self.variants:
            prices.append(_var.price)
        return max(prices) if prices else 0


    @property
    def image_path(self):
        image = None
        for _image in self.images:
            if not _image:
                continue
            if _image.is_cover:
                image = _image.image_path
                break
        if  image:
            return image
        for _image in self.images:
            return _image.image_path
        return "/uploads/2022/01/11/46a8eb7012b19574952c6edff59dd640.png"

    @property
    def point_min(self):
        points = []
        for _var in self.variants:
            points.append(_var.point)
        return min(points) if points else 0

    @property
    def point_max(self):
        points = []
        for _var in self.variants:
            points.append(_var.point)
        return max(points) if points else 0

    @property
    def variant_count(self):
        return len(self.variants)

    @property
    def stock_sum(self):
        stock_sum = 0
        for _var in self.variants:
            stock_sum += _var.stock
        return stock_sum


    display_sale  = IntField(default = 0)
    is_saved =  BooleanField(default = False)

    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)

    @property
    def simple_data(self):
        data = {
            "id":self.entity_id,
            "name":self.name,
            "created_at":self.created_at.isoformat(),
            "short_desc":self.short_desc,
            "visibility":self.visibility,
            "price_max":self.price_max,
            "price_min":self.price_min,
            "stock_sum":self.stock_sum,
            "variant_count":self.variant_count,
            "image_path":self.image_path
        }
        # 计算skus
        options = []
        skus = []
        keys = []
        i = 0
        for _sku in  self.variants:
            # 第一个sku
            if _sku.option_1_name:
                if _sku.option_1_name in  keys:
                    _index = keys.index(_sku.option_1_name)
                    options[_index]["values"].append({"name":_sku.option_1})
                else:
                    keys.append(_sku.option_1_name)
                    if _sku.option_1_name:
                        options.append({"name":_sku.option_1_name,"k_s":0,"values":[{"name":_sku.option_1}]})

            # 第二个sku
            if _sku.option_2_name:
                if _sku.option_2_name in  keys:
                    _index = keys.index(_sku.option_2_name)
                    options[_index]["values"].append({"name":_sku.option_2})
                else:
                    keys.append(_sku.option_2_name)
                    if _sku.option_2_name:
                        options.append({"name":_sku.option_2_name,"k_s":1,"values":[{"name":_sku.option_2}]})


            # 第三个sku
            if _sku.option_3_name:
                if _sku.option_3_name in keys:
                    _index = keys.index(_sku.option_3_name)
                    options[_index]["values"].append({"name":_sku.option_3})
                else:
                    keys.append(_sku.option_3_name)
                    if _sku.option_3_name:
                        options.append({"name":_sku.option_3_name,"k_s":2,"values":[{"name":_sku.option_3}]})


            

            _sku_item = {"id":_sku.entity_id,"price":_sku.price,"stock":_sku.stock}
            if _sku.option_1_name:
                _sku_item[0] =  _sku.option_1
            
            if _sku.option_2_name:
                _sku_item[1] =  _sku.option_2

            if _sku.option_3_name:
                _sku_item[2] =  _sku.option_3

            skus.append(_sku_item)




        data["options"] = options
        data["skus"] = skus


        return data

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        p = ProductES()
        p.shop_id = document.shop.entity_id
        p.entity_id = document.entity_id
        p.name = document.name
        
        p.vendor = 0 if not document.vendor else document.vendor.entity_id
        p.types = [v.entity_id for v in document.types]


        p.price = {"gte":document.price_min,"lte":document.price_max}
        p.point = {"gte":document.point_min,"lte":document.point_max}

        p.stock = document.stock_sum

        p.visibility = document.visibility
        p.created_at = document.created_at
        p.is_deleted = document.is_deleted
        p.save()

signals.post_save.connect(Product.post_save, sender=Product)




    