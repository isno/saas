#coding:utf-8
from elasticsearch_dsl import Document,Text,Date,Byte,Boolean,Short,Integer,Object,Keyword

from elasticsearch_dsl.connections import connections


class ProductVendorES(Document):
    shop_id = Integer()
    entity_id = Integer()

    name = Text()
    is_used = Boolean()
    is_deleted = Boolean()

    class Index:
        name = 'product_vendor'

    def save(self, ** kwargs):
        self.meta.id = self.entity_id
        kwargs.update({"refresh":True})
        return super(ProductVendorES, self).save(** kwargs)

    

if __name__ == '__main__':
    connections.create_connection(hosts=['localhost:9201'], timeout=2)
    ProductVendorES.init()