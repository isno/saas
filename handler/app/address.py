#coding:utf-8

from util.app_handler import AppHandler
from tornado.web import authenticated

from model.address import Address
from model.area import Area

class Addresses(AppHandler):
    @authenticated
    def get(self):
        data = Address.objects(customer = self.current_user)
        address = []
        for _var in data:
            codes = []
            titles = []
            if _var.area.level == 3:
                codes.append("%s" % _var.area.code)
                codes.append("%s" % _var.area.father.code)
                codes.append("%s" % _var.area.father.father.code)

                titles.append(_var.area.name)
                titles.append(_var.area.father.name)
                titles.append(_var.area.father.father.name)

            if _var.area.level == 2:
                codes.append("%s" % _var.area.code)
                codes.append("%s" % _var.area.father.code)
                titles.append(_var.area.name)
                titles.append(_var.area.father.name)

            if _var.area.level == 1:
                codes.append(_var.area.code)
                titles.append(_var.area.name)

            codes.reverse()
            titles.reverse()

            address.append({
                "id":_var.entity_id,
                "name":_var.name,
                "codes":codes,               
                "detail":_var.detail,
                "phone":_var.phone,
                "is_default":_var.is_default
                })

       

        self.write({"code":200, "addresses":address})
    @authenticated
    def post(self):
        id = self.get_argument("id", "0")
        name = self.get_argument("name", "")
        phone = self.get_argument("phone", "")
        city_code = self.get_argument("city_code", 0)
        detail = self.get_argument("detail", "")
        is_default = self.get_argument("is_default", "false")
        is_default = True if is_default  == "true" else False

        address = None
        if id and id.isdigit():
            address = Address.objects(entity_id = int(id), customer = self.current_user).first()
        
        if not address:
            address = Address()

        if is_default == True:
            Address.objects(customer = self.current_user, is_default = True).update(set__is_default = False)


        count = Address.objects(entity_id = int(id), customer = self.current_user).count()
        address.customer = self.current_user
        address.name = name
        address.phone = phone
        address.area = Area.objects.get(code = int(city_code))
        address.detail = detail
        address.is_default = True if not count else is_default
        address.save()

        self.json_message(200)


class Remove(AppHandler):
    @authenticated
    def post(self):
        id = self.get_argument("id")
        #Address.objects.get(entity_id = int(id), customer = self.current_user).delete()
        self.json_message(200)

handlers = [
    (r"/api/address", Addresses),
    (r"/api/address/remove", Remove)
]