#coding:utf-8
import math
from datetime import datetime
from util.handler import BaseHandler,authenticated

from model.coupon_group import CouponGroup
from model.coupon import Coupon

from es.coupon import CouponES
from tasks.coupon import CouponInit

class GetAll(BaseHandler):
    @authenticated("m_coupon")
    def get(self):
        ctype = self.get_argument("ctype", "")
        status = self.get_argument("status", "")
        search = self.get_argument("search", "")

        active_earlier = self.get_argument("active_earlier", "")
        active_later = self.get_argument("active_later", "")


        size = self.get_argument("size", 30)
        size = int(size)
        page = self.get_argument("page", 1)
        page = max(1, int(page))
        page_start = (page-1)*size

        s = CouponES.search()
        s = s.query("term", shop_id = self.shop.entity_id)
        s = s.query("term", is_deleted = False)

        if ctype:
            s = s.query("term", ctype = ctype)
        if search:
            s = s.query("match", name = search)

        if status:
            if status == "unactived": # 未开始
                s = s.filter("range", actived_at={"gte":self.now})
            if status == "actived": # 未开始
                s = s.filter("range", expired_at={"gte":self.now})
                s = s.filter("range", actived_at={"lte":self.now})
            if status == "expired": # 过期
                s = s.filter("range", expired_at={"lt":self.now})

        if active_earlier and active_earlier != "0":
            active_earlier = datetime.strptime(active_earlier,'%Y-%m-%dT%H:%M:%S.%f+08:00')
            s = s.filter("range", actived_at={"gte":active_earlier})
        if active_later and active_later != "0":
            active_later = datetime.strptime(active_later,'%Y-%m-%dT%H:%M:%S.%f+08:00')
            s = s.filter("range", expired_at={"lte":active_later})

        s = s[page_start:page_start+size]
        count = s.count()
        resp = s.execute()

        ids = []
        for _resp in resp.hits:
            ids.append(long(_resp.meta.id))

        coupons = []
        res = CouponGroup.objects(entity_id__in = ids)
        for _var in res:
            _coupon = {
                "name":_var.name,
                "ctype":_var.ctype,
                "utype":_var.utype,
                "id":str(_var.entity_id),
                "quantity_provided":_var.quantity_provided,
                "discount_percentage":_var.discount_percentage,
                "discount_amount":_var.discount_amount,
                "quantity_used":0,
                "status":_var.status,

                "actived_at":_var.actived_at.isoformat(),
                "expired_at":_var.expired_at.isoformat(),
                "created_at":_var.created_at.isoformat()
            }
            coupons.append(_coupon)

        page_count = int(math.ceil(float(count)/size))
        data = {
            "page_count":page_count,
            "item_count":count,
            "is_empty":True if len(coupons) == 0 else False,
            "coupon_groups":coupons,
        }

        self.json_message(200, data)


class Create(BaseHandler):
    @authenticated("m_coupon")
    def post(self):
        id = self.get_argument("id", 0)
        entity_id = int(id)

        ctype = self.get_argument("ctype", "normal")  # 普通券  normal
        utype = self.get_argument("utype", "") # 金额限制  无门槛  normal 金额限制 amount
        atype = self.get_argument("atype", "")  # 领取规则 normal 正常 single 每人只能领一次

        name = self.get_argument("name")
        quantity_provided = self.get_argument("quantity_provided", "0")


        imported = self.get_argument("imported", "")
        active_amount = self.get_argument("active_amount", "0") # 金额限制 
        discount_amount = self.get_argument("discount_amount", "0")  # 优惠现金
        discount_percentage = self.get_argument("discount_percentage", "0")  #优惠折扣

        exported = self.get_argument("exported", "true") # 是否开放领取

        export_text  = self.get_argument("export_text", "")
        export_color = self.get_argument("export_color", "")
        prefix = self.get_argument("prefix", "")
        actived_at = self.get_argument("actived_at", "")
        expired_at = self.get_argument("expired_at", "")


        actived_at = self.utc_datetime(actived_at)
        expired_at = self.utc_datetime(expired_at)


        is_new = False
        group = None
        if entity_id:
            group = CouponGroup.objects(entity_id = entity_id, shop = self.shop).first()
        
        if not group:
            group = CouponGroup()
            group.shop = self.shop

            is_new = True
            
        '''
        检查复用券是否重复
        '''
        if ctype == "single":
            check_exists = CouponGroup.objects(shop = self.shop, prefix = prefix).first()
            if check_exists and check_exists.entity_id != group.entity_id:
                return self.json_message(201, {}, "优惠码不允许重复")
        else:
            num = int(quantity_provided)
            if not num:
                return self.json_message(201, {}, "请填写优惠券数量")
        
        group.name = name
        group.ctype = ctype
        group.utype = utype
        group.active_amount = int(active_amount)
        group.atype = atype
        group.discount_amount = int(discount_amount)
        group.discount_percentage = int(discount_percentage)
        group.quantity_provided = int(quantity_provided)
        group.prefix = prefix
        group.actived_at = actived_at
        group.expired_at = expired_at
        group.exported = True if exported == "true" else False
        group.export_text = export_text
        group.export_color = export_color
        group.save()

        if is_new:
            # 异步生成code
            CouponInit.delay(group)

        self.json_message(200, {"id":group.entity_id})

