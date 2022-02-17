#coding:utf-8

from account import handlers as account_handlers
from setting import handlers as setting_handlers

from customer import handlers as customer_handlers
from customer_level import handlers as customer_level_handlers
from shipment_template import handlers as shipment_template_handlers
from shipment_supplier import handlers as shipment_supplier_handlers
from shipment import handlers as shipment_handlers
from bank_code import handlers as bank_code_handlers


from payment_method import handlers as payment_method_handlers
from trade import handlers as trade_handlers

from product import handlers as product_handlers
from product_image import handlers as product_image_handlers
from product_type import handlers as product_type_handlers
from product_vendor import handlers as product_vendor_handlers
from product_option import handlers as product_option_handlers
from product_multi import handlers as product_multi_handlers

from product_panel import handlers as product_panel_handlers
from product_type_panel import handlers as product_type_panel_handlers

from promotion import handlers as promotion_handlers
from coupon import handlers as coupon_handlers
from track import handlers as track_handlers
from refund import handlers as refund_handlers
from stat import handlers as stat_handlers

from store import handlers as store_handlers
from apps import handlers as apps_handlers


handlers = []
handlers.extend(store_handlers)
handlers.extend(apps_handlers)
handlers.extend(account_handlers)
handlers.extend(stat_handlers)
handlers.extend(setting_handlers)
handlers.extend(promotion_handlers)
handlers.extend(coupon_handlers)
handlers.extend(track_handlers)
handlers.extend(refund_handlers)
handlers.extend(shipment_handlers)
handlers.extend(shipment_template_handlers)
handlers.extend(shipment_supplier_handlers)
handlers.extend(bank_code_handlers)


handlers.extend(customer_handlers)
handlers.extend(customer_level_handlers)

handlers.extend(product_handlers)
handlers.extend(product_multi_handlers)

handlers.extend(product_image_handlers)
handlers.extend(product_type_handlers)
handlers.extend(product_vendor_handlers)
handlers.extend(product_option_handlers)
handlers.extend(product_panel_handlers)
handlers.extend(product_type_panel_handlers)

handlers.extend(payment_method_handlers)
handlers.extend(trade_handlers)