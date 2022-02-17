#coding:utf-8
from elasticsearch_dsl import Document,Text,Date,Byte,Boolean,Short,Long,Object,Keyword

from elasticsearch_dsl.connections import connections


class ProductTypeES(Document):

    shop_id = Long()
    entity_id = Long()

    name = Text()
    is_used = Boolean()
    is_deleted = Boolean()

    class Index:
        name = 'product_type'

    def save(self, ** kwargs):
        self.meta.id = self.entity_id
        kwargs.update({"refresh":True})
        return super(ProductTypeES, self).save(** kwargs)

    

if __name__ == '__main__':
    connections.create_connection(hosts=['localhost:9201'], timeout=2)
    ProductTypeES.init()