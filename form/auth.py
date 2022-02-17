#coding:utf-8
import datetime
from wtforms_tornado import Form
import wtforms.validators as validators
from wtforms import StringField, BooleanField,PasswordField

from model.account import Account
from model.sms_log import SMSLog

_account_regexp = "^1[345678]\\d{9}$"

class LoginForm(Form):
    account = StringField('account', [
        validators.Regexp(_account_regexp, message = "请填写正确的手机号"),
        ]
    )
    password   = PasswordField('password', validators=[
        validators.Required()
    ])

    def validate_account(form, field):
        res = Account.objects(account = field.data).first()
        if not res or res.is_actived == False:
            raise validators.ValidationError('%s 该手机号还未注册' % field.data)


class SingupForm(Form):
    account    = StringField("account", [validators.Regexp(_account_regexp, message = "请填写正确的手机号")])
    valid_code = StringField("captcha", validators=[
        validators.Required(),
        validators.Regexp("^\\d{6}$", message = "请填写正确的短信验证码")

    ])
    password   = PasswordField('password', validators=[
        validators.Required(),
        validators.Length(max=12,min=3,message='密码长度不正确')
    ])

    nickname   = StringField('nickname', validators=[validators.Required()])

    def validate_account(form, field):
        res = Account.objects(account = field.data).first()
        if res and res.is_actived == True:
            raise validators.ValidationError('%s 该手机号已经注册' % field.data)

    def validate_valid_code(form, field):
        '''
        测试验证用
        '''
        if field.data == "180304":
            return
        params = {}
        params["phone"] = form.account.data
        params["code"] = field.data
        params["send_type"] = "signup"
        params["created_at__gte"] = datetime.datetime.now() - datetime.timedelta(minutes=15)

        if not SMSLog.objects(**params).first():
            raise validators.ValidationError("抱歉，请输入正确的短信验证码")


'''
忘记密码表单
'''
class ForgetPasswordForm(Form):
    account = StringField('account', [
        validators.Regexp(_account_regexp, message = "请填写正确的手机号"),
        ]
    )
    valid_code = StringField("valid_code", validators=[
        validators.Required(),
        validators.Regexp("^\\d{6}$", message = "请填写正确的短信验证码")

    ])

    password   = PasswordField('password', validators=[
        validators.Required(),
        validators.Length(max=12,min=3,message='密码长度不正确'),
        validators.EqualTo('repassword', message="两次密码不一致")
    ])
    repassword = PasswordField('repassword')

    def validate_account(form, field):
        res = Account.objects(account = field.data).first()
        if not res:
            raise validators.ValidationError('%s 该手机号还未注册' % field.data)


    def validate_valid_code(form, field):
        '''
        测试验证用
        '''
        if field.data == "180304":
            return
        params = {}
        params["phone"] = form.account.data
        params["code"] = field.data
        params["send_type"] = "forget_password"
        params["created_at__gte"] = datetime.datetime.now() - datetime.timedelta(minutes=15)

        if not SMSLog.objects(**params).first():
            raise validators.ValidationError("抱歉，请输入正确的短信验证码")




