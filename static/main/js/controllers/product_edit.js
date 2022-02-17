var ProductEditController = BaseEditPageController.extend({
    _tag: "product",
    _tagCn: "商品",
    _isPreCreate: !0,
    init: function (e, t, i, n, a, o, s) {
        this._super(e, t, i, n, a, o), 
        this._rootScope = t, 
        this._$scope = this._scope = e, 
        this._uri = i, 
        this._$Popup = this._popup = n, 
        this._$timeout = this._timeout = a, 
        this._document = s, 
        this._util = o, 
        e.UTF8LEN = o.getUTF8Length, 
        e.PARSEHTML = o.parseHtml;

        var l = _.clone(e.tinymceOptions, !0);
        e.tinymceOptionsMobile = l, 
        e.YouPreset = YouPreset, 
        e.canSave = !0, 
        e.metaFieldStatusArrow = !0, 
        e.dataTypeSeletor = {
            btnname: "设置分类",
            inputplaceholder: "搜索或创建分类",
            btnautostatus: !0,
            cnname: "商品分类",
            inputMaxLength: 50,
            staticMode: !0
        }, e.dataVendorSeletor = {
            btnname: "选择品牌",
            isUniq: !0,
            inputplaceholder: "搜索或创建品牌",
            btnautostatus: !0,
            cnname: "商品品牌",
            inputMaxLength: 50,
            staticMode: !0
        }, 
        e.dataShipmentSeletor = {
            btnname: "选择运费模板",
            isUniq: !0,
            inputplaceholder: "搜索运费模板",
            btnautostatus: !0,
            cnname: "运费模板",
            inputMaxLength: 100,
            mode: "search",
            forbiddenDel: !0,
            staticMode: !0
        }, 
        e.dataOptionSeletor = {
            btnname: "新增商品属性",
            inputplaceholder: "搜索或创建商品属性",
            btnautostatus: !0,
            notshowlist: !0,
            uniparam: "options",
            inputMaxLength: 10
        }, 
        e.dataOptionSeletorBigOrg = {
            btnname: "新增商品属性",
            inputplaceholder: "搜索或创建商品属性",
            btnautostatus: !0,
            notshowlist: !0,
            uniparam: "options",
            inputMaxLength: 10
        }, 
        e.dataOptionSeletorTextOrg = {
            btnname: "新增商品属性",
            inputplaceholder: "搜索或创建商品属性",
            btnautostatus: !0,
            notshowlist: !0,
            uniparam: "options",
            inputMaxLength: 10
        }, 
        e.aProductMetaField = [], 
        e.fDisplaySale = function () {
            e.sold_display_edit_num = e.sold_quantity_display, 
            e.validation.toggle("sold_display_edit_num", !1), 
            e.sold_display_edit = !0
        }, 
        e.fCancelSold = function () {
            e.sold_display_edit = !1
        }, 
        e.submitSold = function () {
            e.validation.validate(["sold_display_edit_num"]) && (e.sold_display_edit_num = Number(e.sold_display_edit_num), e.sold_quantity_display = e.sold_display_edit_num, e.fCancelSold(), t.unsaved = !1)
        };
        var c = !1,d = $("#pro_shortdesc");
        e.shortDescStyle = {height: "32px"}, 
        this._detectShortDescHeight = function () {
            c || d.get(0).scrollHeight > d.height() + 10 && (e.shortDescStyle = {height: "160px"}, 
            e.$digest(), c = !0), "" === d.val() && (e.shortDescStyle = {height: "32px"}, e.$digest(), c = !1)
        }, 
        d.on("input", this._detectShortDescHeight), 
        d.on("keypress", function (t) {
            c || 13 == t.which && (e.shortDescStyle = {height: "160px"}, e.$digest(), c = !0)
        }), 
      
        e.onClickNewMetaField = function () {
            e.aProductMetaField.push({})
        }, 
        e.removeOff = function (t, i) {
            e.aProductMetaField.splice(i, 1)
        }, 
        e.clickMetaFieldStatus = function (t) {
            e.metaFieldStatusArrow = void 0 === t ? !e.metaFieldStatusArrow : t, e.metaFieldStatusArrow ? e.metaFieldStatusStyle = {
                "max-height": "auto",
                overflow: "visible"
            } : e.metaFieldStatusStyle = {
                "max-height": "0px",
                overflow: "hidden"
            }
        }
    }, 
    _updateSold: function (e) {
        var t = this._$scope;
        t.sold_quantity_display = e, t.sold_display_edit_num = e
    }, 
    isOptionNull: function (e) {
        return Boolean(null == this._$scope.data.options[e].name)
    }, 
    _initOptions: function () {
        function e(e) {
            var n = !1,
                a = [],
                o = i.data.variants.length;
            return _.forEach(i.data.variants, function (s, r) {
                if (!n) {
                    for (var l = r + 1; l < o; l++) {
                        var c = i.data.variants[l],
                            d = !0;
                        _.forEach([0, 1, 2], function (i) {
                            i != e && (t.isOptionNull(i) || c["option_" + (i + 1)] == s["option_" + (i + 1)] || (d = !1))
                        }), d && (n = !0, a.push(l + 1))
                    }
                    n && a.push(r + 1)
                }
            }), a.sort(), a = a.slice(0, 2)
        }
        var t = this,
            i = this._$scope,
            n = this._$Popup,
            a = this._document;
        this._timeout;
        i.deleteOption = function (o, s, r, l, c) {
            r || (r = i), _.forEach([0, 1, 2], function (e) {
                r.validation.toggle("delete-option_" + e, !1)
            }), s && s.stopPropagation();
            var d;
            if (d = t.isOptionNull(1) && i.data.variants.length > 1 ? [1, 2] : e(o), d.length) return void(l ? (n.info({
                type: "danger",
                text: "不能删除！删除后会导致第" + d.join("、") + "条商品的属性值重复"
            }), c && c(!1)) : (r.validation.toggle("delete-option_" + o, !0, '<span style="line-height: 1.5; ">不能删除！删除后会导致<br>第' + d.join("、") + "条商品的属性值重复</span>"), a.one("click", function () {
                r.validation.toggle("delete-option_" + o, !1)
            })));
            var p = i.data.options[o];
            n.modalSimple({
                type: "remove",
                tag: "一个商品属性",
                content: "确定要删除商品属性 <b>" + p.name + "</b> 吗？",
                forceMask: !0,
                onClose: function () {
                    n.close(), c && c(!1)
                }, onCancel: function () {
                    n.close(), c && c(!1)
                }, onConfirm: function () {
                    for (var e = o + 1; e < 3; e++) i.data.options[e - 1] = i.data.options[e];
                    i.data.options[2] = {
                        values: []
                    }, _.forEach(i.data.variants, function (e) {
                        for (var t = o + 1; t < 3; t++) e["option_" + t] = e["option_" + (t + 1)];
                        e.option_3 = ""
                    }), n.close(), c && c(!0)
                }
            })
        }, i.cantSortOptions = function () {
            var e = !0;
            return _.forEach(i.data.options, function (t) {
                null != t.name && (e = !1)
            }), e
        }
    }, 
    _initPrice: function () {
        function e(e, t) {
            var i = 0;
            return t || (t = n.data.variants[e]), _.forEach(n.data.variants, function (a, o) {
                if (!i && o != e) {
                    var s = !0;
                    _.forEach([0, 1, 2], function (e) {
                        null != n.data.options[e].name && t["option_" + (e + 1)] != a["option_" + (e + 1)] && (s = !1)
                    }), s && (i = o + 1)
                }
            }), i
        }

        function t(t, i, r) {
            var l = n.data.reward_point_enabled,
                c = l ? n.data.initial_ratio : 0;
            if (!s) {
                var d = !Boolean(i);
                n.validation.toggle("setPrice", !1), i ? (i = _.cloneDeep(i), i.stock_type = "A" === i.stock_type, delete i.$$hashKey) : i = {
                    option_1: "",
                    option_2: "",
                    option_3: "",
                    price: "",
                    stock: "",
                    point: "",
                    compare_price: "",
                    weight: "",
                    volume: "",
                    barcode: "",
                    is_alarmed: !1,
                    email_alarm: !1,
                    phone_alarm: !1,
                    weixin_alarm: !1,
                    alarm_num: 0,
                    stock_type: !1
                };
                n.dataOptionSeletorBigOrg.reConfig = !0, 
                n.dataOptionSeletorTextOrg.reConfig = !0;
                var p = o.modal({
                    title: t,
                    content: '<div class="pro-edit-vari-option clearfix"><div class="pro-edit-vari-option-empty" ng-show="options[0].name == null"><span class="pro-edit-vari-option-empty-add"><you-tagselector data="dataOptionSeletorText"></you-tagselector></span><span you-help style="position: relative; top: 2px;">将在网站商品页显示，如：<br><span class="pro-edit-vari-option-empty-tips-img" style="margin-top: 8px;"></span></span><span class="pro-edit-vari-option-empty-desc">适用于有不同 颜色，尺码，材质 或者其他属性的商品</span></div><div class="pro-edit-vari-each pro-edit-vari-each-option" ng-if="options[0].name != null"><h3 style="color:#c1873c;">{{options[0].name}} <i class="ico delete" style="cursor:pointer"  ng-click="deleteOption(0, $event)" title="删除商品属性"></i><span style="position: relative; left: -5px;"><input style="display:none;" type="text" name="delete-option_0" you-validation></span></h3><input type="text" class="input input-long" ng-model="variant.option_1" maxlength="200" you-validation/></div><div class="pro-edit-vari-each pro-edit-vari-each-option" ng-if="options[1].name != null"><h3 style="color:#75a630;">{{options[1].name}} <i class="ico ico-delete" style="cursor:pointer"  ng-click="deleteOption(1, $event)" title="删除商品属性"></i><span style="position: relative; left: -5px;"><input style="display:none;" type="text" name="delete-option_1" you-validation></span></h3><input type="text" class="input input-long" ng-model="variant.option_2" maxlength="200" /></div><div class="pro-edit-vari-each pro-edit-vari-each-option" ng-if="options[2].name != null"><h3 style="color:#4c67a5;">{{options[2].name}} <i class="ico ico-delete" style="cursor:pointer"  ng-click="deleteOption(2, $event)" title="删除商品属性"></i><span style="position: relative; left: -5px;"><input style="display:none;" type="text" name="delete-option_2" you-validation></span></h3><input type="text" class="input input-long" ng-model="variant.option_3" maxlength="200" /></div><div class="pro-edit-vari-each pro-edit-vari-each-add" ng-show="options[0].name != null"><div class="pro-edit-optionselector-layout" style="position: relative; top: 1px; left: 2px;"><div ng-show="canSelectOptions()"><you-tagselector data="dataOptionSeletorBig"></you-tagselector></div><i class="ico ico-add-1" ng-hide="canSelectOptions()" class="disabled" style="position:relative; left: 4px;"></i><div class="tips-help-content tips-help-arrow-product-atr"><span class="b64-you-help tips-help-arrow arrow"></span>新增商品属性，最多添加3个</div></div></div></div><div class="pro-edit-vari-static clearfix" style="padding-bottom: 0;"><div class="pro-edit-vari-each pro-edit-vari-each-big pro-edit-vari-each-price"><h3>售价 <span style="color:#aaa;">(必填)</span></h3><div class="input-group"><div class="input-group-addon">{{YouPreset.$()}}</div><input class="input input-long" type="text" ng-blur="setPointAmount(variant)" ng-model="variant.price" you-validation="required|nonNegativeNumber|float2|maxNumber" style="padding-right: 25px;"/></div></div><div class="pro-edit-vari-each pro-edit-vari-each-big"><h3>库存 <span you-help style="position: relative;top: 3px;">不填写默认为0</span></h3><input class="input input-long" type="text" ng-model="variant.stock" you-validation="integer|maxNumber"/></div><div class="pro-edit-vari-each pro-edit-vari-each-big"><h3>积分 <span ng-if="isNew" you-help you-need-compile="true" style="position: relative;top: 3px;">积分 = 售价 * 积分系数，当前初始积分系数为{{initial_ratio}}%，<br>可前往 网站设置-><a href="#/setting?tab=point" class="text-link">积分设置</a> 进行修改。</span></h3><input class="input input-long" type="text" ng-model="variant.point" ng-change="onPointChange(variant)" you-validation="required|integer|maxNumber"/></div></div><div class="pro-edit-vari-static clearfix" style="line-height:36px;padding-bottom:4px;padding-top:9px;"><div><label class="labelmargin"><input you-check type="checkbox" ng-click="onIsAlarmedChange()" ng-model="variant.is_alarmed"> 使用库存警报 <span style="color:#aaa;font-family:Arail;">&gt;</span></label><span ng-show="variant.is_alarmed"> 当库存低于 <input style="width:70px;" you-validation="required|integer|positiveNumber|maxNumber" type="text" class="input" ng-model="variant.alarm_num" /> 时在商品列表提醒。<br/> <span style="padding-left: 123px;">发送警报通知<span/> <span you-help style="position: relative;top: 3px;">库存警报将会消耗网站对应的邮件和短信额度，具体的通知方式请到网站通知的“管理员通知设置”中设置。</span> <label class="labelmargin" style="padding-left: 15px;"><input you-check type="checkbox" ng-model="variant.email_alarm"> 邮件</label> <label class="labelmargin" style="padding-left: 10px;"><input you-check type="checkbox" ng-model="variant.phone_alarm"> 手机短信</label> <label class="labelmargin" style="padding-left: 10px;"><input you-check type="checkbox" ng-model="variant.weixin_alarm"> 微信</label> </span></div><div><label class="labelmargin"><input you-check type="checkbox" ng-model="variant.stock_type"> 库存为0时，仍然可以下单购买</label></div></div><div ng-click="toggleSubInputs()" style="display:inline-block;"><span class="pro-edit-vari-subinputs-trigger">原价 重量 体积 编号<i class="ico ico-arrow-9" ng-show="!isShowSubInputs"></i><i class="ico ico-arrow-10" ng-show="isShowSubInputs"></i></span></div><div class="pro-edit-vari-static clearfix" style="padding-top: 0" ng-show="isShowSubInputs"><div style="border-bottom: 1px solid #e8e8e8; height:1px; margin: 5px 0;"></div><div><div class="pro-edit-vari-each pro-edit-vari-each-small"><h3>原价</h3><div class="input-group"><div class="input-group-addon">{{YouPreset.$()}}</div><input class="input input-long" type="text" ng-model="variant.compare_price" you-validation="nonNegativeNumber|float2|maxNumber" style="padding-right: 25px;"/></div></div><div class="pro-edit-vari-each pro-edit-vari-each-small"><h3>重量 <span you-help style="position: relative; top: 2px;">该值只用于计算物流运费，<br>不填默认为0</span></h3><input class="input input-long" type="text" ng-model="variant.weight" you-validation="nonNegativeNumber|float2|maxNumber" style="padding-right: 40px;"/><div class="pro-edit-vari-each-unit">千克</div></div><div class="pro-edit-vari-each pro-edit-vari-each-small"><h3>体积 <span you-help style="position: relative; top: 2px;">该值只用于计算物流运费，<br>不填默认为0</span></h3><input class="input input-long" type="text" ng-model="variant.volume" you-validation="nonNegativeNumber|float2|maxNumber" style="padding-right: 55px;"/><div class="pro-edit-vari-each-unit" >立方米</div></div><div class="pro-edit-vari-each pro-edit-vari-each-small"><h3>编号</h3><input class="input input-long" type="text" ng-model="variant.barcode" maxlength="255" /></div><input type="hidden" ng-model="vid" /></div></div><br>',
                    popStyle: {
                        visibility: "hidden"
                    },
                    btn: [{
                        type: "default",
                        text: "取消",
                        click: "cancel"
                    }, {
                        type: "primary",
                        text: "确定",
                        click: "confirm",
                        enter: !0
                    }],
                    focus: "input",
                    scope: {
                        cancel: function () {
                            o.close()
                        }, confirm: function (t, i) {
                            if (!t.validation.validate(["variant.price", "variant.stock", "variant.point", "variant.compare_price", "variant.weight", "variant.volume", "variant.barcode"])) return void(i.confirm = !1);
                            if (t.variant.is_alarmed && !t.validation.validate(["variant.alarm_num"])) return void(i.confirm = !1);
                            if (t.variant.stock_type = t.variant.stock_type ? "A" : "B", null == r) {
                                var s = e(-1, t.variant);
                                if (s) return a(function () {
                                    t.validation.toggle("variant.option_1", !0, "与第" + s + "条商品的属性值重复", !0)
                                }), void(i.confirm = !1);
                                n.data.variants.push(t.variant)
                            } else n.data.variants[r] = t.variant;
                            o.close(), n.unSaved()
                        }
                    },
                    contentextclass: "pro-edit-vari-pop",
                    initModel: {
                        variant: i,
                        isNew: d,
                        shouldCompute: !!d,
                        initial_ratio: c,
                        onPointChange: function (e) {
                            this.shouldCompute = "" === e.point
                        }, 
                        setPointAmount: function (e) {
                            if (this.shouldCompute) {
                                var t = e.price,
                                    i = this.initial_ratio / 100;
                                e.point = "" === t ? "" : Math.round(t * i), this.validation.toggle("variant.point")
                            }
                        }, 
                        options: n.data.options,
                        dataOptionSeletorBig: n.dataOptionSeletorBigOrg,
                        dataOptionSeletorText: n.dataOptionSeletorTextOrg,
                        canSelectOptions: n.canSelectOptions,
                        deleteOption: function (e, t) {
                            n.deleteOption(e, t, p.$$childTail.$$childHead)
                        }, isShowSubInputs: !Boolean(d),
                        onIsAlarmedChange: function () {
                            p.$$childHead.data.popStyle.height = this.variant.is_alarmed ? this.isShowSubInputs ? "521px" : "465px" : this.isShowSubInputs ? "485px" : "429px"
                        }, 
                        toggleSubInputs: function () {
                            var e = this;
                            p.$$childHead.data.popStyle.height = this.variant.is_alarmed ? this.isShowSubInputs ? "465px" : "521px" : this.isShowSubInputs ? "429px" : "485px", a(function () {
                                e.isShowSubInputs = !e.isShowSubInputs
                            }, 200)
                        }
                    },
                    notpreventDefault: !0
                });
                a(function () {

                    p.$$childTail.$$childHead.dataOptionSeletorBig = _.clone(n.dataOptionSeletor), 
                    p.$$childTail.$$childHead.dataOptionSeletorBig.addTextBtn = !1, 
                    p.$$childTail.$$childHead.dataOptionSeletorBig.addPicBtn = !1, 
                    p.$$childTail.$$childHead.dataOptionSeletorBig.addPicBtnBig = !0, 
                    p.$$childTail.$$childHead.dataOptionSeletorText = _.clone(n.dataOptionSeletor), 
                    p.$$childTail.$$childHead.dataOptionSeletorText.addPicBtn = !1, 
                    p.$$childTail.$$childHead.dataOptionSeletorText.addPicBtnBig = !1, 
                    p.$$childTail.$$childHead.dataOptionSeletorText.addTextBtn = !0;            

                }, 100), 
                a(function () {
                    p.$$childHead.data.popStyle = {
                        height: d ? "429px" : i.is_alarmed ? Boolean(d) ? "465px" : "521px" : Boolean(d) ? "429px" : "485px",
                        visibility: "hidden"
                    }, 
                    p.$$childHead.$digest(), a(function () {
                        p.$$childHead.data.popStyle = {
                            height: d ? "429px" : i.is_alarmed ? Boolean(d) ? "465px" : "521px" : Boolean(d) ? "429px" : "485px",
                            visibility: "visible"
                        }
                    }, 200)
                }, 200)
            }
        }
        var i = this,
            n = this._$scope,
            a = this._$timeout,
            o = this._$Popup,
            s = !1;
        n.editPrice = function (e, t, i) {
            s || (s = !0, e["isEditing_" + i] = !0, a(function () {
                var e = document.getElementsByName("price_" + i + "_" + t)[0];
                e && (e.focus(), e.select())
            }))
        }, 
        n.editPriceDone = function (t, i, o) {
            if (n.canSave = !1, 0 === o.indexOf("option_")) {
                var r = e(i);
                if (r) return a(function () {
                    n.validation.toggle("price_" + o + "_" + i, !0, "与第" + r + "条商品的属性值重复", !0)
                }, 150), !1
            } else {
                var l = ["price_" + o + "_" + i];
                if (!n.validation.validate(l)) return a(function () {
                    n.validation.validate(l)
                }, 150), !1
            }
            return s = !1, delete t["isEditing_" + o], n.unSaved(), n.canSave = !0, !0
        }, 
        n.editPriceKeyPress = function (e, t, i, a) {
            switch (a.keyCode) {
            case 9:
            case 13:
                return n.editPriceDone(e, t, i), a.stopPropagation(), a.preventDefault(), !1
            }
        }, 
        n.fDelVari = function (e) {
            o.modalSimple({
                type: "remove",
                tag: "SKU",
                content: "确定要删除第 " + (e + 1) + " 个 SKU 吗？（保存商品后生效）",
                onConfirm: function () {
                    n.data.variants.splice(e, 1), o.close()
                }
            })
        }, 
        n.copyPrice = function (e) {
            e.id = 0;
            null != n.data.options[0].name && t("复制 SKU", e)
        }, 
        n.fEditVariant = function (e, i) {
            t("修改 SKU", e, i)
        }, 
        n.fNewVariant = function (e) {
            (e || null != n.data.options[0].name) && t("新增 SKU")
        }, 
        n.sortOptions = function () {
            i.onSortOptions()
        }, 
        n.showVariantAddBtnTip = !1, n.toggleVariantAddBtnTip = function (e) {
            null == n.data.options[0].name && (n.showVariantAddBtnTip = e)
        }
    }, 
    _initPriceImg: function () {
        var e = this._$scope,
            t = this._$Popup,
            i = this._$timeout;
        e.editPriceImg = function (n) {
            if (0 === e.proimages.length) return void t.modal({
                title: "选择关联的橱窗图片",
                content: '<div style="color: #aaa;margin-top: 25px;text-align: center;">暂无图片，请先在 <b>橱窗图片</b> 中上传。</div>',
                btn: [{
                    type: "primary",
                    text: "我知道了",
                    click: "cancel"
                }],
                scope: {
                    cancel: function () {
                        t.close()
                    }
                }
            });
            var a = n.image_real_id,
                o = 1 === e.data.variants.length,
                s = t.modal({
                    title: "选择关联的橱窗图片",
                    content: '<div ng-if="variant.option_1 != null && showOption">当前商品属性：<span style="color:#c1873c">{{variant.option_1}}</span><span ng-if="variant.option_2 != null">，<span style="color:#75a630">{{variant.option_2}}</span></span><span ng-if="variant.option_3 != null">，<span style="color:#4c67a5"></span>{{variant.option_3}}</span></div><div style="margin-top: 10px;"><div class="pro-edit-variant-img" ng-repeat="i in proimages" ng-click="setPriceImg(i)" ng-class="isSelected(i)"> <img ng-src="{{ i.url4variant }}" alt="{{ i.alt }}" /> <div class="t-arrow-layout">  <svg width="29" height="29"><polygon points="0,0 29,0 29,29"></polygon></svg>  <i class="ico ico-selected-2"></i> </div> <you-cover></you-cover></div></div>',
                    btn: [{
                        text: "取消关联",
                        click: "cancelLink"
                    }, {
                        text: "取消",
                        click: "cancel"
                    }, {
                        type: "primary",
                        text: "确定",
                        click: "confrim",
                        enter: !0
                    }],
                    scope: {
                        cancel: function () {
                            t.close()
                        }, confrim: function (i) {
                            var o = _.find(i.proimages, function (e) {
                                return e.id == a
                            });
                            o && (n.image_real_id = o.id, n.url4variantSmall = o.url4variantSmall), t.close(), e.unSaved()
                        }, cancelLink: function () {
                            n.image_real_id = null, n.url4variantSmall = null, t.close(), e.unSaved()
                        }
                    },
                    initModel: {
                        showOption: !o,
                        variant: n,
                        proimages: _.cloneDeep(e.proimages),
                        setPriceImg: function (e) {
                            a = e.id
                        }, isSelected: function (e) {
                            return a == e.id ? "selected" : ""
                        }
                    }
                });
            i(function () {
                s.$$childHead.reAdjust()
            })
        }
    }, 
    onInitDone: function (e) {
        var t = this,
            i = this._$scope,
            n = this._util,
            a = this._uri,
            o = this._$timeout;
        this._super(e), 
        i.fProductMetaField = function () {
            var t, n = e.attribute_meta_field.fields,
                a = Object.keys(e.attribute_meta_field.fields),
                o = {},
                s = a.length;
            for (t = 0; t < s; t++) o = {
                key: a[t],
                value: n[a[t]]
            }, 
            i.aProductMetaField.push(o)
        }, 
        e.attribute_meta_field && e.attribute_meta_field.fields ? i.fProductMetaField() : (e.attribute_meta_field = {}, e.attribute_meta_field.fields = {}), 
        0 === Object.keys(e.attribute_meta_field.fields).length && (i.metaFieldStatusStyle = {"max-height": "0px"}, i.metaFieldStatusArrow = !1), 
        i.shortDesc = n.reparseHtml(e.short_desc), 
        i.mobileDesc = e.mobile_desc, 
        i.data = e, 
        e.options || (e.options = []), 
        _.forEach([0, 1, 2], function (t) {
            e.options[t] || (e.options[t] = {values: []})
        }), 
        e.variants || (e.variants = []), 
        _.forEach(e.variants, function (e) {
            "" != e.price && (e.price = n.yuan(e.price)), 
            "" != e.compare_price && (e.compare_price = n.yuan(e.compare_price)), 
            "" != e.weight && (e.weight = n.weightKg(e.weight)), 
            "" != e.volume && (e.volume = n.volumeMeterShow(e.volume))
        }), 
        i.id = this.getId(), 
        this._updateSold(e.display_sale), 
        i.sold_quantity = e.sale ? e.sale : 0, 
        this.onInitImages(), 
        this._initOptions(), 
        this._initPrice(), 
        this._initPriceImg(), 
        this._initSelectorType(), 
        this._initSelectorVendor(), 
        this._initSelectorShipment(),
        this._initSelectorOption(), 
        o(function () {t._detectShortDescHeight()}), 
        o(function () {t.hasInited = !0}, 500)
    }, 
    onInitVariantImg: function () {
        var e = this._$scope,
            t = e.data,
            i = function () {
                if (!e.data.variants) return void $timeout(i, 500);
                _.forEach(t.variants, function (t) {
                    if (t.image_real_id) {
                        var i = _.find(e.proimages, function (e) {
                            return t.image_real_id == e.id
                        });
                        i ? t.url4variantSmall = i.url4variantSmall : (t.image_real_id = null, t.url4variantSmall = null)
                    }
                })
            };
        i()
    }, 
    onSaveBefore: function () {
        var e = this,
            t = this._scope,
            i = !1;
        return !!t.canSave && (0 === t.data.variants.length ? (t.validation.validate(this._watchValid) ? t.validation.toggle("setPrice", !0, "请设置 SKU", !0) : t.validation.toggle("setPrice", !0, "请设置 SKU"), !1) : 200 - e._util.parseHtml(t.shortDesc).length < 0 ? (t.validation.toggle("shortDesc", !0, "最多200个字符", !0), !1) : (t.validation.toggle("shortDesc", !1), t.aProductMetaField.length > 0 && _.forEach(t.aProductMetaField, function (e, n) {
            e.key && e.value || (e.key || t.validation.toggle("metafield-key", !0, "不能为空", !1), e.value || t.validation.toggle("metafield-value", !0, "不能为空", !1), i = !0)
        }), !i && (this.onSaveOptions(), this.onSaveMetaField(), !0)))
    }, 
    onSaveMetaField: function () {
        var e = this._scope,
            t = {};
        _.forEach(e.aProductMetaField, function (e, i) {
            t[e.key] = e.value
        }), 
        e.data.attribute_meta_field.fields = t
    }, 
    onSaveOptions: function () {
        var e = this._$scope,
            t = e.data,
            i = [
                [],
                [],
                []
            ];
        _.forEach([0, 1, 2], function (e) {
            if (null != t.options[e].name) {
                _.forEach(t.variants, function (t) {
                    null != t["option_" + (e + 1)] && i[e].push(t["option_" + (e + 1)])
                }), 
                i[e] = _.union(i[e]), 
                t.options[e].values = _.union(t.options[e].values);
                for (var n = t.options[e].values, a = n.length - 1; a >= 0; a--) _.contains(i[e], n[a]) || n.splice(a, 1);
                _.forEach(i[e], function (e) {
                    _.contains(n, e) || n.push(e)
                })
            }
        })
    }, 
    onSave: function (e) {
        var t = this,
            i = this._$scope,
            n = this._util,
            a = _.cloneDeep(i.data);
        delete e.id, e.name = i.baseName;
        for (var o = 2; o >= 0; o--) null == a.options[o].name && (a.options.pop(), _.forEach(a.variants, function (e) {
            delete e["option_" + (o + 1)]
        }));
        _.forEach(a.options, function (e) {
            delete e.$$hashKey
        }), 
        _.forEach(a.variants, function (e) {
            delete e.$$hashKey, 
            delete e.url4variantSmall, 
            delete e.image_id, 
            delete e.image_name, 
            delete e.image_epoch
        }), 
        _.forEach(a.variants, function (e) {
            "" != e.price && (e.price = n.fen(e.price)),
            "" != e.compare_price && (e.compare_price = n.fen(e.compare_price)), 
            "" != e.weight && (e.weight = n.weightTeng(e.weight)), 
            "" != e.volume && (e.volume = n.volumeMeterData(e.volume))
        }), 
        e.data = {
            id: a.id,
            name: n.htmlEnDeCode.htmlEncode(i.baseName),
            visibility: i.baseVisibility,
            options: a.options,
            variants: a.variants,
            shipment_template_id: 0 === i.shipment_templates.length ? null : i.shipment_templates[0].id,
            display_sale: i.sold_quantity_display,
            mobile_desc: i.mobileDesc,
            short_desc: n.parseHtml(i.shortDesc),
            meta_field: i.data.attribute_meta_field.fields
        }, 
        i.vendors.length > 0 && (e.data.vendor_id = i.vendors[0].id), i.types.length > 0 && (e.data.types = [], _.forEach(i.types, function (t) {
            e.data.types.push({id: t.id})
        }));
        var s = [],
            r = t._util.parseAssetId(i.baseDesc);
        _.forEach(r, function (e) {
            -1 == s.indexOf(e) && s.push(e)
        }), 
        s.length > 0 && (e.data.html_images = s.join(","));
        var l = [],c = t._util.parseMultimediaKey(i.baseDesc);
        _.forEach(c, function (e) {
            -1 == l.indexOf(e) && l.push(e)
        }), 
        l.length > 0 && (e.data.html_multimedia = l.join(",")), 
        e.data = JSON.stringify(e.data)
    }, 
    onSortOptionsDone: function (e) {
        var t = this._$scope,
            i = _.cloneDeep(t.data.variants),
            n = _.cloneDeep(t.data.options);
        _.forEach(e, function (e, a) {
            var o = _.findIndex(t.data.options, function (t) {
                return t.name == e.name
            });
            n[a] = e, _.forEach(t.data.variants, function (e, t) {
                i[t]["option_" + (a + 1)] = e["option_" + (o + 1)]
            })
        }), t.data.options = n, t.data.variants = i
    }, 
    onSortOptions: function () {
        this.onSaveOptions();
        var e = this,
            t = [],
            i = {
                opacity: ".6",
                "border-style": "dashed"
            },
            n = {
                opacity: "1",
                "border-style": "solid"
            };
        _.forEach(_.cloneDeep(this._scope.data.options), function (e, i) {
            var n = [];
            _.forEach(e.values, function (e, t) {
                var a = {};
                a.value = e, a.oStyle = !1, a.parentCount = i, n.push(a)
            }), e.valueConf = n, t.push(e)
        });
        var a = this._$Popup,
            o = this._$timeout,
            s = a.modal({
                title: "商品属性排序",
                content: '<div class="pro-edit-sort-tips">此处显示的是商品详情页购买时的选项顺序，拖动 <i class="ico ico-nav-drag-border" style="top: 3px;"></i> 可调整显示顺序</div><div class="pro-edit-sort-content grid-list" ng-mousemove="moveEl($event)" ng-mouseup="stopDragTr();stopDragOption();" ng-mouseleave="stopDragTr();stopDragOption();"><table class="pro-edit-sort-table" cellpadding="0" cellspacing="0" border="0"><colgroup><col width="30%"><col></colgroup><thead class="grid-list-header pro-edit-sort-content-header"><tr><th class="pro-edit-sort-table-th">选项名</th><th>选项</th></tr></thead><tbody class="pro-edit-sort-content-body"><tr ng-repeat="item in optionData" ng-show="item.name != null" ng-style="item.oStyle" ng-mouseover="overTargetTr($index)"><th><div class="pro-edit-sort-optionName" ng-mousedown="startDragTr($event, $index)"><span class="ico ico-nav-drag"></span>{{ item.name }}</div></th><td><div class="pro-edit-sort-optionValue" ng-repeat="eachConf in item.valueConf track by $index" ng-style="eachConf.oStyle" ng-mousedown="startDragOption($event, $index, item)" ng-mouseover="overTargetOption($index, item)"><div><span class="ico ico-nav-drag"></span>{{ eachConf.value ? eachConf.value : \'&nbsp;\' }}</div></div><div class="pro-edit-sort-optionValue pro-edit-sort-optionValue-moved" ng-show="item.bOptionMoving" ng-style="item.oOptionMovedStyle"><div><span class="ico ico-nav-drag"></span>{{ oOptionValueMoved.value }}</div></div></td></tr></tbody></table><div class="pro-edit-sort-trmoved" ng-style="oTrMovedStyle" ng-show="bTrMoving"><div class="pro-edit-sort-content grid-list"><table class="pro-edit-sort-table" cellpadding="0" cellspacing="0" border="0"><colgroup><col width="30%"><col></colgroup><tbody class="pro-edit-sort-content-body"><tr><th><div class="pro-edit-sort-optionName"><span class="ico ico-nav-drag"></span>{{ oTrMoved.name }}</div></th><td><div class="pro-edit-sort-optionValue" ng-repeat="eachConf in oTrMoved.valueConf track by $index"><div><span class="ico ico-nav-drag"></span>{{ eachConf.value ? eachConf.value : \'&nbsp;\' }}</div></div></td></tr></tbody></table></div></div></div>',
                btn: [{
                    type: "loading",
                    hide: "true"
                }, {
                    type: "default",
                    text: "取消",
                    click: "cancelPop"
                }, {
                    type: "primary",
                    text: "确定",
                    click: "saveOptions"
                }],
                onClose: function () {
                    a.closeAll()
                }, scope: {
                    cancelPop: function () {
                        a.closeAll()
                    }, saveOptions: function (t, i) {
                        i.saveOptions = !1, e.onSortOptionsDone(t.optionData), e._$Popup.closeAll()
                    }
                }, initModel: {
                    optionData: t,
                    nowOptionX: 0,
                    nowOptionY: 0,
                    nTargetOptionIndex: -1,
                    nDragOptionIndex: -1,
                    nOptionTop: 0,
                    nOptionLeft: 0,
                    bTrMoving: !1,
                    nTargetTrIndex: -1,
                    nDragTrIndex: -1,
                    nowY: 0,
                    nTrTop: 0,
                    moveEl: function (e) {
                        e.preventDefault();
                        var t = this;
                        if (t.bTrMoving) {
                            var i = e.pageY - t.nowY,
                                n = t.nTrTop + i;
                            t.oTrMovedStyle = {
                                top: n + "px"
                            }, t.nTrTop = n, t.nowY = e.pageY
                        }
                        if (t.currentItem && t.currentItem.bOptionMoving) {
                            var i = e.pageY - t.nowOptionY,
                                a = e.pageX - t.nowOptionX,
                                n = t.nOptionTop + i,
                                o = t.nOptionLeft + a;
                            t.currentItem.oOptionMovedStyle = {
                                top: n + "px",
                                left: o + "px"
                            }, t.nOptionTop = n, t.nOptionLeft = o, t.nowOptionX = e.pageX, t.nowOptionY = e.pageY
                        }
                    }, startDragOption: function (e, t, n) {
                        var a = this.$parent.$parent,
                            o = $(e.target).parents(".pro-edit-sort-optionValue")[0] || $(e.target)[0],
                            s = o.offsetTop,
                            r = o.offsetLeft;
                        a.oOptionValueMoved = _.clone(n.valueConf[t]), a.currentItem = n, n.valueConf[t].oStyle = i, n.bOptionMoving = !0, a.nDragOptionIndex = t, a.nTargetOptionIndex = t, a.nOptionTop = s, a.nOptionLeft = r, n.oOptionMovedStyle = {
                            top: s + "px",
                            left: r + "px"
                        }, a.nowOptionX = e.pageX, a.nowOptionY = e.pageY
                    }, overTargetOption: function (e, t) {
                        var i = this.$parent.$parent;
                        t.bOptionMoving && (i.nTargetOptionIndex = e, i.exchangeOption())
                    }, stopDragOption: function () {
                        var e = this;
                        e.currentItem && e.currentItem.bOptionMoving && (e.currentItem.bOptionMoving = !1, e.currentItem.oOptionMovedStyle = i, e.currentItem.valueConf[e.nDragOptionIndex].oStyle = n, e.nPrevTarget = -1)
                    }, exchangeOption: function () {
                        var e = this;
                        if (e.nPrevTarget != e.nTargetOptionIndex && e.nTargetOptionIndex != e.nDragOptionIndex) {
                            var t = e.currentItem.values[e.nDragOptionIndex];
                            e.currentItem.values[e.nDragOptionIndex] = e.currentItem.values[e.nTargetOptionIndex], e.currentItem.values[e.nTargetOptionIndex] = t;
                            var i = e.currentItem.valueConf[e.nDragOptionIndex];
                            e.currentItem.valueConf[e.nDragOptionIndex] = e.currentItem.valueConf[e.nTargetOptionIndex], e.currentItem.valueConf[e.nTargetOptionIndex] = i, e.nPrevTarget = e.nDragOptionIndex, e.nDragOptionIndex = e.nTargetOptionIndex
                        }
                    }, startDragTr: function (e, t) {
                        var i = this.$parent,
                            n = $(e.target).parents("tr")[0].offsetTop;
                        i.oTrMoved = _.clone(i.optionData[t]), i.optionData[t].oStyle = {
                            opacity: "0"
                        }, i.bTrMoving = !0, i.nDragTrIndex = t, i.nTargetTrIndex = t, i.nTrTop = n, i.oTrMovedStyle = {
                            top: n + "px"
                        }, i.nowY = e.pageY
                    }, stopDragTr: function () {
                        var e = this;
                        e.bTrMoving && (e.bTrMoving = !1, e.optionData[e.nDragTrIndex].oStyle = {
                            opacity: "1"
                        })
                    }, overTargetTr: function (e) {
                        var t = this.$parent;
                        t.bTrMoving && (t.nTargetTrIndex = e, t.exchangeTr())
                    }, exchangeTr: function () {
                        var e = this;
                        if (e.nTargetTrIndex != e.nDragTrIndex) {
                            var t = [],
                                i = e.nDragTrIndex,
                                n = e.nTargetTrIndex;
                            _.forEach(e.optionData, function (e, i) {
                                t.push(e)
                            }), t[n] = e.optionData[i], t[i] = e.optionData[n], e.optionData = t, e.nDragTrIndex = e.nTargetTrIndex
                        }
                    }
                },
                notpreventDefault: !0,
                contentextclass: "pro-edit-sort",
                returnElm: !0
            }),
            r = (s.$$childTail.$$childHead, s.$$childHead);
        o(function () {
            r.reAdjust()
        })
    }, 
    _initSelectorOption: function () {
        var e = this,
            t = this._scope,
            i = (this._timeout, []),
            n = function () {
                i.length = 0, _.forEach(t.data.options, function (e) {
                    null != e.name && i.push({
                        id: e.id,
                        name: e.name
                    })
                })
            };
        n(), 
        t.$watchCollection("data.options", function () {
            n()
        }), 
        t.canSelectOptions = function () {
            return null == t.data.options[2].name
        };
        var a = function (e, i, n) {
            var a = _.findIndex(t.data.options, function (t) {
                return t.name == e.name
            });
            t.deleteOption(a, null, null, !0, function (e) {
                e ? i() : n.close(), n.isSubmiting = !1
            })
        };
        t.dataOptionSeletor = {
            url: ["option_getAll", "notPost", "notPost"],
            urlCreate: "option_create",
            orgData: i,
            uniparam: "options",
            uname: "pid",
            uid: e._scope.id,
            queryname: "name",
            delConfirmFn: a,
            sync: function (n, a, o) {
                if (i = n, n.length != a.length) {
                    if (e.hasInited && (e._rootScope.unsaved = !1), n.length > a.length) {
                        if (_.find(t.data.options, function (e) {
                            return e.name == n[n.length - 1].name
                        })) return;
                        var s = _.findIndex(t.data.options, function (e) {
                            return null == e.name
                        });
                        return t.data.options[s].name = n[n.length - 1].name, t.data.options[s].id = n[n.length - 1].id, _.forEach(t.data.variants, function (e) {
                            e["option_" + (s + 1)] = "默认"
                        }), void(3 == n.length && o.close())
                    }
                    n.length, a.length
                }
            }, addPicBtn: !0
        }
    }, 
    _initSelectorType: function () {
        var e = this,
            t = {};
        t._rootScope = this._rootScope, 
        t._scope = this._scope, 
        t._uri = this._uri, 
        t._popup = this._popup, 
        t._timeout = this._timeout, 
        t._scope.data.types && t._scope.data.types.length > 0 ? t._scope.types = t._scope.data.types : t._scope.types = [], 
        t._scope.dataTypeSeletor = {
            url: ["type_getAll", "notPost", "notPost"],
            urlCreate: "type_create",
            orgData: t._scope.types,
            uid: t._scope.id,
            uname: "pid",
            queryname: "name",
            uniparam: "types",
            sync: function (i, n) {
                i.length > 10 ? t._popup.modal({
                    title: "提示",
                    content: "一个商品只能设置最多 <strong>10</strong> 个分类",
                    btn: [{
                        type: "primary",
                        text: "确定",
                        click: "fDelCancel"
                    }],
                    scope: {
                        fDelCancel: function () {
                            t._scope.dataTypeSeletor.orgData = n, t._popup.closeAll()
                        }
                    },
                    onClose: function () {
                        t._scope.dataTypeSeletor.orgData = n, t._popup.closeAll()
                    }, notpreventDefault: !0
                }) : (t._scope.types = i, e.hasInited && (t._rootScope.unsaved = !1))
            }
        }
    }, 
    _initSelectorVendor: function () {
        var e = this,
            t = {};
        t._rootScope = this._rootScope, 
        t._scope = this._scope, 
        t._uri = this._uri, 
        t._popup = this._popup, 
        t._timeout = this._timeout, 
        t._scope.vendors = [], 
        t._scope.data.vendor && t._scope.vendors.push(t._scope.data.vendor), 
        t._scope.dataVendorSeletor = {
            url: ["vendor_getAll", "notPost", "notPost"],
            urlCreate: "vendor_create",
            orgData: t._scope.vendors,
            uid: t._scope.id,
            uname: "pid",
            queryname: "name",
            uniparam: "vendors",
            sync: function (i, n) {
                t._scope.vendors = i, e.hasInited && (t._rootScope.unsaved = !1)
            }
        }
    }, 
    _initSelectorShipment: function () {
        var e = this,
            t = {};
        t._scope = this._scope, 
        t._uri = this._uri, 
        t._popup = this._popup, 
        t._timeout = this._timeout, 
        t._rootScope = this._rootScope, 
        t._scope.shipment_templates = [], 
        t._scope.data.shipment_template && t._scope.shipment_templates.push(t._scope.data.shipment_template), 
        t._scope.dataShipmentSeletor = {
            url: ["shipmentTemplate_getAll", "notPost", "notPost"],
            orgData: t._scope.shipment_templates,
            uniparam: "shipment_templates",
            uname: "pid",
            uid: t._scope.id,
            queryname: "id",
            mapper: {
                id: "shipment_template_id"
            },
            sync: function (i, n) {
                i[0] && (t._scope.shipment_templates = i), 
                e.hasInited && (t._rootScope.unsaved = !1)
            }, 
            directionUp: !0
        }
    }, 
    onInitImages: function () {
        var e = this,
            t = this._util,
            i = this._$Popup,
            n = this._scope,
            a = function () {
                e._uri.get("product_image_getAll", {pid: e._scope.id}, function (t) {
                    e._scope.proimages = [], 
                    e._scope.uploadproimages = [], 
                    _.forEach(t.data.images, function (i) 
                    {
                        "" === i.alt ? i.altshow = "编辑 alt" : i.altshow = i.alt, 
                        i.url = e._uri.getAssetUrl(i.image_path, "158x158"), 
                        i.url4variant = e._uri.getAssetUrl(i.image_path, "100x100"), 
                        i.url4variantSmall = e._uri.getAssetUrl(i.image_path, "36x36"), 
                        t.data.cover_id && t.data.cover_id == i.id && (i.is_cover = !0), 
                        e._scope.proimages.push(i)
                    }), 
                    e._scope.getProDone = !0, 
                    e.onInitVariantImg()
                })
            };
        e._scope.onImgUpload = function (f) {
            var o = f.files;
            if (f.length > 1) {
                return;
            }
            var s = o[0],
            r = {files: o,evt: f,scope: e,arrayName: "uploadProductImage",
                onBeforeUpload: function () {}, 
                onSucc: function (i) {
                    var image_path  = i.url;
                    e._uri.post("product_image_uploadSave",{
                        image_path:image_path,
                        pid: e._scope.id}, function(n){
                            a();
                            e._popup.info({text: "已添加"}, !0)
                        })
                                
                }
            };
            e._uri.multiImgUpload(r);
            if(t.$$childTail) {t.$$childTail.hideCtrlSize = !0; t.$$childTail.hideOutsideImg = !0}
        }, 
        e._scope.fStopProp = function (e) {
            e.stopPropagation()
        }, 
        e._scope.fDrag = function (t) {
            if (t.preventDefault(), 1 == (t.keyCode || t.which)) {
                e._scope.dragTrue = !1;
                var i = t.toElement;
                i || (i = t.target);
                var n;
                if (n = "IMG" == i.tagName ? i.parentNode : i, -1 != n.className.indexOf("pro-edit-images-each")) {
                    var o = n.parentNode,
                        s = 0,
                        r = 0,
                        l = 0,
                        c = 0,
                        d = angular.element(n).clone();
                    e._scope.dragEvt = t, e._scope.dragEvtMove = d, e._scope.dragEvtNum = e._scope.dragEvtMove.attr("data-sort"), e._scope.dragEvtOrg = n, e._scope.dragParent = o, s = n.offsetLeft, r = n.offsetTop, l = t.pageY, c = t.pageX, e._scope.dragEvtMove.css({
                        position: "absolute",
                        top: r + "px",
                        left: s + "px",
                        "pointer-events": "none",
                        "z-index": "1",
                        "margin-left": 0
                    }), e._scope.dragEvtMove.removeClass("transition"), angular.element(e._scope.dragParent).append(e._scope.dragEvtMove), angular.element(e._scope.dragParent).addClass("isDraging"), angular.element(e._scope.dragEvtOrg).attr("data-isOrg", "1"), e._scope.dragEvtMove.attr("data-isDrag", "1"), angular.element(e._scope.dragEvtOrg).css({
                        opacity: "0.3"
                    });
                    var p = function (t) {
                            t.preventDefault();
                            var i = t.toElement;
                            if (i || (i = t.target), "DIV" == i.tagName && i.className.indexOf("pro-edit-images-each") > -1 && "IMG" == i.children[0].tagName && (i = i.children[0]), "IMG" == i.tagName) {
                                if ("1" == angular.element(i.parentNode).attr("data-isOrg")) return;
                                if ("1" == angular.element(i.parentNode).attr("data-isDrag")) return;
                                var n = angular.element(i.parentNode).attr("data-sort");
                                if (n >= 0) {
                                    var a = e._scope.proimages[n],
                                        o = e._scope.proimages[e._scope.dragEvtNum];
                                    e._scope.proimages[n] = o, e._scope.proimages[e._scope.dragEvtNum] = a, e._scope.dragEvtNum != n && (e._scope.dragTrue = !0), e._scope.dragEvtNum = n, e._scope.$apply()
                                }
                            }
                        },
                        u = function (t) {
                            t.preventDefault();
                            var i, n;
                            n = t.pageY - l, i = t.pageX - c, e._scope.dragEvtMove.css({
                                top: r + n + "px",
                                left: s + i + "px"
                            })
                        },
                        m = function (t) {
                            t.preventDefault(), angular.element(e._scope.dragEvtOrg).css({
                                opacity: "1"
                            }), angular.element(e._scope.dragParent).removeClass("isDraging"), angular.element(e._scope.dragEvtOrg).attr("data-isOrg", "0"), e._scope.dragEvtMove.attr("data-isDrag", "0"), angular.element(e._scope.dragParent).children().off("mouseover", p), e._document.off("mousemove", u), e._document.off("mouseup", m), e._scope.dragEvt = null, e._scope.dragEvtMove.remove(), e._scope.dragEvtMove = null, e._scope.dragParent = null;
                            var i = [];
                            _.forEach(e._scope.proimages, function (e) {
                                i.push(e.id)
                            }), e._scope.dragTrue && e._uri.post("product_image_resort", {
                                pid: e._scope.id,
                                imgids: i.join(",")
                            }, function () {
                                a(), e._popup.info({
                                    text: "图片排序已调整"
                                })
                            })
                        };
                    angular.element(e._scope.dragParent).children().on("mouseover", p), e._document.on("mouseup", m), e._document.on("mousemove", u)
                }
            }
        }, e._scope.fSetCover = function (t) {
            e._uri.post("product_image_setCover", {
                imgid: e._scope.proimages[t].id
            }, function (t) {
                t && t.data && t.data.product && (n.baseV = t.data.product.v), 
                a(), 
                e._popup.info({text: "已设为封面"})
            })
        }, e._scope.fTitleIpt = function (t) {
            e._scope.proimages[t].editing = !0
        }, e._scope.fAltIpt = function (t) {
            e._popup.modal({
                title: "编辑图片 alt",
                content: '<div style="margin: 15px 0 35px;"><input class="input input-long" you-validation="trim" placeholder="请输入图片 alt" maxlength="255" ng-model="alt"><br/><div class="text-muted">' + YouText.POPUP_MODAL_ALT_SPEC + "</div></div>",
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: YouText.POPUP_MODAL_BTN_CANCEL,
                    click: "cancel"
                }, {
                    type: "primary",
                    text: YouText.POPUP_MODAL_BTN_CONFIRM_INPUT,
                    click: "confirm",
                    enter: !0
                }],
                focus: "input",
                initModel: {
                    alt: e._scope.proimages[t].alt
                },
                scope: {
                    cancel: function () {
                        e._popup.close()
                    }, 
                    confirm: function (i, n) {
                        if (i.alt == e._scope.proimages[t].alt) return void e._popup.close();
                        n.data.btn[0].hide = !1, 
                        n.data.btn[1].hide = !0, 
                        n.data.btn[2].hide = !0, 
                        e._uri.post("product_image_setAlt", {
                            imgid: e._scope.proimages[t].id,
                            alt: i.alt
                        }, 
                        function () {
                            e._popup.info({
                                text: "图片 alt 修改成功"
                            }), a(), e._popup.close()
                        })
                    }
                }
            })
        }, 
        e._scope.fSaveAlt = function (t) {
            e._scope.proimages[t].editing && (e._scope.proimages[t].editing = !1, e._scope.proimages[t].altshow != e._scope.proimages[t].alt && "" !== e._scope.proimages[t].alt && (e._scope.proimages[t].altshow = "正在提交...", e._uri.post("product_image_setAlt", {
                imgid: e._scope.proimages[t].id,
                alt: e._scope.proimages[t].alt
            }, function () {
                e._popup.info({
                    text: "图片描述设置成功"
                }), a()
            })))
        }, 
        e._scope.fConfirmDel = function (t) {
            console.log(e._scope.proimages)
            var i, o, s = e._scope.proimages[t],
                l = [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: "取消",
                    click: "popCancel"
                }, {
                    type: "danger",
                    text: "确认删除",
                    click: "fDel"
                }];
            i = "删除橱窗图片", 
            o = "你确定要删除商品橱窗图片吗？", 
            e._popup.modal({
                title: i,
                content: o,
                btn: l,
                initModel: {
                    fDel: function () {
                        $(".btn-drop-product").hide(), 
                        this.$parent.data.scope.fDel(this, this.$parent)
                    }
                },
                scope: {
                    contentStyle: {
                        overflow: "visible","z-index": 1
                    },
                    popCancel: function () {
                        e._popup.close()
                    }, 
                    fDel: function (t, i) {
                        i.data.btn[0].hide = !1, 
                        i.data.btn[1].hide = !0, 
                        i.data.btn[2].hide = !0, 
                        e._uri.post("product_image_remove", {imgid: s.id}, function (t) {
                            t && t.data && t.data.product && (n.baseV = t.data.product.v), 
                            e._popup.close(), 
                            e._popup.info({text: "图片已删除"}, !0), 
                            s.fadestyle = {opacity: 0}, 
                            e._timeout(function () {a()}, 600)
                        })
                    }
                }
            }), e._timeout(function () {
                $(".btn-drop-product").css({
                    right: "22px"
                })
            }), e._timeout(function () {
                var e = function (e) {
                    var t = $(this).parent().find(".btn-drop-ls");
                    if (t.is(":visible")) return void t.hide();
                    t.show(), setTimeout(function () {
                        $(".popup").one("click", function () {
                            t.hide()
                        })
                    }, 100)
                };
                $(".btn-drop-product").css({
                    right: "22px"
                }), $(".btn-drop-product > .btn-drop").on("click", e)
            }, 400)
        }, e._scope.fSaveAltByKeyup = function (t, i) {
            switch (t.keyCode) {
            case 13:
                e._scope.fSaveAlt(i);
                break;
            case 27:
                e._scope.proimages[i].editing = !1
            }
        }, a()
    }
});
ProductEditController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util", "$document"];