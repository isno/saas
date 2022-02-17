#coding:utf-8
from model.product_option import ProductOption

class Product:
    def __init__(self, data):
        self.handle = data.handle
        self.name = data.name
        self.short_desc = data.short_desc

        self.content_html = data.desc
        self.price_varies = True if len(data.variants)>1 else False
        
        '''
        计算最低价
        '''
        min_price = 0
        for _var in data.variants:
            if min_price == 0:
                min_price = _var.price
            else:
                if min_price >= _var.price:
                    min_price = _var.price
        

        self.price = min_price
        self.min_price = min_price

        '''
        计算最高价
        '''
        max_price = 0
        for _var in data.variants:
            if max_price < _var.price:
                max_price = _var.price
        
        self.price_max = max_price
    
        self.compare_price_varies = True if len(data.variants)>1 else False


        self.compare_price_max = self._compare_price_max(data)
        self.compare_price_min = self._compare_price_min(data)


        self.available = True
        self.sale = data.display_sale
        self.page_url = "/product/%s" % data.handle
      
        self.content_html = data.desc

        self.feature_image =  "http://iyoudian.shengyi8.com%s" % self._feature_image(data)
        self.images = self._images(data)

        self.options = self._options(data)

        self.variants = self._variants(data)



    def _options(self, data):
        options = []
        i = 1
        for _option in data.options:
            option = ProductOption.objects.get(name=_option.get("name"))
            _option["id"] = option.entity_id
            _option["position"] = i
            options.append(_option)
            i+=1
        return options

    def _variants(self, data):

      
        variants = []
        for _var in data.variants:
            _options = []
            i = 1
            for _option  in [_var.option_1, _var.option_2, _var.option_3]:
                if not _option:
                    break
                _options.append({
                    "option_id":self.options[i-1]["name"],
                    "option_value":_option,
                    "position":i
                    })
                i+=1

            variants.append({
                "id":_var.entity_id,
                "option_1":_var.option_1,
                "option_2":_var.option_2,
                "option_3":_var.option_3,
                "stock":_var.stock,
                "price":_var.price,
                "compare_price":_var.compare_price,
                "weight":_var.weight,
                "volume":_var.volume,
                "barcode":_var.barcode,
                "stock_type":_var.stock_type,
                "point":_var.point,
                "sale":0,
                "options":_options,
                "feature_image":None
                })
        return variants



    def _compare_price_max(self, data):
        max_price = 0
        for _var in data.variants:
            if max_price < _var.compare_price:
                max_price = _var.compare_price
        return max_price
    
    def _compare_price_min(self, data):
        min_price = 0
        for _var in data.variants:
            if min_price == 0:
                min_price = _var.compare_price
            else:
                if min_price >= _var.compare_price:
                    min_price = _var.compare_price
        return min_price

   

    def _feature_image(self, data):
        image = None
        for _image in data.images:
            if _image.is_cover:
                return _image.asset.file_path
                break
        for _image in self._data.images:
            return _image.asset.file_path


    def _images(self, data):
        _images = []
        for _image in data.images:
            _images.append("http://iyoudian.shengyi8.com%s" % _image.asset.file_path)
        return _images
    

    @property
    def json(self):
        return self.__dict__





        

