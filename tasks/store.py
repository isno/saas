#coding:utf-8
from tasks import app
import requests
from tornado.escape import json_encode

from model.store import Store


@app.task
def store_geo(store_id):
    key = ""
    url = "https://restapi.amap.com/v3/geocode/geo"

    store = Store.objects(entity_id = store_id).first()
    if not store:
        return 

    if not store.address:
        return 
    res = requests.get("%s?key=%s&address=%s" % (url, key,address))
    res = json_decode(res.text)
    if res.get("status") != 1:
        return
    geo = res.get("geocodes")[0].get("location")
    point = [float(v) for v in geo.split(",")]
    store.geo_point = point
    store.save()

def store_wx():
    pass

