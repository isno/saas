var ShipmentEditController = BaseEditController.extend({
  _tag: "shipment",
  _tagUrl: "shipmentTemplate",
  _tagData: "shipment_template",
  _tagCn: "运费模板",
  _watchChange: ["data.name", "area[0]", "area[1]", "area[2]", "calculate.value"],
  _watchValid: ["data.name"],
  _isPreCreate: !0,
  init: function(e, t, i, n, a, o) {
    YouPreset.init("shipment"),
      this._$timeout = a,
      this._$compile = o,
      this._super(e, t, n, i, null, a);

    var s = this;
    e.onClickDelete = function() {
        s._modalDelete()
      },
      e.toggleRule = function(e) {
        e.isOpen = !e.isOpen
      },
      e.addRuleFee = function(t) {
        t.fees.push({
          start: 1,
          plus: 1,
          areas: []
        }), e.changeFeeChecked(t), e.unSaved()
      },
      e.removeRuleFee = function(t, n) {
        i.modalSimple({
          type: "remove",
          name: "运费规则",
          onConfirm: function() {
            n.fees = _.reject(n.fees, function(e) {
              return e === t
            }), i.close(), e.changeFeeChecked(n), e.unSaved()
          }
        })
      },
      e.removeRuleFeeBatch = function(t) {
        var n = 0;
        _.forEach(t.fees, function(e) {
          e.isChecked && n++
        }), i.modalSimple({
          type: "remove",
          name: "选中的" + n + "条运费规则",
          onConfirm: function() {
            t.fees = _.reject(t.fees, function(e) {
              return !0 === e.isChecked
            }), i.close(), e.changeFeeChecked(t), e.unSaved()
          }
        })
      },
      e.editRuleFeeBatch = function(t, n) {
        var o = e.calculate.value;
        i.modal({
          title: "批量设置价格",
          content: '<div> 首{{calculate.desc}} <div class="input-unit"> <input class="input" style="width: 85px;" you-validation="required|' + (0 === o ? "integer" : "number|float2") + '" ng-model="start"> <span class="input-unit-text">{{calculate.unit}}</span></div> 首费 <div class="input-unit input-unit-short" style="width: 135px;"><div class="input-group"><div class="input-group-addon">{{YouPreset.$()}}</div> <input class="input" you-validation="required|number|float2" ng-model="postage"></div></div> 续{{calculate.desc}} <div class="input-unit"> <input class="input" style="width: 85px;" you-validation="required|' + (0 === o ? "integer" : "number|float2") + '" ng-model="plus"> <span class="input-unit-text">{{calculate.unit}}</span></div> 续费 <div class="input-unit input-unit-short" style="width: 135px;"><div class="input-group"><div class="input-group-addon">{{YouPreset.$()}}</div> <input class="input" style="width: 85px;" you-validation="required|number|float2" ng-model="postageplus"></div></div></div><br><br>',
          btn: [{
            text: YouText.POPUP_MODAL_BTN_CANCEL,
            click: "cancel"
          }, {
            type: "primary",
            text: YouText.POPUP_MODAL_BTN_CONFIRM,
            click: "confirm",
            enter: !0
          }],
          initModel: {
            calculate: e.calculate,
            start: 1,
            plus: 1
          },
          popStyle: {width: "680px"},
          scope: {
            cancel: function() {
              i.close()
            },
            confirm: function(o, s) {
              if (!o.validation.validate(["start", "postage", "plus", "postageplus"])) return void(s.confirm = !1);
              _.forEach(t.fees, function(t, i) {
                t.isChecked && (t.start = o.start, t.postage = o.postage, t.plus = o.plus, t.postageplus = o.postageplus, a(function() {
                  e.validation.toggle("feeStart_" + n + "_" + i, !1), e.validation.toggle("feePostage_" + n + "_" + i, !1), e.validation.toggle("feePlus_" + n + "_" + i, !1), e.validation.toggle("feePostagePlus_" + n + "_" + i, !1)
                }))
              }), i.close(), e.unSaved()
            }
          }
        })
      },
      e.editArea = function(t, n, a, o) {
        e.validation.toggle("feeAreas_" + o + "_" + a, !1);
        var s = "";
        _.forEach(n.fees, function(e) {
          e !== t && (s += e.include_areas)
        }), i.area({
          title: "设置地区",
          checked: t.include_areas,
          checkedLimit: s,
          excluded: n.exclude_areas,
          onDone: function(i) {
            t.include_areas = i, t.areas = YouArea.format(t.include_areas), e.unSaved()
          }
        })
      },
      e.editExcludedArea = function(t) {
        var n = "";
        _.forEach(t.fees, function(e) {
          n += e.include_areas
        }), i.area({
          isInverse: !0,
          title: "设置不出售地区",
          btnType: "danger",
          btnText: "确定设置为不出售地区",
          checked: t.exclude_areas,
          checkedLimit: n,
          onDone: function(i) {
            t.exclude_areas = i, t.excludedAreas = YouArea.format(t.exclude_areas), e.unSaved()
          }
        })
      },
      e.getCityNames = function(e) {
        var t = [],
          i = [];
        return _.forEach(YouArea.getCityNames(e), function(e, n) {
          0 !== n && n % 5 == 0 && (t.push(i.join("、")), i = []), i.push(e)
        }), t.push(i.join("、")), t.join("、<br>")
      },
      e.changeFeeChecked = function(e, t) {
        a(function() {
          var i;
          t ? (i = e.isFeeCheckedAll, _.forEach(e.fees, function(e) {
            e.isChecked = i
          })) : (i = !0, _.forEach(e.fees, function(e) {
            e.isChecked || (i = !1)
          }), e.isFeeCheckedAll = i)
        })
      },
      e.canBatchRule = function(e) {
        var t = !1;
        return _.forEach(e.fees, function(e) {
          e.isChecked && (t = !0)
        }), t
      }
  },
  onInitDone: function(e) {
    var t = this._$scope;
    t.data = e,
      e.rules && _.forEach(e.rules, function(t) {
        t.fees && _.forEach(t.fees, function(t) {
          2 != e.calculate_type && (t.start = t.start / 100, t.plus = t.plus / 100),
            t.postage = t.postage / 100,
            t.postageplus = t.postageplus / 100
        })
      }),
      this._initShipmentArea(),
      this._initCalculate(),
      t.calculates = _.cloneDeep(YouPreset.SHIPMENT_TEMPLATE_CALCULATE),
      this.isNew() ? t.calculate = { value: 0 } : t.calculate = { value: e.calculate_type },
      this._initRules(), t.showOffline = !1, t.toggleOffline = function() {
        t.showOffline = !t.showOffline
      },
      t.isOfflineActive = function() {
        for (var e = !1, i = YouPreset.SHIPMENT_TEMPLATE_RULE.length, n = t.rules.length; i < n; i++)
          if (t.rules[i].is_actived) {
            e = !0;
            break
          }
        return e
      }
  },
  _initShipmentArea: function() {
    var e = this._$scope;
    e.areaSelector = {
      extCls: "input",
      fullSelect: !1
    }, e.data.shipment_area_post && (e.areaSelector.initCode = e.data.shipment_area_post)
  },
  _initCalculate: function() {
    var e = this,
      t = this._$scope;
    this.isNew() || (t.cantChangeCalculate = !0), t.isTypeChecked = function(e) {
        return e == t.calculate.value ? "checked" : ""
      },
      t.$watch("calculate.value", function() {
        t.calculate && (t.calculate = _.cloneDeep(_.find(YouPreset.SHIPMENT_TEMPLATE_CALCULATE, function(e) {
          return e.value == t.calculate.value
        })), t.rules = e.rulesTemp[t.calculate.value])
      })
  },
  _initRules: function() {
    function e(e, t, n, a) {
      var o = {
        type: n.value,
        pay_type: a,
        is_actived: !1,
        feeDefault: {
          start: 1,
          plus: 1
        },
        fees: [],
        text: n.text,
        isOpen: !1
      };

      if (e.value == i.calculate_type) {
        var s = _.find(i.rules, function(e) {
          return e.pay_type == a && e.type == n.value
        });
        s && (
          o.is_actived = s.is_actived,
          o.exclude_areas = s.exclude_areas,
          o.excludedAreas = YouArea.format(o.exclude_areas),
          o.feeDefault = _.find(s.fees, function(e) {
            return !0 === e.is_default }),
          o.fees = [],
          _.forEach(s.fees, function(e) {

            e.is_default || (e.areas = YouArea.format(e.include_areas), o.fees.push(e))
          }))
      }
      t.push(o)
    }
    var t = this._$scope,
      i = t.data,
      n = [];

    _.forEach(YouPreset.SHIPMENT_TEMPLATE_CALCULATE, function(t) {
        var i = [];
        _.forEach(YouPreset.SHIPMENT_TEMPLATE_RULE, function(n) {
            e(t, i, n, 0)
          }),
          _.forEach(YouPreset.SHIPMENT_TEMPLATE_RULE_OFFLINE, function(n) {
            e(t, i, n, 1)
          }),
          n[t.value] = i
      }),
      this.rulesTemp = n
  },
  onSaveBefore: function() {
    var e = this._$scope,
      t = this._$timeout,
      i = !0,
      n = !1;
    return _.forEach(e.rules, function(a, o) {
      if (a.is_actived) {
        var s = [],
          r = [];
        s.push("ruleFeeDefaultStart_" + o),
          s.push("ruleFeeDefaultPostage_" + o),
          s.push("ruleFeeDefaultPlus_" + o),
          s.push("ruleFeeDefaultPostagePlus_" + o),
          _.forEach(a.fees, function(e, t) {
            s.push("feeStart_" + o + "_" + t),
              s.push("feePostage_" + o + "_" + t),
              s.push("feePlus_" + o + "_" + t),
              s.push("feePostagePlus_" + o + "_" + t),
              0 === e.areas.length && r.push("feeAreas_" + o + "_" + t)
          }),
          e.validation.validate(s) || (o >= YouPreset.SHIPMENT_TEMPLATE_RULE.length && (e.showOffline = !0), i = !1, a.isOpen = !0, n || (n = !0, t(function() {
            e.validation.validate(s)
          }))), _.forEach(r, function(s) {
            o >= YouPreset.SHIPMENT_TEMPLATE_RULE.length && (e.showOffline = !0), i = !1, a.isOpen = !0, t(function() {
              e.validation.toggle(s, !0, "请设置地区", !n)
            }), n || (n = !0)
          })
      }
    }), i
  },
  onSave: function(e) {
    var t = this._$scope;
    t.areaSelector.result && (e.shipment_area_post = t.areaSelector.result),
      t.cantChangeCalculate = !0,
      e.name = t.data.name,
      e.calculate_type = t.calculate.value;
    var i = Boolean(2 != e.calculate_type),
      n = [];
    _.forEach(t.rules, function(e) {
      if (e.is_actived) {
        var t = {};
        t.type = e.type,
          t.pay_type = e.pay_type,
          t.is_actived = e.is_actived,
          t.exclude_areas = e.exclude_areas;
        var a = [];
        a.push({
          is_default: !0,
          start: i ? 100 * e.feeDefault.start : e.feeDefault.start,
          postage: 100 * e.feeDefault.postage,
          plus: i ? 100 * e.feeDefault.plus : e.feeDefault.plus,
          postageplus: 100 * e.feeDefault.postageplus
        }), _.forEach(e.fees, function(e) {
          a.push({
            start: i ? 100 * e.start : e.start,
            postage: 100 * e.postage,
            plus: i ? 100 * e.plus : e.plus,
            postageplus: 100 * e.postageplus,
            include_areas: e.include_areas
          })
        }), t.fees = a, n.push(t)
      }
    }), e.rules = JSON.stringify(n)
  },
  _modalDelete: function() {
    var e = this,
      t = this._$Popup,
      i = this._$scope,
      n = this._$Uri;
    t.modal({
      title: "删除",
      content: "加载中..."
    }), n.get("shipmentTemplate_checkUnUsed", {
      id: e.getId()
    }, function(a) {
      a.data.unused ? (t.closeSp(), i.onClickBaseDelete()) : n.get("product_getAll", {
        stid: e.getId(),
        nopage: "Y",
        output_format: "simple"
      }, function(i) {
        t.closeSp(),
          e._modalDeleteReplace(i.data.products)
      })
    })
  },
  _modalDeleteReplace: function(e) {
    var t = this,
      i = this._$Popup,
      n = this._$scope,
      a = this._$compile,
      o = this._$timeout,
      s = this._$Uri,
      r = [],
      l = {
        staticMode: !0,
        btnname: "选择新的运费模板",
        isUniq: !0,
        inputplaceholder: "搜索运费模板",
        btnautostatus: !0,
        cnname: "运费模板",
        inputMaxLength: 100,
        mode: "search",
        forbiddenDel: !0,
        url: ["shipmentTemplate_getAll", "notPost", "notPost"],
        orgData: r,
        uniparam: "shipment_templates",
        uid: n.id,
        queryname: "id",
        queryparam: {
          excid: t.getId()
        },
        mapper: {
          id: "shipment_template_id"
        },
        directionUp: !0,
        sync: function(e, t) {
          e[0] && (r = e, d.$$childTail.$$childHead.validation.toggle("selector", !1))
        }
      };
    n.dataShipmentSeletor = l;
    var c = a('<you-tagselector data="dataShipmentSeletor"></you-tagselector>')(n),
      d = i.modal({
        notpreventDefault: !0,
        notpreventScroll: !0,
        contentextclass: "shipment-edit-delete-pop",
        title: "删除",
        content: "<div>运费模板“<strong>" + n.data.name + '</strong>”正在被以下 {{products.length}} 个商品使用中，不能直接删除！</div><div class="shipment-edit-delete-pop-block"> <div class="shipment-edit-delete-pop-block-item" ng-repeat="i in products">  <a target="_blank" href="#!/productedit?id={{i.id}}">{{i.name}}</a> </div></div><div class="shipment-edit-delete-pop-selector-text">需选择一个新的运费模板进行替换才可删除，删除后以上商品将自动使用新的运费模板。</div><selector></selector><div style="margin-left: 60px;"><input style="display: none;" name="selector" you-validation></div><br><br>',
        btn: [{
          text: "取消",
          click: "cancel"
        }, {
          type: "danger",
          text: "确认替换并删除",
          click: "confirm",
          enter: !0
        }],
        initModel: {
          products: e,
          dataShipmentSeletor: l
        },
        scope: {
          cancel: function() {
            i.closeAll()
          },
          confirm: function(e, a) {
            if (!r || !r[0]) return e.validation.toggle("selector", !0, "请选择新的运费模板"), void(a.confirm = !1);
            s.post("shipmentTemplate_remove", {
              id: t._id,
              replace_id: r[0].id
            }, function(e, a) {
              n.onClickBaseBack(), i.closeAll(), i.info({
                text: YouText.POPUP_INFO_REMOVE_SUCCESS.replace("{x}", t._baseData.name)
              })
            })
          }
        },
        onClose: function() {
          i.closeAll()
        }
      });
    o(function() {
      d.$$childHead.reAdjust()
    }), o(function() {
      d.$$childHead.elm.find("selector").append(c)
    }, 300)
  }
});
ShipmentEditController.$inject = ["$scope", "$rootScope", "$Popup", "$Uri", "$timeout", "$compile"];
