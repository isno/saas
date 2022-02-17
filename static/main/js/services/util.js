/** util services */
(function() {
  var e = /^[a-z0-9]|\w+[a-z0-9]$/,
    t = function() {
      function e(e) {
        var t, i, r = [],
          l = [];
        for (t in e) i = e[t], s[t] = i, o[i] = t, r.push(i), l.push(t);
        n = new RegExp("(" + r.join("|") + ")", "g"),
          a = new RegExp("(" + l.join("|") + "|&#[0-9]{1,5};)", "g")
      }

      function t(e) {
        var t = function(e, t) {
          return o[t]
        };
        return e ? String(e).replace(n, t) : e
      }

      function i(e) {
        var t = function(e, t) {
          return t in s ? s[t] : String.fromCharCode(parseInt(t.substr(2), 10))
        };
        return e ? String(e).replace(a, t) : e
      }
      var n, a, o, s;
      return function() {
        o = {}, s = {}, e({
          "&amp;": "&",
          "&gt;": ">",
          "&lt;": "<",
          "&quot;": '"',
          "&#39;": "'"
        })
      }(), {
        htmlEncode: t,
        htmlDecode: i
      }
    }(),

    i = Class.extend({
      yuan: function(e) {
        return this._convertToUse(e)
      },
      fen: function(e) {
        return this._convertToPost(e)
      },
      weightKg: function(e) {
        return this._convertToUse(e)
      },
      volumeMeterShow: function(e) {
        return this._convertToUse(e)
      },
      weightTeng: function(e) {
        return this._convertToPost(e)
      },
      volumeMeterData: function(e) {
        return this._convertToPost(e)
      },
      _convertToUse: function(e) {
        return e / 100
      },

      parseMultimediaKey: function(e) {
        e || (e = "");
        var t = [],
          i = window.YoudianConf.qiniu_sub_domain;
        if (!i) return t;
        i = i.replace(/\./g, "\\."), i = ".*[^-]src\\=(?:\"|'){1}(?:(?:https:)|(?:http:))?\\/\\/" + i, i += "\\/(\\w*\\.\\w*)(?:\"|'){1}";
        var n = e.split("<source").slice(1),
          a = new RegExp(i, "ig");
        if (n.length > 0)
          for (var o = n.length, s = 0; s < o; s++) {
            a.lastIndex = 0;
            var r = a.exec(n[s]);
            r && r.length > 1 && t.push(r[1])
          }
        return t
      },
      _convertToPost: function(e) {
        return Number((10 * e * 10).toFixed())
      },

      setClipboard: function(e, t) {

      },
      escgtlt: function(e) {
        var t = "";
        return "string" == typeof e && (t = e.replace(/>/g, "").replace(/</g, "")), t
      },
      parseHtml: function(e) {
        var t = "";
        return e && (t = e.replace(/</gi, "&lt;"), t = t.replace(/>/gi, "&gt;"), t = t.replace(/\r?\n/gi, "<br/>")), t
      },
      reparseHtml: function(e) {
        var t = "";
        return e && (t = e.replace(/&lt;/gi, "<"), t = t.replace(/&gt;/gi, ">"), t = t.replace(/<br\/?>/gi, "\n")), t
      },
      parseAssetId: function(e) {
        e || (e = "");
        var t = [],
          i = window.YoudianConf.assetHost,
          n = i.split(".");
        n[0] = "((https:)|(http:))?//.*", i = n.join("."), i = i.replace(/\//gi, "\\/");
        var a = e.split("<img"),
          o = new RegExp(".*src\\=(\"|'){1}" + i + "\\/image\\/[^\\/]{24}\\/", "ig");
        if (a.length > 0)
          for (var s = a.length, r = 0; r < s; r++) {
            o.lastIndex = 0;
            var l = a[r];
            o.test(l) && -1 == t.indexOf(l) && t.push(l.match(/\/image\/[^\/]{24}/gi)[0].match(/[^\/]{24}/gi)[0])
          }
        return t
      },
      authenticate: function (e) {
          var t = !1;
          return window.YoudianConf.accountModules && window.YoudianConf.accountModules.indexOf(e) > -1 && (t = !0), t
      },
      /** editor*/
      initTinyMce: function(e, t) {

        e.tinymceOptions = {
          icons: 'ax-color',
          menubar: false,
          language: 'zh_CN',
          content_style: "img {max-width:95%}",
          branding: false,
          image_dimensions: false,
          automatic_uploads: true,
          plugins: 'print preview searchreplace autolink imagetools directionality visualchars   link media template table charmap hr pagebreak nonbreaking  advlist lists wordcount  textpattern paste emoticons autoresize',
          toolbar: 'forecolor backcolor bold italic underline strikethrough table image media emoticons  | alignleft aligncenter alignright | bullist | blockquote',
          setup: function(editor) {
              editor.ui.registry.addButton("image", {
                  icon: "image",
                  tooltip: "Insert image",
                  onAction: function() {
                    function getUrl(formdata, callback) {
                      const xhr = new XMLHttpRequest();
                      xhr.open("POST", window.YoudianConf.upyun_apiendpoint, true);
                      xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                          callback(JSON.parse(xhr.response));
                        }
                      };

                      xhr.send(formdata);
                    } // end getUrl

                    function uploadImg(api, editor) {
                      const data = api.getData();
                      const image = data.fileinput[0];
                      const fileExt = image.name.split('.')[1];



                      const formdata = new FormData();
                      formdata.append('file', image);
                      formdata.append('signature', window.YoudianConf.upyun_signature);
                      formdata.append('policy', window.YoudianConf.upyun_policy);


                      getUrl(formdata, (res) => {
                        const img = window.YoudianConf.assetHost + res.url;
                        api.setData({ src: { value: res.url, meta: {} } });
                        editor.execCommand(
                          'mceInsertContent',
                          false,
                          `<img src=${img} class="img-t" alt='img-t'/>`
                        );
                        api.unblock();
                        api.close();
                      });
                    }; // end upload

                    const dialogConfig = {
                      title: '上传图片',
                      body: {
                        type: 'panel',
                        items: [{
                          type: 'dropzone',
                          name: 'fileinput',
                        }],
                      },
                      buttons: [],
                      onChange(api) {
                        api.block('上传中……');
                        uploadImg(api, editor);
                      }
                    };
                    editor.windowManager.open(dialogConfig);
                  }
                }) // end button
            } // end setup

        };

        var o = this.$Popup,
          s = this.$timeout,
          r = this;
      },
      /** end editor*/
      htmlEnDeCode: t,
      htmlEnCode:t.htmlEncode,
      htmlDeCode:t.htmlDecode

    });
  n = Class.extend({
    instance: new i,
    $get: ["$timeout", "$Popup", "$rootScope",
      function(e, t, i) {
        return this.instance.$timeout = e,
          this.instance.$Popup = t,
          this.instance.$rootScope = i,
          this.instance
      }
    ]
  });
  angular.module("services.$Util", []).provider("$Util", n);
}());
/** end util services */
