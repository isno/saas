#coding:utf-8
from elasticsearch_dsl import Document,Text,Date,Byte,Boolean,Short,Long,Object,Keyword

from elasticsearch_dsl.connections import connections

class CustomerES(Document):
    shop_id = Long()
    entity_id = Long()

    name = Text()
    account = Keyword() # 是否允许删除

    last_order_at = Date() # 最新下单时间

    trade_total_count = Short() # 下单单数
    trade_total_amount =  Long() #成交总额

    level_id = Long() # 等级id

    credit = Long()
     # 积分, 积分启用时生效

    created_at = Date() # 注册时间

    is_deleted = Boolean()

    class Index:
        name = 'customer'

    def save(self, ** kwargs):
        self.meta.id = self.entity_id
        kwargs.update({"refresh":True})
        return super(CustomerES, self).save(** kwargs)

    

if __name__ == '__main__':
    connections.create_connection(hosts=['localhost:9201'], timeout=2)
    CustomerES.init()