#coding:utf-8
from config import conf
from elasticsearch_dsl.connections import connections


connections.create_connection(hosts=["%s:%s"% (conf.get("es", "host"),conf.get("es", "port"))], timeout=2)

