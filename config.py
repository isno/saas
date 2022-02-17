#coding:utf-8
import os
from ConfigParser import SafeConfigParser

conf = SafeConfigParser()
conf_path = os.path.join(os.path.dirname(__file__), "config.conf")
conf.read(conf_path)