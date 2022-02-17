#coding:utf-8
from datetime import datetime
from hashlib import md5

from mongoengine import *
from tornado.escape import json_encode

class Account(Document):
    meta = {
        "indexes":[
            "account",
        ],
        'ordering': ['-entity_id']
    }
    entity_id = SequenceField(unique=True)

    name = StringField(default = "")
    account  = StringField(default = "", required=True)
    password_hash = StringField(max_length = 32)

    remark = StringField(default = "")

    image_path = StringField(default = "/image/2020/1/c2bb14eb455aa12c389e80086b386647.png")


    is_deleted = BooleanField(default = False)
    is_actived = BooleanField(default = False)
    last_login_at = DateTimeField(default = None)
    created_at = DateTimeField(default = datetime.now)
    updated_at = DateTimeField(default = datetime.now)


    @property
    def password(self):
        raise AttributeError("password is not a readable")

    @password.setter
    def password(self, password):
        self.password_hash = md5(password).hexdigest()

    def verify_password(self,password):
        return md5(password).hexdigest() == self.password_hash


    @property
    def simple_data(self):
        data = {
            "id":self.entity_id,
            "name":self.name,
            "image_path":self.image_path
        }
        return data
    updated_at = DateTimeField(default = datetime.now)


    