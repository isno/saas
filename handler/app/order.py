#coding:utf-8
from tornado.escape import json_decode
from tornado.web import authenticated

from util.app_handler import AppHandler
from util.shipment import Shipment
from util.order_helper import OrderHelper

from model.customer import Customer
from model.shop import Shop
from model.cart import Cart
from model.product import Product
from model.order import Order
from model.address import Address

from model.order_shipment import OrderShipment as ShipmentDTO
from model.order_shipment_product import OrderShipmentProduct
from model.shipment_template import ShipmentTemplate


from model.product import Product
from model.product_variant import ProductVariant
from model.promotion import Promotion

class CreateOrder(AppHandler):
    #@authenticated
    def get(self):
        self.shop = Shop.objects.get(entity_id = 1)
        self.current_user = Customer.objects(entity_id = 10).first()
        params = {}
        params["shop"] = self.shop
        if self.current_user:
            params = {"customer":self.current_user}
            
        res = Cart.objects(**params)
        count = Cart.objects(**params).count()

        products = []
        for _item in res:
            products.append(_item.simple_data)


        #获取地址
        address = Address.objects(customer = self.current_user, is_default = True).first()
        helper = OrderHelper(self.shop, products, self.current_user, address.simple_data,"3ILCM")


        discount_amount = helper.discount_amount
        old_amount_total = helper.amount_total 
        post_fee_total = helper.post_fee_total
        discount = helper.discount
        
        cart = {
            "ships":helper.products,
            "address":address.simple_data, 
            "count":count,
            "discount":discount,
            "post_fee_total":post_fee_total,
            "discount_amount":discount_amount,
            "old_amount_total":old_amount_total,
            "coupon":helper.coupon_info,
            "amount_total":helper.new_amount_total,
            "ships":helper.products
        }
        self.write({"code":200, "cart":cart})

    '''
    创建订单
    '''
    @authenticated
    def post(self):
        address = self.get_argument("address")
        address = json_decode(address)

        params = {
            "customer":self.current_user
            #"is_check":True
        }

        ship_ids = [] #多包裹ID
        cart_products = []
        products = {}
        carts = Cart.objects(**params)

        item_amount = 0 # 商品总价
        for _cart in carts:
            _product = Product.objects.get(entity_id = _cart.product_variant.product_id)
            _cart.shipment_id = _product.shipment_template.entity_id
            _cart.name = _product.name
            if _cart.shipment_id not in ship_ids:
                ship_ids.append(_cart.shipment_id)

            products["%d" % _product.entity_id] = _product
            
            cart_products.append(_cart)

        order = Order()
        order.no =  self.get_order_id()

        order.address = address
        order.item_amount = item_amount

        order.shop = self.shop
        order.customer = self.current_user
        order.created_ip = self.request.remote_ip
        
        order.save()
        
        for _ship_id in ship_ids:
            _shipment = ShipmentTemplate.objects.get(entity_id = _ship_id)
            
            dto = ShipmentDTO()
            dto.shop = self.shop
            dto.order = order
            dto.amount = 0
            
            _carts = filter(lambda x: x.shipment_id == _ship_id, cart_products)

            shipment_products = []
            for _cart in carts:
                p = OrderShipmentProduct()
                p.name = _cart.name
                p.quantity = _cart.quantity
                p.product_id = _cart.product_variant.product_id
                p.variant_id = _cart.product_variant.entity_id
                p.weight = _cart.product_variant.weight
                p.volume = _cart.product_variant.volume
                p.stock = _cart.product_variant.stock
                p.barcode = _cart.product_variant.barcode
                p.options_desc = _cart.product_variant.options_desc
                p.price = _cart.product_variant.price

                item_amount+=_cart.product_variant.price*p.quantity

                
                if _cart.product_variant.image:
                    p.image_path = _cart.product_variant.image
                else:
                    p.image_path = products["%d" % p.product_id].image_path
                p.save()
                shipment_products.append(p)

            dto.products = shipment_products
            dto.save()


       

        self.json_message(200, {"order_no":order.no})





class WithinShipments(AppHandler):
    def get(self):

        params = {"token":self.token}
        if self.current_user:
            params = {"customer":self.current_user}

        carts = Cart.objects(**params)

        shipments = Shipment(carts).get_shipments()

        self.write({"code":200, "shipments":shipments})



class OrderPay(AppHandler):
    def get(self, no):
        self.render("app/theme.html")


class OrderCount(AppHandler):
    def get(self):
        count = 0
        self.write({"code":200, "count":0})

class Orders(AppHandler):
    @authenticated
    def get(self):
        order_no = self.get_argument("order_no", "")
        address = Address.objects.get(entity_id = 4)

        orders = []
        count = Order.objects(customer = self.current_user).count()
        res = Order.objects(customer = self.current_user)
        for _order in res:
            orders.append({
                "order_no":_order.no,
                "created_at":_order.created_at.isoformat(),
                "status":_order.status,
                "status_desc":_order.status_desc,
                "payment_status":_order.payment_status,
                "shipment_status":0,
                "payment_method_type":0,
                "address":_order.address_simple_data,
                "preferential_records":[],
                "discount_records":[],
                "shipments":_order.shipments_simple_data
                })


        data = {
            "code":200,
            "orders":orders,
            "paging":{"items":count, "pages":1, "view":0, "size":20}
        }
        self.write(data)


handlers = [
    (r"/api/order/create", CreateOrder),
    (r"/api/cart/within_shipments", WithinShipments),
    (r"/account/orders/(\w+)", OrderPay),
    (r"/api/order/count", OrderCount),
    (r"/api/orders", Orders)
]
