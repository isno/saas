var youPopCustomer = BaseController.extend({
    init: function(e, t, i, n, a, o) {
      switch (this._elem = t,
        this._scope = e,
        this._timeout = n,
        this._popup = a,
        this._uri = o,
        this.loading = 0,
        this._super(e),
        this._init(),
        this._initList(),
        this._initGrid(),
        e.mode = e.data.mode,
        e.mode) {
        case "distribute":
          e.listItemClass = "pop-customer-list-input-item"
      }
      e.msg = e.data.msg,
        e.listCustomers = _.cloneDeep(e.data.customers), 
        e.listCustomers || (e.listCustomers = [])
    },
    _init: function() {
      var e = this._scope,
        t = this._timeout,
        i = this._popup;
      t(function() {
        e.popWinClass = "pop-customer-win-in"
      }), 
      e.popCancel = function() {
        t(function() {
          i.closeCustomers()
        }, 500), e.popWinClass = "pop-customer-win-out"
      }, 
      e.currentItemCount = function() {
        if (void 0 === e.savedTotalCount || e.savedTotalCount == e.baseItemCount) return e.listCustomers.length;
        var t = 0;
        return _.forEach(e.gridCustomers, function(i) {
          _.find(e.listCustomers, function(e) {
            return e.id == i.id
          }) && t++
        }), t
      }, 
      e.popSave = function() {
        if ("distribute" === e.mode) {
          var t = [];
          if (_.forEach(e.listCustomers, function(e, i) {
              t.push("listItemAmount_" + i)
            }), !e.validation.validate(t)) return
        }
        e.popCancel(), e.data.onDone(e.listCustomers)
      }
    },
    _initList: function() {
      var e = this._scope;
      e.removeListCustomers = function() {
        _.forEach(e.listCustomers, function(e) {
          e.selected = !1
        }), 
        e.listCustomers = []
      }, 
      e.clickCustomer = function(t) {
        t.selected = !t.selected, 
        t.selected ? e.listCustomers.unshift(t) : _.remove(e.listCustomers, function(e) {
          return e.id == t.id
        })
      }
    },
    _initGrid: function() {
        var e = this,
        t = this._scope,
        i = this._uri,
        n = this._timeout,
        a = $(this._elem);
        t.getCustomerAvatar = function(e) {
          return i.getAssetUrl(e.avatar_path, "42x42")
        },
        t.isGridCustomerSelected = function(e) {
          return e.selected ? "selected" : ""
        },
        t.listeners.onGridReload = function() {
          n(function() {
            e._updateSelectedCustomers()
          })
        },
        a.on("click", '[data-role="gridCustomer"]', function() {
          var e = angular.element(this).scope().item;
          t.clickCustomer(e), t.$apply()
        })
    },
    _updateSelectedCustomers: function() {
      var e = this._scope;
      _.forEach(e.gridCustomers, function(t) {
        _.find(e.listCustomers, function(i, n) {
          if (i.id == t.id) return e.listCustomers[n] = t, !0
        }) ? t.selected = !0 : t.selected = !1
      })
    }
  }),
  youPopCustomerController = BaseGridController.extend({
    _tag: "customer",
    _watchValid: ["param.amount_smaller", "param.amount_greater", "param.count_smaller", "param.count_greater"],
    _searchRangeFields: [
      ["param.amount_smaller", "param.amount_greater"],
      ["param.count_smaller", "param.count_greater"]
    ],
    init: function(e, t, i, n, a, o, s, r) {
      switch (YouPreset.init("customer"), e.data.mode) {
        case "distribute":
          this._tag = "customer_for_coupon", 
          this._param = {
            coupon_group_id: e.data.msg.id,
            coupon_atype: e.data.msg.atype,
            isCache: !0,
            page: 1,
            size: YouPreset.LIST_PAGE_SIZE
          }, 
          t.gridParam = this._param
      }
      this._$scope = e,
        this._time = s,
        this._compile = r,
        this._uri = i,
        this._super(e, t, i, n, a, o),
        e.listeners = {
          a: 123
        }, e.dataDate = {
          showCleanup: !0,
          timeStart: null == e.param.order_earlier ? 0 : e.param.order_earlier,
          timeEnd: null == e.param.order_later ? 0 : e.param.order_later,
          onChange: function(t, i) {
            e.param.order_earlier = 0 === t ? null : t, e.param.order_later = 0 === i ? null : i
          }
        }
    },
    getPreset: function() {
      return YouPreset.CUSTOMER_REGIST_SOURCE
    },
    initParam: function(e) {
      e.order = "desc", e.order_by = "created_at"
    },
    onReset: function() {
      var e = this._$scope;
      e.dataDate.timeStart = e.dataDate.timeEnd = null, e.dataLevel.reset()
    },
    onGetAll: function(e) {
      e.order_earlier && (e.order_earlier = this._time.serverTimestamp(e.order_earlier)),
        e.order_later && (e.order_later = this._time.serverTimestamp(e.order_later)),
        e.amount_smaller && (e.amount_smaller *= 100),
        e.amount_greater && (e.amount_greater *= 100)
    },
    onInitDone: function(e) {
      var t = this._$timeout,
        i = this._$scope,
        n = this,
        a = n._uri,
        o = n._compile;
      i.gridCustomers = e, i.listeners.onGridReload && i.listeners.onGridReload(), t(function() {
          void 0 === i.savedTotalCount && (i.savedTotalCount = i.baseItemCount)
        }),
        i.onInitDone || (i.onInitDone = !0, a.get("customer_level_getAll", null, function(e) {
          200 == e.code && (n.dataLevel = _.map(e.data.customer_levels, function(e) {
              return {
                value: e.id,
                text: e.name,
                icon: e.src
              }
            }),
            n.initCheckBtn("dataLevel", "customer_level_id", n.dataLevel, !1),
            $("#customer-level-filter").append(o('<you-check-btn data="dataLevel"></you-check-btn>')(i)))
        }))
    }
  });
angular.module("directives.youPopCustomer", []).directive("youPopCustomer", ["$timeout", "$Popup", "$Uri",
  function(e, t, i) {
    return {
      restrict: "E",
      scope: {
        data: "="
      },
      replace: !0,
      templateUrl: URI("/static/main/html/popups/").filename("customer.htm").toString(),
      link: function(n, a, o) {
        new youPopCustomer(n, a, o, e, t, i)
      },
      controller: ["$scope", "$rootScope", "$Uri", "$Popup", "$timeout", "$Util", "$Time", "$compile", youPopCustomerController]
    }
  }
]);
