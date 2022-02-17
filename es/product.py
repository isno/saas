#coding:utf-8
from elasticsearch_dsl import Document,Text,IntegerRange,Date,Boolean,Integer,Object,Keyword

from elasticsearch_dsl.connections import connections


class ProductES(Document):

    shop_id = Integer()
    entity_id = Integer()

    name = Text()
    vendor = Integer() # 品牌
    types = Integer(multi=True)  #分类

    price = IntegerRange()

    point = IntegerRange()

    stock = Integer()


    visibility = Boolean() # 是否上架
    is_deleted = Boolean() # 删除


    created_at = Date() # 商品创建时间

    class Index:
        name = 'product'

    def save(self, ** kwargs):
        self.meta.id = self.entity_id
        kwargs.update({"refresh":True})
        return super(ProductES, self).save(** kwargs)

    

if __name__ == '__main__':
    connections.create_connection(hosts=['localhost:9201'], timeout=5)
    ProductES.init()