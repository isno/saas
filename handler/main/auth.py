#coding:utf-8
from tornado.web import addslash,removeslash,authenticated
from util.handler import BaseHandler

from form.auth import LoginForm,SingupForm,ForgetPasswordForm

from model.account import Account
from model.login_errors import LoginErrors
from model.login_logs import LoginLogs
from model.account_to_shop import AccountToShop

class Login(BaseHandler):
    def initialize(self, *args,  **kwargs):
        self.form = LoginForm(self.request.arguments)

    @removeslash
    def get(self):
        self.render("auth/login.htm", form = self.form)

    def post(self):
        if not self.form.validate():
            return self.render("auth/login.htm", form = self.form)

        account  = self.get_argument("account", "")
        password = self.get_argument("password", "")
        captcha = self.get_argument("captcha", "")
        remember_me = self.get_argument("remember_me", "")

        captcha = captcha.upper()
        if self.session.get("%s_vcode" % "login", "error") != captcha:
            self.notice("err", "验证码错误")
            return self.redirect("/auth/login")

        count = LoginErrors.objects(account = account, request_ip = self.request.remote_ip, log_type = "login").count()
        if count>=5:
            self.notice("err", "密码错误次数过多，已被禁止当日操作，请明日再试。")
            return self.redirect("/auth/login")

        user = Account.objects(account=account).first()
        if not user:
            self.notice("err", "为找到账户")

        verify = user.verify_password(password)
        if not verify:
            # 记录日志， 如果错误次数过多， 24小时内禁止登录
            log = LoginErrors()
            log.account = account
            log.log_type = "login"
            log.request_ip = self.request.remote_ip
            log.save()

            self.notice("err", "密码错误，请重试")
            return self.redirect("/auth/login")

        
        secret = self.create_signed_value("auth", "%d" % user.entity_id)

        '''
        激活账户
        '''
        AccountToShop.objects(account = user,is_actived = False).update(set__is_actived=True)

        # 用户登录日志
    

        user.last_login_at = self.now

        user.save()

        m = LoginLogs()
        m.account = user
        m.request_ip = self.request.remote_ip
        m.save()

        days =  30 if remember_me == "on" else None
        self.set_cookie("auth", secret, expires_days = days)
  
        return self.redirect("/wo/")


class Signup(BaseHandler):
    def initialize(self, *args,  **kwargs):
        self.form = SingupForm(self.request.arguments)

    @removeslash
    def get(self):
        self.render("auth/signup.htm", form = self.form)
    
    def post(self):
        if not self.form.validate():
            # 记录日志， 如果错误次数过多， 24小时内禁止注册
            log = Logins()
            log.account = self.form.account.data
            log.log_type = "signup"
            log.created_ip = self.request.remote_ip
            log.save()

            return self.render("auth/signup.htm", form = self.form)

        count = Logins.objects(account = self.form.account.data, created_ip = self.request.remote_ip, log_type = "signup").count()
        if count >= 10:
            self.notice("err", "注册异常次数过多，已被禁止当日操作，请明日再试。")
            return self.redirect("/auth/signup")


        user = Account()
        user.account = self.form.account.data
        user.password = self.form.password.data
        user.name = self.form.nickname.data
        user.created_ip = self.request.remote_ip
        user.is_actived = True # 自主注册，默认激活

        user.save()

        secret = self.create_signed_value("auth", "%s" % user.entity_id)
        self.set_cookie("auth", secret)
        return self.redirect("/auth/welcome")

        
class Welcome(BaseHandler):
    def get(self):
        self.render("auth/welcome.htm")


class ForgetPassword(BaseHandler):
    def initialize(self, *args,  **kwargs):
        self.form = ForgetPasswordForm(self.request.arguments)

    def get(self):
        self.render("auth/forget_password.htm", form = self.form)


    def post(self):
        if not self.form.validate():
             # 记录日志， 如果错误次数过多， 24小时内禁止注册
            log = Logins()
            log.account = self.form.account.data
            log.log_type = "forget_password"
            log.created_ip = self.request.remote_ip
            log.save()


            return self.render("auth/forget_password.htm", form = self.form)

        count = Logins.objects(account = self.form.account.data, created_ip = self.request.remote_ip, log_type = "forget_password").count()
        if count >= 10:
            self.notice("err", "注册异常次数过多，已被禁止当日操作，请明日再试。")
            return self.redirect("/auth/forget_password")

        res = Account.objects.get(account = self.form.account.data)
        res.password = self.form.password.data
        res.save()

        secret = self.create_signed_value("auth", "%s" % res.entity_id)
        self.set_cookie("auth", secret)

        return self.redirect("/")

class Tuichu(BaseHandler):
    def get(self):
        self.clear_cookie("auth", "/")
        self.redirect("/")


handlers = [
    (r"/auth/login/?", Login),
    (r"/auth/signup/?", Signup),
    (r"/auth/welcome", Welcome),
    (r"/auth/forget_password", ForgetPassword),
    (r"/auth/logout", Tuichu)
]