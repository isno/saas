/** services time start */
(function() {
  var e = Class.extend({
      _fix: null,
      _ServerTime: window.YoudianConf.serverTime - 0,
      _MyTime: window.YoudianConf.myTime - 0,
      fix: function() {
        if (_.isNumber(this._fix)) return this._fix;
        var e = this._MyTime,
          t = this._ServerTime,
          i = 0;
        return i = e > t ? e - t : t - e, this._fix = i, i
      },
      get: function() {
        var e = this.fix(),
          t = this._MyTime,
          i = this._ServerTime,
          n = (new Date).getTime();
        return t > i ? n - e : n + e
      },
      getLite: function(e) {
        return moment(moment(e || this.get()).format("YYYY/MM/DD"), "YYYY/MM/DD").toDate().getTime()
      },
      getLiteHour: function(e) {
        return moment(moment(e || this.get()).format("YYYY/MM/DD, HH"), "YYYY/MM/DD, HH").toDate().getTime()
      },
      getSearchStart: function() {
        return this.getLite() - 2592e6
      },
      getSearchEnd: function() {
        return this.getLite() + 86399999
      },
      format: function(e, t) {
        return moment(new Date(e)).format(t)
      },
      add: function(e, t, i) {
        return moment(e || this.get()).add(t, i).toDate().getTime()
      },
      serverTimestamp: function(e) {
        return moment(new Date(e)).zone(-8).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      },
      timestamp: function(e) {
        return new Date(e).getTime()
      }
    }),
    t = Class.extend({
      instance: new e,
      $get: [
        function() {
          return this.instance
        }
      ]
    });
  angular.module("services.$Time", []).provider("$Time", t)
}());
/** services time end */
