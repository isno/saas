#coding:utf-8

from tasks import app

from model.shop import Shop
from model.shipment_template import ShipmentTemplate
from model.shipment_template_method import ShipmentTemplateMethod

from model.customer_enter import CustomerEnter


@app.task
def shopEntry(entry_id):
    enter = CustomerEnter.objects(entity_id = int(entry_id)).first()

    #判断账户是否注册过
    user = Account.objects(account = enter.phone).first()
    if not user:
        user = Account()

    user.account = enter.phone
    user.name = enter.phone
    user.created_ip = enter.created_ip
    user.is_actived = True #默认激活
    user.save()

    s = Shop()
    s.name = enter.brand
    s.shop_type = enter.shop_type
    s.modules = enter.modules
    s.save()

    a = AccountToShop()
    a.account = user
    a.shop = s
    a.is_actived = True
    a.modules = enter.modules
    a.save()

    shopInit.delay(s.entity_id)
    send_sms.delay(enter.phone, "init")



'''
店铺数据初始化
'''
@app.task
def shopInit(shop_id):
    shop = Shop.objects.get(entity_id = shop_id)

    '''
    全国包邮
    '''
    method1 = ShipmentTemplateMethod()
    method1.fees = [{
        "is_default" : True,
        "start" : 100,
        "postage" : 0,
        "postageplus" : 0,
        "plus" : 100
        }]
    method1.save()

    shipment1 = ShipmentTemplate()
    shipment1.shop = shop
    shipment1.name = "全国包邮"
    shipment1.rules = [method1]
    shipment1.save()


    '''
    示例物流 - 按重量计价
    '''
    method2 = ShipmentTemplateMethod()
    method2.fees = [
        {
            "is_default" : True,
            "start" : 100,
            "postage" : 1000,
            "postageplus" : 100,
            "plus" : 100
        }, 
        {
            "postage" : 800,
            "start" : 100,
            "postageplus" : 100,
            "plus" : 100,
            "include_areas" : "350100,350200,350300,350400,350500,350600,350700,350800,350900,440900,440100,440200,440300,440400,440500,440600,440700,440800,441200,441300,441400,441500,441600,441700,441800,441900,442000,445100,445200,445300,450300,450100,450200,450400,450500,450700,450800,450900,451000,451100,451200,451300,451400,450600,460200,460300,469027,469006,460100,469036,469031,469003,469002,469007,469028,469033,469034,469030,469026,469005,469001,469025,469035"
        }]
    method2.save()

    shipment2 = ShipmentTemplate()
    shipment2.shop = shop
    shipment2.name = "示例物流 - 按重量计价"
    shipment2.rules = [method2]
    shipment2.save()

    '''
    示例物流 - 按体积计价
    '''
    method3 = ShipmentTemplateMethod()
    method3.fees = [
        {
            "is_default" : True,
            "start" : 100,
            "postage" : 1000,
            "postageplus" : 100,
            "plus" : 100
        }, 
        {
            "postage" : 800,
            "start" : 100,
            "postageplus" : 100,
            "plus" : 100,
            "include_areas" : "350100,350200,350300,350400,350500,350600,350700,350800,350900,440900,440100,440200,440300,440400,440500,440600,440700,440800,441200,441300,441400,441500,441600,441700,441800,441900,442000,445100,445200,445300,450300,450100,450200,450400,450500,450700,450800,450900,451000,451100,451200,451300,451400,450600,460200,460300,469027,469006,460100,469036,469031,469003,469002,469007,469028,469033,469034,469030,469026,469005,469001,469025,469035"
        }]
    method3.save()


    shipment3 = ShipmentTemplate()
    shipment3.shop = shop
    shipment3.calculate_type = 1
    shipment3.name = "示例物流 - 按重量计价"
    shipment3.rules = [method3]
    shipment3.save()

    '''
    示例物流 - 按件数计价
    '''
    method4 = ShipmentTemplateMethod()
    method4.fees = [
        {
            "is_default" : True,
            "start" : 1,
            "postage" : 800,
            "postageplus" : 500,
            "plus" : 1
        }, 
        {
            "postage" : 800,
            "start" : 1,
            "postageplus" : 500,
            "plus" : 1,
            "include_areas" : "350100,350200,350300,350400,350500,350600,350700,350800,350900,440900,440100,440200,440300,440400,440500,440600,440700,440800,441200,441300,441400,441500,441600,441700,441800,441900,442000,445100,445200,445300,450300,450100,450200,450400,450500,450700,450800,450900,451000,451100,451200,451300,451400,450600,460200,460300,469027,469006,460100,469036,469031,469003,469002,469007,469028,469033,469034,469030,469026,469005,469001,469025,469035"
        }]
    method4.save()

    shipment4 = ShipmentTemplate()
    shipment4.shop = shop
    shipment4.calculate_type = 2
    shipment4.name = "示例物流 - 按件数计价"
    shipment4.rules = [method4]
    shipment4.save()

    






    