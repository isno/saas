(function() {
  var e = Class.extend({
      _debug: !1,
      _state: null,
      _http: null,
      _location: null,
      _timeout: null,
      _rootScope: null,
      _cancelerAll: {},

      _dataHandlers: {
        formData: {
          contentType: void 0,
          transform: function(e) {
            var t = new FormData;
            for (var i in e) t.append(i, e[i]);
            return t
          }
        },
        json: {
          contentType: "application/json"
        },
        defaults: {
          headers: { "zz": "XMLHttpRequest" },
          contentType: "application/x-www-form-urlencoded",
          transform: function(e) {
            return URI("#").search(e).query()
          }
        }
      },
      getQuery: function() {
        var e = this._checkUrl(),
          t = new URI(e);
        return new URI(t.fragment()).search(!0)
      },
      getJSONP: function(e, t) {
        return this._http.jsonp(e).success(function(e) {
          t && t(e)
        }).error(function() {
          t && t("err")
        })
      },
      _checkUrl: function() {
        var e = this._location.absUrl();
        return e.match(/#/gi).length > 1 ? void alert("参数中含有#，请编码！") : e
      },
      getAssetUrl: function(path, size) {
        var s = new URI(window.YoudianConf.assetHost).host();
        s = "//" + s + "";
        if (!size) return s += path;
        return s += path + "!" + size + '.jpg'
      },
      getUrl: function(e, t, i) {
        var n = window.YoudianConf.uris,
          a = "",
          o = n[e];
        if (o) {
          if (e == "upload_upyun") return o;
          i && _.forEach(i, function(e, t) {
            var i = new RegExp(":" + t);
            o = o.replace(i, e)
          });
          var s = URI(o);
          return t && s.search(t), 
          a = window.YoudianConf.apiUrl + s.normalize(), 
          a.toString()
        }
        alert("uri:" + e + " is undefined!")
      },
      get: function(e, t, i, n) {
        var a = this,
          o = 1e4;
        n && n.noTimeout && (o = ""),
          n && n.canceler && (a._cancelerAll[e] = a._q.defer(), o = a._cancelerAll[e].promise);
        t || (t = {});
        t["_r"] = (new Date).getTime();
        var s = n && n.urlParams;
        return this._http({
          method: "GET",
          url: a.getUrl(e, t, s),
          headers: { 
            "X-Requested-With": "XMLHttpRequest",
            "Shop-Id":window.YoudianConf.shop_id
          },
          timeout: o
        }).then(function(e) {
          a._debug ? a._timeout(function() {
              a._vaild(e.data, i, n)
            },
            500) : a._vaild(e.data, i, n)
        }).catch(function() {
          n && n.errorCallback && n.errorCallback()
        })
      },

      post: function(e, t, i, n) {
        var a = this, o = 1e4;
        n && n.timeout && (o = n.timeout),
          n && n.noTimeout && (o = ""),
          n && n.canceler && (a._cancelerAll[e] = a._q.defer(),
            o = a._cancelerAll[e].promise);

        var s = n && n.sendType,
          r = this._dataHandlers[s] || this._dataHandlers.defaults,
          l = n && n.urlParams,
          c = {
            method: "POST",
            url: a.getUrl(e, null, l),
            data: t,
            headers: {
              "Content-Type": r.contentType
            },
            timeout: o
          };
          if (e!="upload_upyun") {
            c["headers"]["Shop-Id"] = window.YoudianConf.shop_id
          }

        return r.transform && (c.transformRequest = r.transform),
          this._http(c).then(function(e) {
            a._debug ? a._timeout(function() {
              a._vaild(e.data, i, n)
            }, 300) : a._vaild(e.data, i, n)
          }).catch(function() {
            n && n.errorCallback && n.errorCallback()
          })
      },
      /**
      批量上传接口
      */
      multiImgUploading: !1,
      multiImgUpload: function(e) {
        var t = this;
        e.scope[e.arrayName] = [];
        var i, n, a, o = 0,
          $
        s = 0,
          r = 0,
          l = !1,
          c = 0,
          d = _.isArray(e.types) ? e.types : ["image/png", "image/jpeg", "image/gif", "image/bmp", "image/webp"],
          p = [],
          u = [],
          m = [],
          g = function() {
            var i = e.scope[e.arrayName][o];

            if (l) return;
            let formData = {};
            formData['policy'] = window.YoudianConf.upyun_policy;
            formData['signature'] =  window.YoudianConf.upyun_signature;
            formData['file'] = i;
       
            t.post("upload_upyun", formData, function(a) {
                if (a.url && m.push(a.url), n.uploadCount = o + 1, n.barclass = "transition-slow", o >= s - 1) {
                  if (l) return;
                  n.uploadPercentStyle = {width: "100%"}, 
                  t._timeout(function() {
                    t.multiImgUploading = !1, 
                    l || t._popup.close(), 
                    e.onSucc && e.onSucc(a), 
                    e.onSuccGetAll && e.onSuccGetAll(m)
                  }, 900)
                } else {
                  o++;
                  var d = parseInt(r * o);
                  n.uploadPercentStyle = {
                    width: d + "%"
                  }, i.uploaded = !0, t._timeout(function() {
                    n.barclass = "transition-veryslow", n.uploadPercentStyle = {
                      width: d + c + "%"
                    }, g()
                  }, 700)
                }
              }, {
                sendType: "formData",
                errorCallback: function(i) {
                  
                  t.multiImgUploading = !1,
                  t._popup.close(), 
                  e.onErr && e.onErr(l)
                },
                canceler: "multiImgUpload"
              })
         

          }// end g
        if (!t.multiImgUploading) {
          for (var f = 0; f < e.files.length; f++) {
            var h = e.files[f];
            h && h.type && d.some(function(e) {
              return e === h.type
            }) ? h.size <= 1024 * 1024 * 5 ? e.scope[e.arrayName].push(h) : u.push(h.name) : p.push(h.name)
          }
        }
        s = e.scope[e.arrayName].length;
        var v = 1 == s;
        if (s < 1) {
          var x = '请选择后缀为 .png、.jpg、.jpeg、.gif、.webp <span style="position:relative;top:3px" you-help you-help-dir="bottom">仅限Chrome或360浏览器</span>、.bmp 的图片文件。';
          u.length > 0 && (x = "文件尺寸过大，请上传小于5M的图片文件。"), t._popup.modal({
              title: "上传图片失败",
              content: x,
              btn: [{
                type: "primary",
                text: "确定",
                click: "cancelPop"
              }],
              scope: {
                contentStyle: {
                  overflow: "visible"
                },
                cancelPop: t.cancelPop.bind(t)
              },
              forceMask: !0
            }),
            t.multiImgUploading = !1
        } // end 没有选择文件
        r = Math.floor(100 / s);
        c = Math.floor(r / 1.5);
        e.onBeforeUpload && e.onBeforeUpload();
        t.multiImgUploading = !0,
          o = 0;
        var y = e.scope[e.arrayName].length,

          // start b
          b = function() {
            i = t._popup.modal({
                title: "图片上传",
                content: '<div><h3 class="summit-h3" style="position:relative;"> \t<span ng-show="showStatus">    \t\t<span ng-show="isWatermarking">正在添加水印，请稍候...</span>    \t\t<span ng-hide="isWatermarking" class="imgmgr-imgname-long">正在上传    \t\t\t<span ng-bind="uploadingName"  title="{{uploadingName}}"></span>\t\t\t</span>\t\t</span>\t\t&nbsp;\t\t<span style="position:absolute;right:0">\t\t\t已上传图片：<span ng-bind="uploadCount"></span> / 总共：<span ng-bind="uploadTotal"></span>\t\t</span>\t</h3>    <div class="setting-limit-content-bar imgmgr-imgname-bar">        <div class="setting-limit-content-bar-process {{ barclass }}" style="width:0%" ng-style="uploadPercentStyle"></div>    </div></div>',
                btn: [{
                  type: "warning",
                  text: "取消上传",
                  click: "cancelUpload"
                }],
                initModel: {
                  uploadPercentStyle: {
                    width: "0%"
                  },
                  barclass: "transition-veryslow",
                  isSingle: v,
                  uploadTotal: s,
                  uploadCount: 0,
                  uploadingName: e.scope[e.arrayName][0].name
                },
                forceMask: !0,
                scope: {
                  cancelUpload: function() {
                    l = !0,
                      t.multiImgUploading = !1,
                      t._popup.close(),
                      e.onAbort && e.onAbort()
                  }
                }
              }),
              n = i.$$childTail.$$childHead,
              a = i.$$childHead,
              t._timeout(function() {
                _.forEach(e.scope[e.arrayName], function(i) {
                  return n.showStatus = !0,
                    void(0 == --y && (g(), n.uploadPercentStyle.width = c + "%"));

                })
              }, 300)
          };
        // end function b
        b();
      },
      /** upload end */
      setQuery: function(e, t, i) {
        var n = this;
        if (angular.isString(e) || (e = this._location.path().slice(1)), n.setQueryObj = {
            path: e,
            oSearch: t,
            otherPath: i
          }, void 0 === n._rootScope.unsaved) return void n._setQuery();
        n._rootScope.unsaved ? (n._setQuery(), n._timeout(function() {
          window.fFrameworkAdjust && window.fFrameworkAdjust()
        }, 200)) : n._popUnsaved("_setQuery");
      },
      _setQuery: function() {
        var e = this,
          t = this._state,
          i = e.setQueryObj.oSearch;
        if (void 0 !== e.setQueryObj.otherPath) {
          e._rootScope.unsaved = !0;
          var n = "/main/" + e.setQueryObj.otherPath,
            a = new URI(n);
          a.search(i || {});
          var o, s = a.toString().split("?"),
            r = s[1];
          o = r ? s[0] + "#/" + e.setQueryObj.path + "?" + s[1] : s[0] + "#/" + e.setQueryObj.path,
            window.location.href = o;
        } else {
          e._rootScope.unsaved = !0;
          "/" + e.setQueryObj.path != this._location.path() || i ? this._location.path("/" + e.setQueryObj.path).search(i || {}) : t.reload(),
            e._popcancel()
        }
      },
      _vaild: function(e, t, i) {
        var n = this,
          a = e.code + "";
          console.log(e)
        if ("200" !== a && i && i.errorCallback && i.errorCallback(e),
          i && i.preventDefaultCall) return void(i && i.customCallback && i.customCallback(e));
        switch (a) {
          case "200":
            t(e, 200);
            break;
          case "201":
            i && i.overrideError ? t(e, 201) : (n._popup.modal({
                title: "提示",
                content: e.message,
                btn: [{
                  type: "primary",
                  text: "确定",
                  click: "cancelPop"
                }],
                scope: n,
                forceMask: !0
              }),
              n._popup.loading(!1));
            break;
        }
      },
      apiGet: function(e, t, i, n, a) {
        var o = this;
        t || (t = {});
        var s = (new Date).getTime();
        return a || (t.ysrnd = s), this._http({
          method: "GET",
          url: o.apigetUrl(e, t),
          timeout: 1e4
        }).success(function(e) {
          i && i(e)
        }).error(function() {
          n && n()
        })
      },
      apigetUrl: function(e, t) {
        var i = window.YoudianConf.apiUri,
          n = "",
          a = i[e];

        if (a) {
          var o = URI(a);
          return t && o.search(t), n = window.YoudianConf.apiUrl + o.normalize(), n.toString()
        }
        alert("uri:" + e + " is undefined!")
      },
      historyBackCached: function(e) {
        e || (e = 1);
        var t, i = this;
        if (void 0 === i._rootScope.unsaved) return t = this._rootScope.gridParam, t && (t.isCache = !0), void history.go(-e);
        if (i._rootScope.unsaved) t = this._rootScope.gridParam, t && (t.isCache = !0), history.go(-e);
        else switch (e) {
          case 1:
            i._popUnsaved("_historyBackCached");
            break;
          default:
            i._popUnsaved("_historyBackCached_" + e)
        }
      },
      _historyBack: function (e) {
        e || (e = 1);
        var t = this;
        top.history.go(-e), 
        t._rootScope.unsaved = !0, 
        t._popcancel()
      },
      _historyBackCached: function() {
        var e = this._rootScope.gridParam;
        e && (e.isCache = !0), this._historyBack()
      },
      _popUnsaved: function(e) {
        var t = this;
        t._popup.modal({
          title: "确认离开",
          content: "当前页面还有未保存的内容，确认要离开吗？",
          btn: [{
            type: "default",
            text: YouText.POPUP_MODAL_BTN_CANCEL,
            click: "_popcancel"
          }, {
            type: "danger",
            text: "不保存并离开",
            click: "_popsubmit"
          }],
          scope: {
            _popcancel: function() {
              t._popcancel()
            },
            _popsubmit: function() {
              angular.isFunction(e) ? e() : angular.isFunction(t[e]) && t[e]()
            }
          },
          forceMask: !0
        })
      },
      _popcancel: function() {
        this._popup.closeAll()
      },
      abort: function(e) {
        var t = this;
        t._cancelerAll[e] && (t._cancelerAll[e].resolve(), delete t._cancelerAll[e])
      }

    }),
    t = Class.extend({
      instance: new e,
      $get: ["$location", "$http", "$timeout", "$rootScope", "$state", "$q", "$Popup",  function(location, http, timeout, rootScope, state, $q, $Popup) {
        return this.instance._location = location,
          this.instance._http = http,
          this.instance._state = state,
          this.instance._timeout = timeout,
          this.instance._rootScope = rootScope,
          this.instance._popup = $Popup,
          this.instance._q = $q,
          this.instance

      }]
    });
  angular.module("services.$Uri", []).provider("$Uri", t)


}());
