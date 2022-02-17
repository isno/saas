#coding:utf-8
from elasticsearch_dsl import Document,Text,Date,Byte,Boolean,Short,Long,Object,Keyword

from elasticsearch_dsl.connections import connections

class OrderES(Document):
    shop_id = Long()  # 商店ID
    entity_id = Long() # 订单id
    no = Keyword() # 订单编号

    status = Keyword() # 订单状态
    payment_status = Keyword() # 支付状态
    shipment_status = Keyword() # 物流状态

    pay_at = Date() # 支付时间
    created_at = Date() # 订单创建时间
    total_amount =  Long() # 订单总额，单位分

    
    is_deleted = Boolean()

    created_at = Date() # 订单创建时间

    class Index:
        name = 'order'

    def save(self, ** kwargs):
        self.meta.id = self.entity_id
        kwargs.update({"refresh":True})
        return super(OrderES, self).save(** kwargs)

    

if __name__ == '__main__':
    connections.create_connection(hosts=['localhost:9201'], timeout=2)
    OrderES.init()