#coding:utf-8
import os
from bson.objectid import ObjectId
from util.handler import BaseHandler,authenticated


from model.product import Product
from model.product_image import ProductImage

class GetAll(BaseHandler):
    @authenticated("m_product")
    def get(self):
        pid = self.get_argument("pid", 0)
        pid = int(pid)

        cover_id = None
        images = []
        product_image = ProductImage.objects(product_id = pid, shop = self.shop)
        for _img in product_image:
            image = {
                "id":_img.entity_id,
                "sort_num":_img.sort_num,
                "alt":"",
                "product_id":pid,
                "created_at":_img.created_at.isoformat(),
                "updated_at":_img.updated_at.isoformat(),
                "image_path":_img.image_path
            }
            images.append(image)

            if _img.is_cover:
                cover_id = _img.entity_id

        images.sort(key=lambda obj:obj.get('sort_num'), reverse=False)  

        data = {
            "images":images,
            "share_image":[],
            "cover_id":cover_id
        }
        self.json_message(200, data)


class UploadSave(BaseHandler):
    @authenticated("m_product")
    def post(self):
        image_path = self.get_argument("image_path", "")
        image_name = self.get_argument("image_name", "")

        pid = self.get_argument("pid", "")
        pid = int(pid)

        

        count = ProductImage.objects(product_id = pid, shop = self.shop).count()

        product_image = ProductImage()
        product_image.sort_num =count+1
        product_image.image_path = image_path
        product_image.image_name = image_name
        product_image.shop = self.shop
        product_image.product_id = pid
        product_image.is_cover = True if count == 0 else False
        product_image.save()
        
        image = {
            "id":product_image.entity_id,
            "image_name":image_name,
            "sort_num":product_image.sort_num,
            "alt":"",
            "product_id":int(pid),
            "created_at":self.now.isoformat(),
            "updated_at":self.now.isoformat(),
            "image_path":image_path
        }
        data = {"image":image}
        self.json_message(200, data)


class Resort(BaseHandler):
    @authenticated("m_product")
    def post(self):
        pid = self.get_argument("pid", "")
        pid = int(pid)
        image_ids = self.get_argument("imgids", "")
        image_ids = image_ids.split(",")

        num = 1
        for _id in image_ids:
            ProductImage.objects(product_id = pid, entity_id = int(_id)).update(set__sort_num = num)
            num+=1

        self.json_message(200, {})

class SetAlt(BaseHandler):
    @authenticated("m_product")
    def post(self):
        imgid = self.get_argument("imgid", "")
        imgid = int(imgid)
        alt = self.get_argument("alt", "")

        ProductImage.objects(entity_id = int(imgid)).update(set__alt = alt)
        self.json_message(200, {})


class SetCover(BaseHandler):
    @authenticated("m_product")
    def post(self):
        imgid = self.get_argument("imgid", "")
        imgid = int(imgid)

        image = ProductImage.objects.get(entity_id = imgid)

        images = ProductImage.objects(product_id = image.product_id)
        for _image in images:
            _image.update(set__is_cover = False)

        image.is_cover = True
        image.save()

        

        self.json_message(200, {"product":{"v":1}})

class Remove(BaseHandler):
    @authenticated("m_product")
    def post(self):
        imgid = self.get_argument("imgid", "")
        imgid = int(imgid)
        ProductImage.objects.get(entity_id = imgid).delete()
        self.json_message(200, {})


handlers = [
    (r"/main/api/product_image/get_all", GetAll),
    (r"/main/api/product_image/upload_save", UploadSave),
    (r"/main/api/product_image/resort", Resort),
    (r"/main/api/product_image/set_alt", SetAlt),
    (r"/main/api/product_image/set_cover", SetCover),
    (r"/main/api/product_image/remove", Remove)
]