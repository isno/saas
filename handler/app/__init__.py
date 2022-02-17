#coding:utf-8

from order import handlers as order_handlers
from account import handlers as account_handlers
from address import handlers as address_handlers
from area import handlers as area_handlers
from product import handlers as product_handlers
from cart import handlers as cart_handlers
from cart_discount import handlers as cart_discount_handlers

from coin import handlers as coin_handlers

from auth import handlers as auth_handlers
from category import handlers as category_handlers
from store import handlers as store_handlers
from coupon import handlers as coupon_handlers

handlers = []
handlers.extend(order_handlers)

handlers.extend(account_handlers)
handlers.extend(address_handlers)
handlers.extend(area_handlers)
handlers.extend(product_handlers)
handlers.extend(cart_handlers)
handlers.extend(cart_discount_handlers)

handlers.extend(coin_handlers)
handlers.extend(auth_handlers)
handlers.extend(category_handlers)
handlers.extend(store_handlers)
handlers.extend(coupon_handlers)
