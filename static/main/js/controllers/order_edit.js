var OrderEditController = BaseEditController.extend({
    _tag: "order",
    _tagUrl: "trade",
    _tagData: "trade",
  init: function(e, t, i, n, a, o, s, r) {
    YouPreset.init("order"),
      YouPreset.init("shipment"),
      this._super(e, t, i, n);
    var l = this;
    l._timeout = a,
      l._sce = s,
      l._time = r,
      e.Util = o,
      e.decodeHtml = o.htmlEnDeCode.htmlDecode,
      e.isOwner = window.YoudianConf.isOwner,
      e.onClickSaveMetaField = function() {
        l.loading(!0),
          i.post("trade_updateAttributeMetaField", {
            id: e.data.attribute_meta_field.id,
            owner_id: e.data.attribute_meta_field.owner_id,
            fields: JSON.stringify(e.data.attribute_meta_field.fields)
          }, function() {
            l.loading(!1),
              l._httpGetSingle(function() {
                n.info({ text: "已保存附加信息" }, !0)
              })
          })
      },
      e.onClickShowTrackers = function(t) {
        if (!t.showTrackers && t.trackers && 0 === t.trackers.length) return void e.onClickRefreshTrackers(t);
        t.showTrackers = !t.showTrackers
      },
      e.getDeviceName = function(e) {
        return (_.find(YouPreset.ORDER_DEVICE, function(t) {
          return t.value === e
        }) || {}).text
      },
      e.onClickRefreshTrackers = function(e, t) {
        if (t && t.stopPropagation(), e.showTrackers = !0, e.ssid == YouPreset.SHIPMENT_SUPPLIER_OTHER_VALUE) return void(e.loadingTrackers = !1);
        if (e && e.sscode && e.ship_no && e.id) {
          var n = {
            type: e.sscode,
            postid: e.ship_no,
            sid: e.id
          };
          e.loadingTrackers = !0;
          i.apiGet("get_tracker", n, function(t) {
            e.loadingTrackers = !1, 
            t && 200 == t.code ? e.trackers = t.data : t && t.message && (e.trackers = [{
              context: t.message
            }])
          }, function(t) {
            e.loadingTrackers = !1
          }, !0)
        }
      };
    e.isSelect = {
      zero: "is-select",
      one: "",
      two: "",
      three: "",
      four: ""
    };
    var c = function(t) {
      for (var i in e.isSelect) i != t && (e.isSelect[i] = "")
    };
    e.historyType = function(t) {
        if (e.nowSelect = t, "" === e.isSelect[t]) switch (e.getDone = !1, t) {
          case "zero":
            e.isSelect.zero = "is-select", c("zero"), l._httpGetSingle();
            break;
          case "one":
            e.isSelect.one = "is-select", c("one"), l._httpGetSingle();
            break;
          case "two":
            e.isSelect.two = "is-select", c("two"), l._httpGetSingle();
            break;
          case "three":
            e.isSelect.three = "is-select", c("three"), l._httpGetSingle();
            break;
          case "four":
            e.isSelect.four = "is-select", c("four"), l._httpGetSingle()
        }
      },
      e.modifyShipping = function() {
        a(function() {
          n.modal({
            title: "修改配送信息",
            popStyle: {
              height: "380px"
            },
            content: '<div class="trade-shipping-modify-pop"><div class="trade-shipping-modify-each">    <div class="title"><span class="trade-shipping-address trade-address-ico ico-position"></span>收货所在地区</div>    <div ng-click="hideTips();">         <you-areaselector data="areaSelector"></you-areaselector>         <span class="input-hide_0"><input name="area_0" type="hidden" you-validation="required"/></span>         <span class="input-hide_{{ areaCls_1 }}"><input name="area_1" type="hidden" you-validation="required"/></span>         <span class="input-hide_{{ areaCls_2 }}"><input name="area_2" type="hidden" you-validation="required"/></span>    </div></div><div class="trade-shipping-modify-each">     <div class="margin-r"><div class="title"><span class="trade-shipping-address trade-address-ico ico-position"></span>详细地址</div><input type="text" ng-model="detailAddress" class="input-sty input-long" you-validation="required"/></div><div class="margin-r"><div class="title"><span class="trade-shipping-address trade-em-ico ico-position"></span>邮编</div> <input type="text"  ng-model="zipcode" class="input-sty" you-validation="zipcode"/></div></div><div class="trade-shipping-modify-each clearfix">     <div class="margin-r"><div class="title"><span class="trade-shipping-address trade-name-ico ico-position"></span>联系人</div><input type="text" ng-model="name" class="input-sty" you-validation="required"/></div><div class="margin-r"><div class="title"><span class="trade-shipping-address trade-mobile-ico ico-position"></span>联系电话</div> <input type="text"  ng-model="mobile" class="input-sty" you-validation="required|phone"/></div></div></div>',
            btn: [{
              type: "loading",
              hide: !0
            }, {
              type: "default",
              text: "取消",
              click: "cancel"
            }, {
              type: "primary",
              text: "修改",
              click: "modify",
              enter: !0
            }],
            initModel: {
              areaSelector: {
                extCls: "input input-sty sel-ipput",
                initCode: e.data.address.area_post ? e.data.address.area_post : "0"
              },
              detailAddress: o.htmlEnDeCode.htmlDecode(e.data.address.detail),
              zipcode: e.data.address.zipcode,
              mobile: e.data.address.mobile,
              name: o.htmlEnDeCode.htmlDecode(e.data.address.name),
              AREA_SELECTOR: YouPreset.AREA_SELECTOR,
              orderId: e.orderId,
              hideTips: function() {
                var e = this;
                e.validation.toggle("area_0", !1), e.validation.toggle("area_1", !1), e.validation.toggle("area_2", !1)
              }
            },
            scope: {
              cancel: function() {
                n.close()
              },
              modify: function(e, t) {
                if (!e.areaSelector.result || "0" == e.areaSelector.result) return e.areaCls_1 = "1", e.areaCls_2 = "2", _.forEach(e.areaSelector.detail, function(t, i) {
                  if (1 != i || t.selectedArea.code || (e.areaCls_2 = "1"), t.selectedArea.code && "0" == t.selectedArea.code) return e.validation.toggle("area_" + i, !0, YouPreset.AREA_SELECTOR[i], !1), !1
                }), void(t.modify = !1);
                if (!e.validation.validate(["detailAddress", "zipcode", "name", "mobile"])) return void(t.modify = !1);
                t.data.btn[0].hide = !1, t.data.btn[1].hide = !0, t.data.btn[2].hide = !0;
                var a = {
                  id: e.orderId,
                  post: e.areaSelector.result,
                  name: o.htmlEnDeCode.htmlEncode(e.name),
                  detail: o.htmlEnDeCode.htmlEncode(e.detailAddress),
                  mobile: e.mobile,
                  zipcode: e.zipcode
                };
                i.post("trade_updateAddress", a, function(e) {
                  200 === e.code ? (l._httpGetSingle(function() {
                    n.info({
                      text: "修改成功"
                    }, !0)
                  }), n.close()) : (n.close(), n.info({
                    type: "danger",
                    text: "修改失败：" + e.data.desc
                  }, !0))
                }, {
                  overrideError: !0
                })
              }
            }
          })
        })
      },
      e.getGatewayTips = function() {
        var t = YouPreset.TRADE_PAYMENT_TYPE[e.data.payment_method.pay_type];
        return e.data.payment_method.collect_by_yd && (t += "- 爱优店代收"), t
      },
      e.onClickSaveNote = function() {
        if (!e.newNote) return void n.info({
          type: "danger",
          text: "请输入笔记内容"
        });
        l.loading(!0),
          i.post("trade_saveNote", {
            id: l.getId(),
            shop_id: window.YoudianConf.shop_id,
            note: e.newNote
          }, function() {
            l.loading(!1),
              l._httpGetSingle(function() {
                e.newNote = "", n.info({ text: "已保存笔记" }, !0)
              })
          })
      },
      e.checkAdmin = function(e) {
        window.YoudianConf.isOwner ? window.location.href = "#/account_edit?id=" + e : n.modal({
          title: "查看管理员信息",
          content: "没有权限查看管理员信息，请联系店主进行此操作。",
          btn: [{
            type: "primary",
            text: "知道了",
            click: "cancel",
            enter: !0
          }],
          scope: {
            cancel: function() {
              n.close()
            }
          }
        })
      },
      l.map_areaDesc = "",
      l.map_address = "";
    var d = $(".input-note");
    e.fTrimThis = function() {
        d.val($.trim(d.val()))
      },
      e.onViewPaymentInfo = function() {
        var t = n.modal({
          title: "支付信息",
          content: ' <div style="line-height:24px;margin-bottom:4px">订单号：' + e.data.no + '</div><you-grid data="dataGrid"><table style="font-size:12px"><colgroup><col width="100"><col width="140"><col><col width="70"><col width="42"><col></colgroup><thead><tr><th style="padding:0 6px">支付方式</th><th style="padding:0 6px">支付编号</th><th style="padding:0 6px">金额</th><th style="padding:0 6px">支付状态</th><th style="padding:0 6px">状态</th><th style="padding:0 6px">备注</th></tr></thead><tbody ng-show="payments.length > 0"><tr ng-repeat="item in payments"><td title="{{ getGatewayTips(item) }}" style="padding:0 6px"><span class="b64-order-payment ico-payment-order-{{ item.gateway }}"></span><span class="b64-order-payment ico-payment-order" ng-if="item.collect_by_yhsd"></span></td><td style="padding:0 6px" title="{{ item.trade_no }}">{{ item.trade_no }}</td><td style="padding:0 6px">{{ YouPreset.$() + util.yuan(item.amount) }}</td><td style="padding:0 6px">{{ getPresetText(item.status) }}</td><td style="padding:0 6px">{{ item.is_available ? "有效" : "无效" }}</td><td title="{{ getPresetReason(item) }}" style="padding:0 6px">{{ getPresetReason(item) }}</td></tr></tbody></table></you-grid>',
          btn: [{
            type: "default",
            text: "关闭",
            click: "cancel"
          }],
          initModel: {
            dataGrid: {},
            payments: e.data.payments,
            getGatewayTips: e.getGatewayTips,
            getPaymentStatusText: e.getPaymentStatusText,
            getPresetReason: function(e) {
              if (e.is_available) return "-";
              var t = _.find(YouPreset.UNAVAIL_REASON, function(t) {
                return t.value == e.unavail_reason
              });
              return t ? t.text : e.unavail_reason
            },
            getPresetText: function(e) {
              return _.find(YouPreset.PAYMENT_STATUS, function(t) {
                return t.value == e
              }).text
            },
            util: e.Util,
            YouPreset: e.YouPreset
          },
          scope: {
            cancel: function() {
              n.close()
            }
          }
        });
        a(function() {
          t.$$childHead.reAdjust()
        })
      },
      e.fnBtnDropClick = function(e) {
        e.stopPropagation();
        var t = $(e.currentTarget).parent().find(".btn-drop-ls");
        if (t.is(":visible")) return void t.hide();
        t.show(), setTimeout(function() {
          $(document).on("click.fnBtnDropClick", function(e) {
            $(e.target).hasClass("btn-drop-ls") || ($(document).off("click.fnBtnDropClick"), t.hide())
          })
        }, 100)
      },
      e.changeShipmentAutoReceiveDay = function(e) {
        n.modalSimple({
          type: "confirm",
          content: "确认将运单 <strong>" + e.ssname + " " + e.ship_no + "</strong> 自动确认收货时间延长<strong>7天</strong>？",
          onConfirm: function() {
            i.post("shipment_change", {
              id: e.id,
              auto_received_at: moment(e.auto_received_at).add(7, "days").format("YYYY-MM-DD")
            }, function(e) {
              l._httpGetSingle(function() {
                n.close(), n.info({
                  text: "已延长收货时间"
                })
              })
            })
          }
        })
      }
  },
  _setTradeBoxHeight: function() {
    var e = this,
      t = e.$scope,
      i = (t.historyDataArray.length, 78 + $(".trade-history-box").height());
    void 0 === e.historyHeight && (e.historyHeight = 0), i > e.historyHeight && (e.historyHeight = i), t.tradeHistoryBoxStyle = {
      height: e.historyHeight + "px"
    }
  },
  _httpGetSingle: function(e) {
    var t = this;
    t.$scope;
    t.loading(!0),
      this._$Uri.get("trade_getSingle", {id: t.getId()}, function(i) {
        t.onInitDone(i.data.trade),
        t.loading(!1), 
        e && e(),
        t._setTradeBoxHeight()
      })
  },
  onInitDone: function(e) {
    function t(e) {
      var t = o.getLite(e),
        i = o.getLite();
      return Math.round((t - i) / 864e5)
    }
    var i = this,
    n = this._$scope,
    a = this._$Uri,
    o = this._time;
    n.data = e,
    n.orderId = i.getId();
    var s = "";
    i.dealHistory(e.history),
    0 === n.data.preferential_records.length ? n.discount = "该订单没有优惠" : (_.forEach(n.data.preferential_records, function(t, i) {
        var a = "";
        switch (0 !== i && (s += "<br>"), t.type) {
          case "promotion":
            a = t.promotion_name;
            break;
          case "customer_level":
            a = t.customer_level_name;
            break;
          case "coupon":
            a = "优惠券：" + t.coupon_code;
            break;
          case "reward_point":
            a = "积分抵现：" + Math.abs(e.point) + "积分"
        }
        s += a + ' <strong style="margin-left: 10px;">-' + n.YouPreset.$() + t.amount / 100 + "</strong>"
      }), n.discount = s),
      _.forEach(n.data.shipments, function(e) {
        _.forEach(e.items, function(e) {
            e.image = a.getAssetUrl(e.image_path, "100x100")
          }),
          e.tempSupplier = [],
          e.dataSupplier = {
            btnname: "选择物流",
            cnname: "物流",
            isUniq: !0,
            inputplaceholder: "搜索物流",
            btnautostatus: !0,
            staticMode: !0,
            mode: "search",
            url: ["shipmentSupplier_getAll", "notPost", "notPost"],
            uniparam: "shipment_suppliers",
            uname: "id",
            uid: i.getId(),
            queryname: "desc",
            orgData: e.tempSupplier,
            sync: function(t) {
              e.tempSupplier = t,
                t && t[0] && t[0].id == YouPreset.SHIPMENT_SUPPLIER_NONE_VALUE ? e.isNoneSupplier = !0 : e.isNoneSupplier = !1,
                t && t[0] && t[0].id == YouPreset.SHIPMENT_SUPPLIER_OTHER_VALUE ? e.isOtherSupplier = !0 : e.isOtherSupplier = !1
            },
            btnnameUniq: !0,
            noResultExtHTML: '请选择 <span class="text-link"">' + YouPreset.SHIPMENT_SUPPLIER_SP[0].text + "</>",
            noResultExtHTMLClick: function(t) {
              e.tempSupplier[0] = {
                id: YouPreset.SHIPMENT_SUPPLIER_SP[0].value,
                desc: YouPreset.SHIPMENT_SUPPLIER_SP[0].text
              }, e.otherSupplier = t.searchTxt
            },
            footerLinks: [{
              text: YouPreset.SHIPMENT_SUPPLIER_SP[1].text,
              click: function() {
                e.tempSupplier[0] = {
                  id: YouPreset.SHIPMENT_SUPPLIER_SP[1].value,
                  desc: YouPreset.SHIPMENT_SUPPLIER_SP[1].text
                }
              }
            }]
          }
      });
    var r = [];
    _.forEach(n.data.shipments, function(e) {

        0 !== e.status && e.ssid != YouPreset.SHIPMENT_SUPPLIER_NONE_VALUE && (e.trackers && (e.trackers = []), e.auto_received_in = t(e.auto_received_at), r.push(e))
      }),
      r[0] && (r[0].loadingTrackers = !0),
      n.shipmentInfo = r,
      n.shipmentInfo.length > 0 && n.onClickRefreshTrackers(n.shipmentInfo[0]),
      this._initShipments(),
      this._initRefundMoney(),
      i._timeout(function() {
        i._setTradeBoxHeight()
      }),
      i.initMap(n.data.address.areas, n.data.address.detail),
      n.allowTradeRefund = "0_0" == n.data.status || "0_1" == n.data.status,
      n.orderStatus = _.find(YouPreset.ORDER_STATUS, function(e) {
        return e.value == n.data.status
      }).text,
      _.forEach(n.data.notes, function(e, t) {
        e.avatarUrl = a.getAssetUrl(e.account.image_path, "42x42")
      });
    e.customer.avatar_url = a.getAssetUrl(e.customer.avatar_path, "100x100")
  },
  _initRefundMoney: function() {
    var e = this,
      t = this._$scope,
      i = this._$Uri,
      n = this._$Popup,
      a = this._timeout,
      o = this._sce,
      s = function(e) {
        var t = _.find(YouPreset.REFUND_STATUS_TEXT, function(t) {
          return t.value == e
        });
        if (t) return t.text
      },
      r = function(e, t) {
        var i, n = t.collect_by_yd,
          a = t.value,
          o = s(e);
        if (n);
        else switch (e) {
          case "fail":
            "alipay" == a && (i = "可能由于操作不当或者支付宝自身原因导致本次退款失败，请先检查支付宝账号或重新配置支付宝（即时到账），再退款。"), "wppay" == a && (i = "由于微信支付自身原因导致本次退款失败，请先检查微信支付账号或重新配置微信支付，再退款。")
        }
        return {
          label: o,
          content: i
        }
      },
      l = function(e) {
        i.get("refunds", {
          order_id: t.orderId
        }, function(t) {
          e && e(t.data)
        })
      },
      c = function(e) {
        var i = "2" == t.data.payment_status,
          n = t.data.auto_total_amount,
          a = {
            refundable: !1,
            loading: !1,
            status: "",
            unrefundableClass: "trade-edit-status t-refund-succ"
          };
        if (i && n) {
          var s = t.data.payment_method,
            c = _.find(YouPreset.REFUNDABLE_GATEWAYS, {
              collect_by_yhsd: s.collect_by_yd,
              value: s.gateway
            });
          c ? (a.loading = !0, l(function(i) {
            t.orderStatus;
            t.refundMsg = i, t.refundMsg.refunds.forEach(function(e, t) {
              "pending" != e.status && "refunding" != e.status || (e.status = "pending"), e.pos = t + 1
            });
            var n = "refundable",
              s = t.refundMsg.refunds.slice(-1)[0];
            s && (n = s.status);
            var l = r(n, c);
            "alipay" === c.value && c.collect_by_yd;
            a.refundable = t.refundMsg.refundable, a.status = n, "fail" == n && (a.unrefundableClass = "trade-edit-status t-refund"), a.refundable = t.refundMsg.refundable, t.refundMsg.amount === t.refundMsg.refund_amount && (a.refundable = !1), a.loading = !1, a.content = o.trustAsHtml(l.content), a.label = l.label, e && e()
          })) : "offline" == s.gateway ? e && e() : (a.content = '注意：退款需要商家手工操作&nbsp;&nbsp;<a href="{{YouPreset.DOCS_HELP_RETURN_FUND}}#3-" target="_blank"><span class="b64-you-help-reverse you-help-ico" title="点击查看退款到账说明"></span></a>', e && e())
        }
        t.refundInfo = a
      };
    c(), 
    t.delegateContentClick = function(e) {
      var i = e.target,
        n = $(i).data("invoke-scope-fn");
      n in t && t[n].call(t)
    };
    var d = function(e, t, a, o) {
      i.post("refunds", e, function(e) {
        t && (t.location.href = e.data.data.url), a && a()
      }, {
        errorCallback: function(e) {
          if (t && t.close(), 201 == e.code) {
            var a = {
              title: "退款异常",
              btn: [{
                type: "primary",
                text: "确定",
                click: "closePop"
              }],
              scope: {
                closePop: function() {
                  o && o(), n.close()
                }
              },
              forceMask: !0,
              notpreventDefault: !0
            };
            if (e.data.desc.indexOf("账户资金不足") > -1) {
              this.preventDefaultCall = !0;
              var s = "/";
              a.content = '<a href="' + s + '" target="_blank" class="text-link">账户资金</a>不足！请待资金充足时再退款或者联系顾客进行线下退款。', n.modal(a)
            } else e.data.desc.indexOf("微信支付尚未配置") > -1 ? (this.preventDefaultCall = !0, a.content = '您的微信支付尚未配置商户平台API证书和证书密码，请前往<a href="#/payment" target="_blank" class="text-link">收款方式</a>中进行配置。', n.modal(a)) : (this.preventDefaultCall = !0, a.content = e.data.desc, n.modal(a))
          }
        }
      })
    };
    t.onRefundMoneyBefore = function() {
      var i = t.data.payment_method,
        o = [{
          type: "default",
          text: "关闭",
          click: "closePop"
        }];
      c(function() {
        var r = n.modal({
          title: "退款",
          content: '<div class="trade-refund-wrap">    <div class="trade-refund-tip" ng-show="!data.status && data.refunding_amount != 0">正在退款中，操作暂无法使用。<span ng-show="data.show_payment_link" ng-click="onReopenRefundWindow()" class="text-link">点击前往支付宝退款申请页面</span></div>   <div class="trade-refund-tip-2">注意事项 ：<ul><li>退款具体到账时间视各支付平台而定 </li><li>针对订单部分退款，商品库存不会自动调整</li><li>订单成交价格不会进行变更</li></ul>   </div>    <div class="trade-refund-t">        <div class="trade-refund-t-each trade-refund-t-l">            <div class="trade-refund-t-l-each">订单金额：<b title="{{ YouPreset.$() + util.yuan(data.order_amount) }}">{{ YouPreset.$() + util.yuan(data.order_amount) }}</b></div>            <div class="trade-refund-t-l-each">剩余金额：<b title="{{ YouPreset.$() + util.yuan(data.last_refund_amount) }}">{{ YouPreset.$() + util.yuan(data.last_refund_amount) }}</b></div>            <div class="trade-refund-t-l-each">正在退款：<b title="{{ YouPreset.$() + util.yuan(data.refunding_amount) }}">{{ YouPreset.$() + util.yuan(data.refunding_amount) }}</b></div>            <div class="trade-refund-t-l-each">已退金额：<b title="{{ YouPreset.$() + util.yuan(data.refund_amount) }}">{{ YouPreset.$() + util.yuan(data.refund_amount) }}</b></div>        </div>        <ul class="trade-refund-t-each trade-refund-t-r">            <li>退款金额：<div class="input-unit" style="width: 210px"><div class="input-group"><div class="input-group-addon" ng-disabled="!data.status">{{YouPreset.$()}}</div><input ng-model="data.ipt_refund_amount" ng-disabled="!data.status" you-validation="required|allNumber|positiveNumber|float2" type="text" class="input"></div></div></li>            <li>退款备注：<input ng-model="data.ipt_refund_reason" ng-disabled="!data.status" you-validation="maxlength(30)" placeholder="协商退款" type="text" class="input" style="width: 210px"></li>            <li>                <you-btn ng-hide="data.loading" ng-click="onConfirm()" ng-disabled="!data.status" type="primary" text="确认提交"></you-btn>                <you-btn ng-show="data.loading" type="loading"></you-btn>            </li>            </li>        </ul>    </div>    <div class="trade-refund-b">        <div style="line-height:24px;margin: 14px 0 4px;">退款记录</div>        <you-grid data="dataGrid">            <table style="font-size:12px">                <colgroup>                    <col width="60">                    <col width="140">                    <col width="120">                    <col width="100">                    <col>                </colgroup>                <thead>                    <tr>                        <th>编号</th>                        <th style="padding:0 6px">退款时间</th>                        <th style="padding:0 6px">退款金额</th>                        <th style="padding:0 6px">退款状态</th>                        <th style="padding:0 6px">退款备注</th>                    </tr>                </thead>                <tbody ng-show="data.refunds.length > 0">                    <tr ng-repeat="item in data.refunds | orderBy : \'pos\' : true">                        <td>{{ ::item.pos }}</td>                        <td style="padding:0 6px" title="{{ ::item.created_at | date: \'yyyy/MM/dd HH:mm\' }}">{{ ::item.created_at | date: \'yyyy/MM/dd HH:mm\' }}</td>                        <td style="padding:0 6px" title="{{ ::YouPreset.$() + util.yuan(item.amount) }}">{{ ::YouPreset.$() + util.yuan(item.amount) }}</td>                        <td style="padding:0 6px">{{ ::getStatusText(item.status) }}</td>                        <td style="padding:0 6px"><span title="{{ ::item.reason }}">{{ ::item.reason || \'-\' }}</span></td>                    </tr>                </tbody>            </table>            <div ng-hide="data.refunds.length > 0" style="margin: 15px 0 0;text-align:center;color: #aaa;">暂无退款记录</div>        </you-grid>    </div></div>',
          btn: o,
          initModel: {
            YouPreset: YouPreset,
            util: t.Util,
            data: {
              status: t.refundMsg.status,
              refunds: t.refundMsg.refunds,
              loading: !1,
              order_amount: t.refundMsg.amount,
              refund_amount: t.refundMsg.refund_amount,
              refunding_amount: t.refundMsg.refunding_amount,
              last_refund_amount: t.refundMsg.amount - t.refundMsg.refund_amount - t.refundMsg.refunding_amount,
              ipt_refund_amount: "",
              ipt_refund_reason: "",
              show_payment_link: "alipay" == i.gateway && !i.collect_by_yhsd
            },
            getStatusText: s,
            refresh: function() {
              var e = this.data;
              e.status = t.refundMsg.status, e.refunds = t.refundMsg.refunds, e.loading = !1, e.order_amount = t.refundMsg.amount, e.refund_amount = t.refundMsg.refund_amount, e.refunding_amount = t.refundMsg.refunding_amount, e.last_refund_amount = t.refundMsg.amount - t.refundMsg.refund_amount - t.refundMsg.refunding_amount, e.ipt_refund_amount = "", e.ipt_refund_reason = ""
            },
            onConfirm: function() {
              var a = this,
                o = this.data;
              if (a.$parent.validation.validate(["data.ipt_refund_amount", "data.ipt_refund_reason"])) {
                var s = t.Util.fen(o.ipt_refund_amount);
                if (o.last_refund_amount < s) return void a.$parent.validation.toggle("data.ipt_refund_amount", !0, "退款金额不能高于剩余金额");
                var r = o.ipt_refund_reason || "协商退款";
                o.loading = !0, e.loading();
                var l = {
                  order_id: e.getId(),
                  amount: s,
                  reason: r
                };
                "alipay" != i.gateway || i.collect_by_yhsd ? d(l, null, function() {
                  c(function() {
                    o.loading = !1, n.info({
                      text: "已提交退款"
                    }), a.refresh()
                  })
                }, function() {
                  o.loading = !1
                }) : a.onOpenRefundWindow(l)
              }
            },
            onReopenRefundWindow: function() {
              var t = this,
                i = this.data;
              if (i.refunds) {
                var n = i.refunds.slice(-1)[0];
                n && t.onOpenRefundWindow({
                  order_id: e.getId(),
                  refund_id: n.id
                })
              }
            },
            onOpenRefundWindow: function(e) {
              var t = this,
                i = this.data,
                n = window.open();
              n.document.write("跳转中..."), t.popResultConfirm(), d(e, n, function() {
                c(function() {
                  i.loading = !1, t.refresh()
                })
              }, function() {
                i.loading = !1
              })
            },
            popResultConfirm: function() {
              var e = this,
                t = {
                  refresh: function() {
                    n.close(), c(function() {
                      e.refresh()
                    })
                  }
                };
              n.modal({
                title: "退款操作",
                content: "请在新开的支付宝页面进行退款，退款操作结束前请不要关闭页面。",
                btn: [{
                  type: "default",
                  text: "退款遇到问题",
                  click: "refresh"
                }, {
                  type: "primary",
                  text: "已完成退款",
                  click: "refresh"
                }],
                scope: t,
                onClose: t.refresh,
                forceMask: !0
              })
            }
          },
          scope: {
            contentStyle: {
              overflow: "visible"
            },
            closePop: function() {
              n.close()
            },
            onConfirm: function() {
              o[0].disabled = !0, o[1].hide = !0, o[2].hide = !1
            }
          },
          popStyle: {
            width: "660px"
          }
        });
        a(function() {
          r.PopupModalData.popStyle.bottom = "unset"
        }, 200)
      })
    }
  },
  _initShipments: function() {
    var e = this,
      t = this._$scope,
      i = this._$Uri,
      n = this._$Popup;
      t.getPaymentStatusText = function(e) {
        return _.find(YouPreset.PAYMENT_STATUS, function(t) {
          return t.value == e
        }).text
      }, 
      t.getShipmentStatusText = function(e) {
        return _.find(YouPreset.SHIPMENT_STATUS, function(t) {
          return t.value == e
        }).text
      }, 
      t.getShipmentTypeText = function(e) {
        return _.find(YouPreset.SHIPMENT_TEMPLATE_RULE, function(t) {
          return t.value == e
        }).text
      }, 
      t.canEditShipment = function() {
        return !(!t.data.avail || "0_0" != t.data.status && "0_1" != t.data.status)
      }, 
      t.canSendShipment = function() {
        return 0 !== t.data.payment_status
      }, 
      t.canCheckAll = function() {
        var e = !1;
        return _.forEach(t.data.shipments, function(t) {
          0 === t.status && (e = !0)
        }), e
      }, 
      t.isCheckAll = function() {
        var e = !0,
          i = 0;
        return _.forEach(t.data.shipments, function(t) {
          0 === t.status && (i++, t.isChecked || (e = !1))
        }), e && i
      }, 
      t.onClickCheckAll = function() {
        var e = t.isCheckAll();
        _.forEach(t.data.shipments, function(t) {
          0 === t.status && (t.isChecked = !e)
        })
      }, 
      t.canMultiOp = function() {
        var e = !1;
        return _.forEach(t.data.shipments, function(t) {
          t.isChecked && (e = !0)
        }), e
      }, 
      t.canMergeShipment = function() {
        var e = 0;
        return _.forEach(t.data.shipments, function(t) {
          t.isChecked && e++
        }), e > 1
      }, 
      t.onMergeShipment = function() {
        e._modalShipmentMergeSplit(!0)
      }, 
      t.canSplitShipment = function() {
        var e = 0;
        return _.forEach(t.data.shipments, function(t) {
          t.isChecked && t.items.length > 1 && e++
        }), 1 === e
      }, 
      t.onSplitShipment = function() {
        e._modalShipmentMergeSplit(!1)
      }, 
      t.onMultiSendShipment = function() {
        var a = !1;
        _.forEach(t.data.shipments, function(e) {
          e.isChecked && (1 == e.ssid || e.ship_no || (a = !0))
        });
        var o = function() {
          var a = [];
          _.forEach(t.data.shipments, function(e) {
            e.isChecked && a.push(e.id)
          }), i.post("shipment_multiSend", {
            ids: JSON.stringify(a)
          }, function() {
            e._httpGetSingle(function() {
              n.info({
                text: "已发货 " + a.length + " 个运单"
              }), n.close()
            })
          })
        };
        a ? n.modalSimple({
          action: "确认发货",
          type: "danger",
          content: "确定在部分商品未录入运单号的情况下发货吗？发货后将无法撤回到未发货状态！",
          onConfirm: function() {
            o()
          }
        }) : o()
      }, 
      t.onSendShipment = function(t) {
        var a;
        a = 1 == t.ssid ? "确定发货吗？发货后将无法撤回未发货状态。" : t.ship_no ? "确定发货吗？发货后将无法撤回未发货状态。" : "确定在未录入运单号的情况下发货吗? 发货后将无法撤回到未发货状态！",
          n.modalSimple({
            action: "确认发货",
            type: "danger",
            content: a,
            onConfirm: function() {
              i.post("shipment_send", {id: t.id
              }, function() {
                e._httpGetSingle(function() {
                  n.info({text: "已发货"}), 
                  n.close()
                })
              })
            }
          })
      },
      t.onClickEditShipment = function(e) {
        if (e.isEdit = !0, null === e.ssid);
        else switch (e.tempSupplier[0] = {
            id: e.ssid,
            desc: e.scsname ? e.scsname : e.ssname
          },
          e.isOtherSupplier = !1,
          e.isNoneSupplier = !1,
          e.otherSupplier = "",
          e.tempNumber = e.ship_no,
          e.tempSupplier[0].id) {
          case YouPreset.SHIPMENT_SUPPLIER_OTHER_VALUE:
            e.tempSupplier[0].desc = YouText.SHIPMENT_SUPPLIER_OTHER,
              e.isOtherSupplier = !0,
              e.otherSupplier = e.scsname;
            break;
          case YouPreset.SHIPMENT_SUPPLIER_NONE_VALUE:
            e.tempSupplier[0].desc = YouText.SHIPMENT_SUPPLIER_NONE,
              e.isNoneSupplier = !0
        }
      },
      t.onSaveShipment = function(a, o) {
        if (!a.tempSupplier[0] || "number" != typeof a.tempSupplier[0].id) return void n.info({type: "danger",text: "请选择物流方式"});
        var s = a.tempSupplier[0].id,
          r = a.otherSupplier,
          l = {
            id: a.id,
            ship_no: a.tempNumber,
            ssid: s,
            scsname: r
          },
          c = !0;
        s == YouPreset.SHIPMENT_SUPPLIER_OTHER_VALUE ? c = t.validation.validate(["otherSupplier_" + o, "shipmentNumber_" + o]) : s == YouPreset.SHIPMENT_SUPPLIER_NONE_VALUE ? (l.ship_no = null, l.scsname = null) : (c = t.validation.validate(["shipmentNumber_" + o]), l.scsname = null), c && (a.isSaving = !0, i.post("shipment_save", l, function() {
          e._httpGetSingle(function() {
            a.isSaving = !1, a.isEdit = !1, n.info({
              text: "已保存运单"
            })
          })
        }))
      }, t.onTradeRefundTrue = function(a) {
        var o, s = {id: e.getId()},
          r = "退单";
        "3" == t.data.status ? o = "确定要同意用户退单申请吗？" : t.refundInfo.refundable && t.refundMsg.status && a ? (o = "取消订单后，系统将自动进行退款，确认是否操作？", r = "退单且退款", s.refund = !0) : o = "确认取消该订单吗？", n.modalSimple({
          type: "danger",
          action: r,
          content: o,
          onConfirm: function() {
            i.post("trade_refund", s, function(t) {
              200 === t.code ? e._httpGetSingle(function() {
                n.close(), n.info({
                  text: a ? "退单成功，系统将自动进行退款" : "已退单",
                  timeout: 6e3
                })
              }) : (n.modal({
                title: "提示",
                content: data.data.desc,
                btn: [{
                  type: "primary",
                  text: "确定",
                  click: "cancelPop"
                }],
                scope: {
                  confirm: function() {
                    e._httpGetSingle(function(e) {
                      n.closeAll()
                    })
                  }
                },
                forceMask: !0
              }), n.loading(!1))
            }, {
              overrideError: !0
            })
          }
        })
      }, t.onTradeRefundFalse = function() {
        n.modal({
          title: "拒绝退单",
          content: '拒绝理由：<br><textarea class="input input-long" style="position: relative; top: 8px;" rows="3" ng-model="reason" you-validation="required" ></textarea><div style="width: 100%; height: 35px;"></div>',
          btn: [{
            type: "loading",
            hide: !0
          }, {
            type: "default",
            text: "取消",
            click: "cancel"
          }, {
            type: "danger",
            text: "确定",
            click: "confirm",
            enter: !0
          }],
          initModel: {
            reason: "你的退单申请未被通过"
          },
          scope: {
            confirm: function(t, a) {
              if (!t.validation.validate(["reason"])) return void(a.confirm = !1);
              a.data.btn[0].hide = !1, a.data.btn[1].hide = !0, a.data.btn[2].hide = !0, i.post("trade_refuseRefund", {
                id: e.getId(),
                reason: t.reason
              }, function() {
                e._httpGetSingle(function() {
                  n.info({
                    text: "已拒绝退单"
                  }), n.close()
                })
              })
            },
            cancel: function() {
              n.close()
            }
          }
        })
      },
      t.hasChangeAmount = function() {
        if (t.data) return t.data.total_amount != t.data.auto_total_amount
      },
      t.onClickChangeAmount = function() {
        e._modalChangeAmount()
      },
      t.onFinishOrder = function() {
        var a = !0;
        _.forEach(t.data.shipments, function(e, t) {
          a = a && 1 === e.status
        }), "0_0" != t.data.status && "0_1" != t.data.status || (a ? n.modal({
          title: "修改订单状态",
          content: '确定将订单状态手动修改为“已完成”？<span class="text-danger">修改后将无法编辑物流信息。</span>',
          btn: [{
            type: "loading",
            hide: !0
          }, {
            type: "default",
            text: YouText.POPUP_MODAL_BTN_CANCEL,
            click: "cancel"
          }, {
            type: "danger",
            text: YouText.POPUP_MODAL_BTN_CONFIRM,
            click: "confirm",
            enter: !0
          }],
          scope: {
            confirm: function(t, a) {
              a.data.btn[0].hide = !1, a.data.btn[1].hide = !0, a.data.btn[2].hide = !0, i.post("trade_achieve", {
                id: e.getId()
              }, function() {
                e._httpGetSingle(function() {
                  n.info({
                    text: "订单状态已修改为“已完成”"
                  }), n.close()
                })
              })
            },
            cancel: function() {
              n.close()
            }
          }
        }) : n.modal({
          title: "修改订单状态",
          content: "所有商品发货后，才可将订单状态手动修改为“已完成”",
          btn: [{
            type: "primary",
            text: "知道了",
            click: "cancel",
            enter: !0
          }],
          scope: {
            cancel: function() {
              n.close()
            }
          }
        }))
      }
  },
  _modalShipmentMergeSplit: function(e) {
    var t = this,
      i = this._$scope,
      n = this._$Popup,
      a = this._$Uri,
      o = _.cloneDeep(YouPreset.SHIPMENT_TEMPLATE_RULE),
      s = [];
    _.forEach(i.data.shipments, function(e) {
      e.isChecked && s.push(e.id)
    });
    var r;
    n.modal({
      title: e ? "合并运单" : "拆分运单",
      content: '选择配送方式：<br></span><you-check-btn style="position:relative; top:5px;" data="$parent.$parent.PopupModalData.initModel.dataShipment"></you-check-btn><br><div style="margin-left: 50px; margin-top: -20px"><input style="display: none" name="shipmentType" you-validation /></div><br><br>',
      btn: [{
        type: "loading",
        hide: !0
      }, {
        type: "default",
        text: "取消",
        click: "cancel"
      }, {
        type: "primary",
        text: "确定",
        click: "confirm",
        enter: !0
      }],
      initModel: {
        dataShipment: {
          list: o,
          onSelected: function() {
            r && r.validation.toggle("shipmentType", !1)
          }
        }
      },
      scope: {
        confirm: function(i, l) {
          var c = o[i.dataShipment.selected];
          if (void 0 === c) return r = i, r.validation.toggle("shipmentType", !0, "请选择配送方式"), void(l.confirm = !1);
          l.data.btn[0].hide = !1, l.data.btn[1].hide = !0, l.data.btn[2].hide = !0, c = c.value;
          var d, p = {ship_type: c};
          e ? (d = "shipment_merge", p.ids = "[" + s.toString() + "]") : (d = "shipment_split", p.id = s.toString()), a.post(d, p, function() {
            t._httpGetSingle(function() {
              n.close(), n.info({
                text: e ? "已合并运单" : "已拆分运单"
              })
            })
          })
        },
        cancel: function() {
          n.close()
        }
      }
    })
  },
  _modalChangeAmount: function() {
    var e = this,
      t = this._$scope,
      i = this._$Popup,
      n = this._$Uri,
      a = t.Util,
      o = t.data.total_amount;
    i.modal({
      title: "改价",
      content: '<h3 class="summit-h3">新价格：</h3><div class="input-group"><div class="input-group-addon">{{YouPreset.$()}}</div><input class="input input-long {{subErr}}" ng-model="newAmount" you-validation="required|nonNegativeNumber|float2|maxTotal" ng-focus="clearTips() "/></div><div class="tips-down tips-down-modify-price" ng-show="bIsErr"> <span class="ico ico-invalid-arrow icon"></span><span ng-bind="addErr"></span>新价格不能与原价相同</div><ul class="ul-adjust"><li>改新价格后，请及时提醒买家刷新订单页面，重新点击 “去付款” 进行支付</li><li>改价为 0 元，则订单将无需买家进行支付，状态将会更新为支付成功</li></ul><br><br><br>',
      btn: [{
        type: "loading",
        hide: !0
      }, {
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
      notpreventDefault: !0,
      scope: {
        confirm: function(a, s) {
          return a.validation.validate(["newAmount"]) ? o == 100 * a.newAmount ? (s.confirm = !1, a.bIsErr = !0, void(a.subErr = "tips-down-modify-price-err")) : (s.data.btn[0].hide = !1, s.data.btn[1].hide = !0, s.data.btn[2].hide = !0, void n.post("trade_saveTotalAmount", {
            id: e.getId(),
            total_amount: t.Util.fen(a.newAmount)
          }, function() {
            e._httpGetSingle(function() {
              i.close(), i.info({
                text: "已手动改价为 " + YouPreset.$() + a.newAmount
              })
            })
          })) : void(s.confirm = !1)
        },
        cancel: function() {
          i.close()
        }
      },
      initModel: {
        newAmount: a.yuan(t.data.total_amount),
        clearTips: function() {
          this.bIsErr = !1
        }
      }
    })
  },
  dealHistory: function(e) {
    var t = this._$scope,
      i = {};
    t.historyDataArray = [];
    var n;
    _.forEach(e, function(e) {
      var t = moment(e.actived_at).format("YYYY/MM/DD");
      i[t] || (i[t] = []), i[t].push(e)
    }), t.bNotShipment = !0, t.bNotBack = !0;
    for (var a in i) {
      n = {
        date: a,
        history: []
      };
      for (var o in t.isSelect) switch (o) {
        case "zero":
          "" !== t.isSelect[o] && (n.history = i[a]);
          break;
        case "one":
          "" !== t.isSelect[o] && (n.history = _.filter(i[a], {
            type: 0
          }));
          break;
        case "two":
          "" !== t.isSelect[o] && (n.history = _.filter(i[a], {
            type: 1
          }), n.history && n.history.length > 0 && (t.bNotShipment = !1));
          break;
        case "three":
          "" !== t.isSelect[o] && (n.history = _.filter(i[a], {
            type: 2
          }), n.history && n.history.length > 0 && (t.bNotBack = !1));
          break;
        case "four":
          "" !== t.isSelect[o] && (n.history = _.filter(i[a], {
            type: 3
          }), n.history && n.history.length > 0 && (t.bNotBack = !1))
      }
      t.historyDataArray.push(n)
    }
    t.getDone = !0
  },
  initArea: function() {
    function e(e, t) {
      n.get("area_getAll", {
        post: t
      }, function(t) {
        t.data.areas && t.data.areas.length > 0 ? a.areas[e] = t.data.areas : a.areas[e] = void 0, a.isAreaInit || (2 == e && (a.isAreaInit = !0), i.shipmentArea[e] ? a.area[e] = _.find(t.data.areas, function(t) {
          return t.post == i.shipmentArea[e].post
        }) : a.isAreaInit = !0)
      })
    }

    function t(t) {
      for (var i = t + 1; i < 3; i++) a.area[i] = null, a.areas[i] = null;
      a.area[t] && e(t + 1, a.area[t].post)
    }
    var i = this,
      n = this._$Uri,
      a = this._$scope;
    a.area = [], a.areas = [], i.shipmentArea = a.data.address.areas, i.shipmentArea || (i.shipmentArea = {}), e(0, null), a.isAreaInit = !1, i.hasInited || (a.$watch("area[0]", function() {
      t(0)
    }), a.$watch("area[1]", function() {
      t(1)
    }), i.hasInited = !0)
  },
  initMap: function(e, t) {
    var i = this,
      n = this._$Uri,
      a = this._$scope,
      o = this._timeout,
      s = URI("api.map.baidu.com").protocol(location.protocol).toString();
    if (i.map_areaDesc != e || i.map_address != t) {
      i.map_areaDesc = e, i.map_address = t, $(".map-block").css({
        "max-height": "0px"
      });
      var r, l, c = "/static/main/img/map-marker2.png",
        d = ["北京市", "上海市", "天津市", "重庆市", "香港特别行政区", "澳门特别行政区"],
        p = "9mlmMyVwLsIui8pNVxWDEDVu",
        u = e.split(","),
        m = u.join(" "),
        g = m + " " + t,
        f = u[1];
      d.indexOf(u[0]) > -1 && (f = u[0], m = u[0] + " " + u[2], g = m + " " + t);
      var h = URI(s).path("/place/v2/search").search({
          ak: p,
          output: "json",
          query: g,
          page_size: 10,
          page_num: 0,
          scope: 1,
          region: f,
          callback: "JSON_CALLBACK"
        }).toString(),
        _ = function() {
          a.mapImgSrc = "",
            a.mapAhref = "",
            a.showImgpic = !1
        },
        v = function(e, t) {
          a.mapImgSrc = e,
            a.mapAhref = t,
            a.showImgpic = !0
        },
        y = function(e, t, i) {
          n.getJSONP(e, function(e) {
            if (0 === e.status)
              if (e.total) r = e.results[0].location.lng, l = e.results[0].location.lat, v(URI(s).path("/staticimage").search({
                center: r + "," + l,
                width: 360,
                height: 123,
                zoom: 15,
                copyright: 1,
                markers: r + "," + l,
                markerStyles: "-1," + c + ",-1"
              }).toString(), URI(s).path("/place/search").search({
                query: t,
                location: l + "," + r,
                radius: 1e3,
                output: "html",
                region: f,
                src: "收货地址查询"
              }).toString());
              else if (i) {
              var n = URI(s).path("/place/v2/search").search({
                ak: p,
                output: "json",
                query: m,
                page_size: 10,
                page_num: 0,
                scope: 1,
                region: f,
                callback: "JSON_CALLBACK"
              }).toString();
              y(n, m)
            } else e.results.length > 0 ? (r = e.results[0].location.lng, l = e.results[0].location.lat, v(URI(s).path("/staticimage").search({
              center: r + "," + l,
              width: 360,
              height: 123,
              zoom: 11,
              copyright: 1,
              markers: r + "," + l,
              markerStyles: "-1," + c + ",-1"
            }).toString(), URI(s).path("/place/search").search({
              query: t,
              output: "html",
              region: f,
              src: "收货地址查询"
            }).toString())) : _();
            else _();
            o(function() {
              a.isShowMapBlock = !0, a.isShowMapLoading = !1, $(".map-block").css({
                "max-height": "123px",
                "border-top": "1px solid #DDE5ED"
              })
            }, 300)
          })
        };
      a.showMap = function() {
        a.isShowMapLoading = !0, y(h, g, !0)
      }
    }
  }
});
OrderEditController.$inject = ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util", "$sce", "$Time"];
