#coding:utf-8
from util.app_handler import AppHandler
from model.area import Area

class Cities(AppHandler):
    def get(self):

        father_id = self.get_argument("father_id", "0")

        params = {}
        if not father_id:
            params = {"level":1}
        else:
            father_id = int(father_id)
            father = Area.objects(code = father_id).first()
            params = {"father":father}

        datas = Area.objects(**params)
        
        cities = []
        for _data in datas:
            cities.append({
                "name":_data.name,
                "code":_data.code
                })

        self.json_message(200, cities)

handlers = [
    (r"/api/cities", Cities),
]