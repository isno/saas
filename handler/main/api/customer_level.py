#coding:utf-8
from util.handler import BaseHandler,authenticated

from model.customer_level import CustomerLevel
from model.customer_level_credit import CustomerLevelCredit

class Credit(BaseHandler):
    @authenticated("")
    def get(self):
       
        credit = CustomerLevelCredit.objects(shop = self.shop).first()
        if credit:
            data = {"credit_exchange_ratio":credit.credit_exchange_ratio,"credit_enabled":credit.credit_enabled}
        else:
            data = {"credit_exchange_ratio":0, "credit_enabled":False}

        self.json_message(200, data)

    @authenticated("m_customer")
    def post(self):
        
        credit_enabled = self.get_argument("credit_enabled", "true")
        credit_exchange_ratio = self.get_argument("credit_exchange_ratio", "200")

        credit = CustomerLevelCredit.objects(shop = self.shop).first()
        if not credit:
            credit = CustomerLevelCredit()

        credit.shop = self.shop
        credit.credit_enabled = True if credit_enabled == "true" else False
        credit.credit_exchange_ratio = int(credit_exchange_ratio)
        credit.save()


        self.json_message(200)

class Create(BaseHandler):
    @authenticated("m_customer")
    def post(self):
        name = self.get_argument("name", "")
        credits = self.get_argument("credits", 0)
        avatar_id = self.get_argument("avatar_id", 0)
        discount = self.get_argument("discount", 0)
        image_path = self.get_argument("image_path", "")

        customer_level = CustomerLevel()
        customer_level.shop = self.shop
        customer_level.name = name
        customer_level.credits = int(credits)
        customer_level.discount = int(discount)
        customer_level.image_path = image_path

        customer_level.save()

        self.json_message(200, {"id":customer_level.entity_id})

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        levels = []
        count = CustomerLevel.objects(shop = self.shop).count()
        data = CustomerLevel.objects(shop = self.shop)
        for _level in data:
            level = {
                "id":_level.entity_id,
                "name":_level.name,
                "deletable":_level.deletable,
                "credits":_level.credits,
                "discount":_level.discount,
                "image_path":_level.image_path,
            }

            levels.append(level)

        data = {
            "page_count":1,
            "item_count":count,
            "is_empty":False if count else True,
            "customer_levels":levels
        }
        self.json_message(200, data)

class View(BaseHandler):
    @authenticated("")
    def get(self):
        id = int(self.get_argument("id",0))
        level = CustomerLevel.objects.get(shop = self.shop, entity_id = id)

        data = {
            "id":level.entity_id,
            "name":level.name,
            "deletable":level.deletable,
            "credits":level.credits,
            "discount":level.discount,
            "image_path":level.image_path
        }

        self.json_message(200, {"customer_level":data})

class Remove(BaseHandler):
    @authenticated("m_customer")
    def post(self):
        id = int(self.get_argument("id",0))
        CustomerLevel.objects.get(shop = self.shop, entity_id = id).delete()
        self.json_message(200)


class Save(BaseHandler):
    @authenticated("m_customer")
    def post(self):
        id = self.get_argument("id", 0)
        id = int(id)
        name = self.get_argument("name", "")
        credits = self.get_argument("credits", 0)
        avatar_id = self.get_argument("avatar_id", 0)
        discount = self.get_argument("discount", 0)
        image_path = self.get_argument("image_path", "")

        customer_level = CustomerLevel.objects.get(entity_id = id, shop = self.shop)
        customer_level.shop = self.shop
        customer_level.name = name
        customer_level.credits = int(credits)
        customer_level.discount = int(discount)
        customer_level.image_path = image_path
     

        customer_level.save()

        self.json_message(200, {"id":customer_level.entity_id})

        

handlers = [
    (r"/main/api/customer_level/credit", Credit),
    (r"/main/api/customer_level/create", Create),
    (r"/main/api/customer_level/get_all", GetAll),
    (r"/main/api/customer_level/get_single", View),
    (r"/main/api/customer_level/remove", Remove),
    (r"/main/api/customer_level/save", Save)
]