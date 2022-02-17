#coding:utf-8
import datetime
from util.handler import BaseHandler
from model.customer_enter import CustomerEnter
from model.sms_log import SMSLog

class Index(BaseHandler):
    def get(self):
        self.render("index.htm")

class Demo(BaseHandler):
    def get(self):
        self.write("9fca6994b636f0c125e94cba1412d1d7611d3ced")

class Products(BaseHandler):
    def get(self, stype):
        self.render("products/%s.htm" % stype)

class Pages(BaseHandler):
    def get(self, stype):
        self.render("pages/%s.htm" % stype)

class Compensate(BaseHandler):
    def get(self):
        self.render("compensate.htm")

class ErrorPage(BaseHandler):
    def get(self):
        self.render("error_page.htm")

class Guestbook(BaseHandler):
    def get(self):
        self.render("brand_enter.htm")
    def post(self):
        valid_code = self.get_argument("valid_code", "")
        phone = self.get_argument("phone", "")
        brand = self.get_argument("brand", "")

        params = {}
        params["phone"] = phone
        params["code"] = valid_code
        params["send_type"] = "entry"
        params["created_at__gte"] = datetime.datetime.now() - datetime.timedelta(minutes=15)

       


        model = CustomerEnter()
        model.phone = phone
        model.brand = brand
        model.created_ip = self.request.remote_ip
        model.save()
        self.json_message(200)

class Isno(BaseHandler):
    def get(self):
        datas = []
        model = CustomerEnter.objects()
        for _var in model:
            datas.append({
                "name":_var.name,
                "phone":_var.phone,
                "brand":_var.brand
                })

        self.json_message(200, datas)


handlers = [
    (r"/", Index),
    (r"/2e485503a3caf71482272a198feb7a6f.txt", Demo),
    (r"/isno", Isno),
    (r"/error", ErrorPage),
    (r"/(contact_us|pricing|customers|jobs)", Pages),
    (r"/products/(store|weapp|coupon|pay|gift|card)", Products),
    (r"/brand/enter", Guestbook),
    (r"/compensate", Compensate)
]