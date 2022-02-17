#coding:utf-8
import math
from datetime import  datetime
from util.handler import BaseHandler,authenticated
from model.address import Address
from model.customer import Customer

from es.customer import CustomerES

class GetAll(BaseHandler):
    @authenticated("")
    def get(self):
        size = self.get_argument("size", 30)
        page = self.get_argument("page",1)
        customer_level_id = self.get_argument("customer_level_id", "")
        order_earlier = self.get_argument("order_earlier", "")
        order_later = self.get_argument("order_later", "")

        count_smaller = self.get_argument("count_smaller", "")
        count_greater = self.get_argument("count_greater", "")
        point_smaller = self.get_argument("point_smaller", "")
        point_greater = self.get_argument("point_greater", "")

        amount_smaller = self.get_argument("amount_smaller", "")
        amount_greater = self.get_argument("amount_greater", "")

        create_earlier = self.get_argument("amount_greater", "")
        create_later = self.get_argument("create_later", "")
        search_type = self.get_argument("search_type", "0")
        search = self.get_argument("search", "")
        mobile = self.get_argument("mobile", "")

        page = max(int(page),1)

        size = int(size)
        page_start = (page-1)*size

        s = CustomerES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        if customer_level_id:
            s = s.query("term", level_id = int(customer_level_id))
        if search and search_type == "0":
            s = s.query("term", name = search)
        if mobile and search_type == "1":
            s = s.query("term", account = mobile)

        if order_earlier:
            order_earlier = datetime.strptime(order_earlier,'%Y-%m-%dT%H:%M:%S+08:00')
            s = s.filter("range", last_order_at={"gte":order_earlier})
        if order_later:
            order_later = datetime.strptime(order_later,'%Y-%m-%dT%H:%M:%S+08:00')
            s = s.filter("range", last_order_at={"lte":order_later})
        if count_smaller:
            s = s.filter("range", trade_total_count={"gte":int(count_smaller)})
        if count_greater:
            s = s.filter("range", trade_total_count={"lte":int(count_greater)})

        if point_smaller:
            s = s.filter("range", credit={"gte":int(point_smaller)})
        if point_greater:
            s = s.filter("range", credit={"lte":int(point_greater)})

        if amount_smaller:
            s = s.filter("range", trade_total_amount={"gte":int(amount_smaller)})
        if amount_greater:
            s = s.filter("range", trade_total_amount={"lte":int(amount_greater)})

        if create_earlier:
            create_earlier = datetime.strptime(create_earlier,'%Y-%m-%dT%H:%M:%S.%f+08:00')
            s = s.filter("range", created_at={"gte":create_earlier})
        if create_later:
            create_later = datetime.strptime(create_later,'%Y-%m-%dT%H:%M:%S.%f+08:00')
            s = s.filter("range", created_at={"lte":create_later})


        s = s[page_start:page_start+size]

        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))

        res = Customer.objects(entity_id__in = ids)

        users = []
        for _var in res:
            path = _var.level.image_path if _var.level else ""
            _user = {
                "id":_var.entity_id,
                "name":_var.name,
                "account":_var.account,
                "avatar_path":_var.avatar_url,
                "regist_source":6,
                "trade_total_count":0,
                "trade_total_amount":10000,
                "customer_level_id":_var.level.entity_id if _var.level else 0 ,
                "customer_level_name":_var.level.name if _var.level else "",
                "customer_level_icon":"%s%s!16x16.jpg" % (self._asset_host, path),
                "created_at":_var.created_at.isoformat()
            }
            users.append(_user)

        page_count = int(math.ceil(float(count)/size))
        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":True if count ==0 else False,
            "customers":users
        }
    
        self.json_message(200, data)


class customers_for_coupon(BaseHandler):
    @authenticated("")
    def get(self):
        users = []
        count = Customer.objects(shop = self.shop).count()
        res = Customer.objects(shop = self.shop)
        for _user in res:
            users.append(_user.simple_data)
        
        data = {
            "page_count":1,
            "item_count":count,
            "is_empty":True if count ==0 else False,
            "customers":users
        }
        self.json_message(200, data)

class View(BaseHandler):
    @authenticated("")
    def get(self):
        id = self.get_argument("id", 0)
        entity_id = int(id)

        customer = Customer.objects(shop = self.shop, entity_id = entity_id).first()
        if not customer:
            return self.json_message(201, {}, "顾客不存在")

        data = {
            "customer":{
                "id":customer.entity_id,
                "name":customer.name,
                "account":customer.account,
                "birthday":customer.birthday,
                "trade_total_amount":0,
                "trade_count":0,
                "total_point":0,
                "accept_marketing":customer.accept_marketing,
                "created_at":customer.created_at.isoformat(),
                "last_in":customer.last_logined_at.isoformat(),
                "avatar_path": customer.avatar_url,
                "customer_level":{
                    "id":customer.level.entity_id,
                    "name":customer.level.name,
                    "icon":"%s%s!16x16.jpg" % (self._asset_host, customer.level.image_path),
                }
            }
        }
        self.json_message(200, data)

class Addresses(BaseHandler):
    @authenticated("")
    def get(self):
        uid = self.get_argument("customer_id", 0)
        customer = Customer.objects(entity_id = int(uid), shop = self.shop).first()
        if not customer:
            return self.json_message(201, "未找到相关账户")

        data = Address.objects(customer = customer, is_deleted = False)
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
                "country":"中国",
                "country_code":"CN",
                "district_code":"%s" % _var.area.code,
                "location_full_titles":",".join(titles),
                "location_full_codes":",".join(codes),
                "detail":_var.detail,
                "phone":_var.phone,
                "is_default":_var.is_default
                })
        self.json_message(200, {"addresses":address})


class RewardPointDetails(BaseHandler):
    @authenticated("")
    def get(self):
        data = {
            "reward_point_details":[],
            "item_count":0,
            "page_count":0,
            "is_empty":True
        }
        self.json_message(200,data)


class GetCoupons(BaseHandler):
    @authenticated("m_customer")
    def get(self):
        data = {
            "item_count":0,
            "page_count":0,
            "coupons":[]
        }
        self.json_message(200, data)

class CreditRecordDetails(BaseHandler):
    @authenticated("")
    def get(self):

        data = {
            "item_count":0,
            "page_count":0,
            "credit_record_details":[]
        }
        self.json_message(200, data)

handlers = [
    (r"/main/api/customer/get_all", GetAll),
    (r"/main/api/customer/customers_for_coupon", customers_for_coupon),
    (r"/main/api/customer/get_single", View),
    (r"/main/api/customer/get_coupons", GetCoupons),
    (r"/main/api/customer/credit_record_details", CreditRecordDetails),
    (r"/main/api/customer/get_addresses", Addresses),
    (r"/main/api/customer/reward_point_details", RewardPointDetails)
]