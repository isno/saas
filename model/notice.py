#coding:utf-8
from datetime import datetime
from mongoengine import *

class Notice(Document):
    meta = {
        "indexes":[
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)
    title = StringField()
    content =  StringField()
    created_at = DateTimeField(default = datetime.now)

    @property
    def simple_data(self):
        return {
            "id":self.entity_id,
            "title":self.isp,
            "content":self.content,
            "created_at":self.created_at.isoformat()
        }
