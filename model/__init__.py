#coding:utf-8
from mongoengine import connect
from config import conf

connect(conf.get("mongodb", "db"), host=conf.get("mongodb", "host"))