class GetSingle(BaseHandler):
    @authenticated("m_coupon")
    def get(self):
        id = self.get_argument("id", 0)
        id = int(id)
        
        coupon = CouponGroup.objects.get(entity_id = id)
        
        data = {}
        data["id"] = id
        data["name"] = coupon.name
        data["active_amount"] = coupon.active_amount
        data["ctype"] = coupon.ctype
        data["utype"] = coupon.utype
        data["ctype"] = coupon.ctype
        data["atype"] = coupon.atype
        data["discount_amount"] = coupon.discount_amount
        data["discount_percentage"] = coupon.discount_percentage
        data["quantity_provided"] = coupon.quantity_provided
        data["prefix"] = coupon.prefix
        data["actived_at"] = coupon.actived_at.isoformat()
        data["expired_at"] = coupon.expired_at.isoformat()

        data["exported"] = coupon.exported
        data["export_text"] = coupon.export_text
        data["export_color"] = coupon.export_color
        data["is_available"] = coupon.available
        
        data["quantity_used"] = 0
        data["status"] = 0
        data["created_at"] = coupon.created_at.isoformat()

        data["export_url"] = "http://www.iyoudian.cn/coupon/get"
        data["qrcode"] = "http://www.iyoudian.cn/coupon/get"
        data["qrcode_url"] = "http://www.iyoudian.cn/coupon/get"

        self.json_message(200, {"coupon_group":data})



class GetCoupons(BaseHandler):
    @authenticated("")
    def get(self):
        id = self.get_argument("id", 0)

        data = {
            "page_count":1,
            "item_count":1,
            "is_empty":False ,
            "coupons":[],
        }
        self.json_message(200, data)

        
class Cancel(BaseHandler):
    @authenticated("coupon")
    def post(self):
        id = self.get_argument("id", 0)
        coupon = CouponGroup.objects.get(entity_id = int(id))
        coupon.available = False
        coupon.save()
        self.json_message(200)


class Assign(BaseHandler):
    @authenticated("coupon")
    def post(self):
        id = self.get_argument("id")
        customers = self.get_argument("customers")
        for _user in json_decode(customers):
            pass
            #待开发
        self.json_message(200)

class Export(BaseHandler):
    @authenticated("coupon")
    def get(self):
        shop_id = self.get_argument("shop_id", 0)
        id = self.get_argument("id")
        stype = self.get_argument("type")
        stype = int(stype)

        coupon_group = CouponGroup.objects(entity_id = int(id)).first()
        if not coupon_group:
            return

        params = {}
        params["coupon_group"] = coupon_group
        if stype== 1:
            params["is_taked"] = False
        if stype== 2:
            params["is_taked"] = True
            params["is_used"] = False
        if stype== 3:
            params["is_used"] = True

        coupons = Coupon.objects(**params)

        csv = ""
        csv+="优惠券,\r\n"
        for _coupon in coupons:
            csv+="%s,\r\n" % _coupon.code

        self.set_header("Content-Type","application/octet-stream")
        self.set_header("Content-Disposition", "filename=%s.csv" % coupon_group.name.encode("utf-8").decode("ISO-8859-1"))

        self.write(csv)

handlers = [
    (r"/main/api/coupon_group/export", Export),
    (r"/main/api/coupon_group/create", Create),
    (r"/main/api/coupon_group/update", Create),
    (r"/main/api/coupon_group/assign", Assign),
    (r"/main/api/coupon_group/cancel", Cancel),
    (r"/main/api/coupon_group/get_all", GetAll),
    (r"/main/api/coupon_group/get_single", GetSingle),
    (r"/main/api/coupon_group/get_coupons", GetCoupons),
]