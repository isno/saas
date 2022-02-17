var CustomerLevelController = BaseGridController.extend({
    _tag: "customer_level",
    init: function(e, t, i, n, a, o) {
        var r = this,
        l = i.getQuery();

        this._super(e, t, i, n, a, o),
        e.onClickBaseBack = function() {
            1 == history.length ? window.open("#/customer", "_self") : i.historyBackCached()
        },
        e.getLevelIcon = function(e) {
            return i.getAssetUrl(e.image_path, "42x42")
        },
        e.creditData = {};
        var c = function(t) {
                i.get("customer_level_credit", null, function(i) {
                    e.creditData.enable = i.data.credit_enabled,
                        e.creditData.ratio = i.data.credit_exchange_ratio,
                        t && t()
                })
            },
        d = {
            update: function() {
                angular.extend(d, e.creditData)
            }
        };
        c(d.update), 
        e.popupCreditSetting = function() {
            d.update();
            var t = {
                    sublinkStyle: {
                        maxHeight: "none"
                    },
                    data: d
                },
                a = [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: "取消",
                    click: "closePop"
                }, {
                    type: "primary",
                    text: "保存",
                    click: "save"
                }],
                o = {
                    title: "经验值设置",
                    content: '<p style="margin-top: 0;">是否启用经验值关联顾客消费<span class="you-help-position-l3-t3" you-help you-help-dir="bottom">启用后，订单交易成功则顾客会获得一定比例的经验值。</span></p><label class="label-block setting-search-label-block {{ data.enable == true ? \'checked\' : \'\' }}"><input you-check type="radio" ng-model="data.enable" ng-value="true" /><div class="label-block-content">启用</div></label>\n<label class="label-block setting-search-label-block {{ data.enable == false ? \'checked\' : \'\' }}"><input you-check type="radio" ng-model="data.enable" ng-value="false" /><div class="label-block-content">不启用</div></label><div class="main-item-sublink-content-wrap transition-quick" ng-style="sublinkStyle"><div class="main-item-sublink-content"><i class="ico ico-mainitem-arr"></i><div style="margin: 10px 0 -20px;">顾客订单<b>交易成功</b>后，每 <b>{{ YouPreset.$() }}1 </b> 获得 <div class="input-unit"><input type="text" class="input input-short" ng-model="data.ratio" you-validation="{{ data.enable ? \'required|nonNegativeNumber|noZero|integer|range(0, 1001, 经验值必须大于1小于1000)|maxNumber\' : \'\'}}"/><span class="input-unit-text">经验值</span></div>&nbsp;&nbsp;<span you-help you-need-compile="true" type="warn">当获取经验值小于 1 时，默认向上取整</span></div></div></div>',
                    btn: a,
                    scope: {
                        closePop: function() {
                            n.closeAll()
                        },
                        save: function(t, o) {
                            if (t.validation.validate(["data.ratio"])) {
                                var s = t.data,
                                    r = {
                                        credit_enabled: s.enable,
                                        credit_exchange_ratio: s.enable ? s.ratio : e.creditData.ratio
                                    };
                                a[0].hide = !1, 
                                a[1].hide = !0, 
                                a[2].hide = !0, 
                                i.post("customer_level_credit", r, function(e) {
                                    n.closeAll(), n.info({
                                        text: "设置成功"
                                    }), c()
                                })
                            } else o.save = !1
                        },
                        contentStyle: {
                            overflow: "visible"
                        }
                    },
                    initModel: t,
                    notpreventDefault: !0,
                    popStyle: {
                        width: "635px"
                    }
                };
            n.modal(o).$$childHead.$$childHead.$watch("data.enable", function(e) {
                e ? (t.sublinkStyle.height = "100px", 
                    t.sublinkStyle.overflow = "visible", 
                    o.popStyle.maxHeight = o.popStyle.minHeight = "300px") : (t.sublinkStyle.height = "0", 
                    t.sublinkStyle.overflow = "overflow", 
                    o.popStyle.maxHeight = o.popStyle.minHeight = "250px")
            })
        }, 
        l && "popup" in l && e.popupCreditSetting(), 
        e.newOrModifyCustomerLevel = function(t, a) {
            var l, c, d;
            a && a.stopPropagation();
            for (var p = {
                    imgBtntxt: "选择图标",
                    imgSrc: "",
                    modify: !1,
                    deletable: !0
                }, 
                u = {}, 
                m = 1, 
                g = []; 
                m <= YouPreset.CUSTOMER_ICON_LIBRARY_NUM; m++) 
                g.push({src: new URI(YouPreset.CUSTOMER_ICON_LIBRARY_PATH).filename(m + ".png").toString()
            });
            var f = {
                title: "新增会员等级",
                scope: {
                    cancelPop: function() {
                        n.close()
                    }
                },
                btn: [{
                    type: "loading",
                    hide: !0
                }, {
                    type: "default",
                    text: "取消",
                    click: "cancelPop"
                }, {
                    type: "primary",
                    text: "新增",
                    click: "fConfirmPop",
                    disabled: !1
                }],
                popStyle: {
                    width: "650px"
                },
                contentextclass: "customer-level-pop",
                notpreventDefault: !0,
                content: '<div class="pop-cont clearfix"><div class="face-edit"><div class="pro-edit-uploadImg customer-level-uploadImg"><div class="pro-edit-noimages customer-level-noimages"><span ng-show="!customerLevel.imgSrc || customerLevel.imgSrc == \'\' "class="pro-edit-noimages-add bg"></span><span ng-show="customerLevel.imgSrc && customerLevel.imgSrc != \'\' "class="face-img-wrap"><img class="face-img-show"ng-src="{{customerLevel.imgSrc}}"></span></div></div><div class="face-edit-btn"><div class="icons-lib-uploadimg-wrap"><input type="file"class="icons-lib-uploadimg"accept="image/gif, image/jpeg, image/jpg, image/png"onchange="angular.element(this).scope().onImgUpload(this);"/><you-btn type="primary"text="上传图标"></you-btn></div><div class="face-edit-btn-tips">尺寸不得大于<br>200*200像素</div></div></div><div class="input-edit"><div class="txt-name">等级名称</div><input type="text"class="input txt-input"ng-model="customerLevel.name"you-validation="required|maxlength(20)"you-validation-encodehtml="true"/></div><div class="input-edit"><div class="txt-name">所需经验值<span class="you-help-position"you-help you-need-compile="true">{{creditData.enable?\'消费\'+YouPreset.$()+\'1累计\'+creditData.ratio+\'经验值\':YouText.CUSTOMER_CREDITS_DISABLED}}</span></div><input type="text"class="input txt-input"ng-disabled="!customerLevel.deletable"ng-model="customerLevel.credits"you-validation="required|integer|maxNumber"you-validation-encodehtml="true"placeholder="{{ creditData.enable ? \'消费\' + YouPreset.$() + \'1累计\' + creditData.ratio + \'经验值\' : YouText.CUSTOMER_CREDITS_DISABLED }}"/></div><div class="input-edit input-edit-discount"><div class="txt-name">折扣规则</div><label class="label-block"ng-class="{checked: hasDiscount == \'0\'}"><input you-check type="radio"ng-model="hasDiscount"name="hasDiscount"ng-value="false"/><div class="label-block-content">不享受任何折扣</div></label><label class="label-block"ng-class="{checked: hasDiscount == \'1\'}"><input you-check type="radio"ng-model="hasDiscount"name="hasDiscount"ng-value="true"/><div class="label-block-content">享受全场折扣<span class="setting-status-pw-edit"ng-if="hasDiscount == \'1\'"><i class="ico ico-arrow-1"></i>全场打<div class="input-unit"><input class="input input-short"ng-model="customerLevel.discount"type="text"you-validation="required|discount"/><span class="input-unit-text">折</span></div></span></div></label></div></div>',
                initModel: {
                    YeePresetPop: YouPreset,
                    hasDiscount: !1,
                    creditData: e.creditData,
                    onImgUpload: function(o) {
                        var r = {
                            files: o.files,
                            evt: o,
                            scope: a,
                            arrayName: "uploadImage",
                            onBeforeUpload: function () {
                                
                            }, onSucc: function (e) {
                                console.log(a);
                                a.customerLevel.imgSrc = i.getAssetUrl(e.url, "118x118");
                              
                                n.close();
                                return ;
                                e.customerLevel.imgSrc = i.getAssetUrl(s.url, "120x120"); 
                                //u.avatar_id = t.data.file.id;
                                n.close();
                            }
                        };
                        i.multiImgUpload(r);
                    }
                }
            };
            if (t) {
                var h = {
                    id: t.id
                };
                i.get("customer_level_getSingle", h, function(e) {
                    200 === e.code ? (p = e.data.customer_level, p.name = o.htmlEnDeCode.htmlDecode(p.name), p.discount = p.discount / 10, l = p.name, c = p.credits, d = p.discount, p.modify = !0, f.title = "修改会员等级信息", p.imgBtntxt = "修改图标", f.btn[2].text = "修改", 10 == d ? p.discount = null : f.initModel.hasDiscount = !0, p.avatar ? p.imgSrc = i.getAssetUrl(p.avatar.file_path, "118x118") : (p.imgSrc = "", p.avatar = {}), f.initModel.customerLevel = p, f.scope.fConfirmPop = function(e, a) {
                        var s = ["customerLevel.name", "customerLevel.credits"];
                        if (Boolean(e.hasDiscount) ? s.push("customerLevel.discount") : e.customerLevel.discount = 10, !e.validation.validate(s)) return void(a.fConfirmPop = !1);
                        a.data.btn[0].hide = !1, a.data.btn[1].hide = !0, a.data.btn[2].hide = !0, u.id = t.id, u.name = o.htmlEnDeCode.htmlEncode(e.customerLevel.name), u.avatar_id || (u.avatar_id = e.customerLevel.avatar.id), u.credits = e.customerLevel.credits, u.discount = 10 * e.customerLevel.discount, i.post("customer_level_save", u, function(e) {
                            200 === e.code ? (r.loading(!0), r._httpGetAll(function() {
                                n.closeAll(), r.loading(!1), n.info({
                                    text: "会员等级修改成功"
                                })
                            })) : (a.data.btn[0].hide = !0, a.data.btn[1].hide = !1, a.data.btn[2].hide = !1, a.fConfirmPop = !1, n.info({
                                type: "danger",
                                text: e.msg.desc
                            }))
                        }, {
                            overrideError: !0
                        })
                    }, n.modal(f)) : n.info({
                        type: "danger",
                        text: e.msg.desc
                    })
                }, {
                    overrideError: !0
                })
            } else f.initModel.customerLevel = p, f.scope.fConfirmPop = function(e, t) {
                var a = ["customerLevel.name", "customerLevel.credits"];
                if (Boolean(e.hasDiscount) ? a.push("customerLevel.discount") : e.customerLevel.discount = null, !e.validation.validate(a)) return void(t.fConfirmPop = !1);
                $(window).off("resize"), 
                t.data.btn[0].hide = !1, 
                t.data.btn[1].hide = !0, 
                t.data.btn[2].hide = !0, 
                u.name = o.htmlEnDeCode.htmlEncode(e.customerLevel.name), 
                u.credits = e.customerLevel.credits, 
                u.discount = 10 * (e.customerLevel.discount || 10), 
                i.post("customer_level_create", u, function(i) {
                    if (200 === i.code) {
                        var a = {
                            name: o.htmlEnDeCode.htmlEncode(e.customerLevel.name),
                            id: i.data.id,
                            src: e.customerLevel.imgSrc
                        };
                        r.loading(!0), r._httpGetAll(function() {
                            n.closeAll(), r.loading(!1), n.info({
                                text: "成功添加会员等级：" + a.name
                            })
                        })
                    } else t.data.btn[0].hide = !0, t.data.btn[1].hide = !1, t.data.btn[2].hide = !1, t.fConfirmPop = !1, n.info({
                        type: "danger",
                        text: i.data.desc
                    })
                }, {
                    overrideError: !0
                })
            }, n.modal(f)
        }, e.onClickRemove = function(e) {
            var t = _.find(r.$scope.list, {
                id: e
            });
            n.modal({
                title: "删除会员等级",
                content: "确定要删除会员等级: <strong>" + t.name + "</strong> ?",
                btn: [{
                    type: "default",
                    text: "取消",
                    click: "fCanclePop"
                }, {
                    type: "danger",
                    text: "确定删除",
                    click: "fConfirmPop"
                }],
                scope: {
                    fConfirmPop: function() {
                        i.post("customer_level_remove", {
                            id: e
                        }, function(e) {
                            200 === e.code ? (n.close(), r.loading(!0), r._httpGetAll(function() {
                                r.loading(!1), n.info({
                                    text: "已删除会员等级：" + t.name
                                })
                            })) : (n.close(), n.info({
                                type: "danger",
                                text: e.msg.desc
                            }))
                        })
                    },
                    fCanclePop: function() {
                        n.close()
                    }
                }
            })
        }
    },
    onInitDone: function(e) {
        var t = this._$Uri;
        e.length > 0 && _.forEach(e, function(e) {
            e.src = t.getAssetUrl(e.file_path, "40x40")
        })
    }
});
CustomerLevelController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util"];
