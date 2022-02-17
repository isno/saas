var StoreEditController = BaseEditController.extend({
    _tag: "store",
    _tagCn: "分店",
    _watchValid: ["data.name","data.phone","data.address","area[0]", "area[1]"],
    init: function (e, t, i, n, a, o, s, r) {
        this._super(e, t, n, i, o, s);
        this._n = n;
        e.data = {};
        e.dataDatetime = {
            format:"HH:mm",
            isHour:1,
            showUnlimited:0
        };

    }, 
  
    onInitDone: function (e) {
        var t = this._$scope;
        t.data = e;
        this.isNew() && (e.start_at = "09:00",e.end_at = "21:00",e.is_avalible = "true",t.data.imageUrl = this._n.getAssetUrl(e.image_path, 'full'));
        t.areaSelector = {
          extCls: "input",
          fullSelect: !1
        };
        e.area_code && (t.areaSelector.initCode = e.area_code);

        var a = t.dataDatetime.timeStart = moment("20211201 "+e.start_at, "YYYYMMDD HH:mm").toDate().getTime();
        o = t.dataDatetime.timeEnd = moment("20211201 "+e.end_at, "YYYYMMDD HH:mm").toDate().getTime();
        
        t.dataDatetime.onChange = function(e, i) {
            e && (a != e && t.unSaved(), t.validation && t.validation.toggle("begin_data", !1)),
            i && (o != i && t.unSaved(), t.validation && t.validation.toggle("expire_data", !1))
        };

    }, 
    onSaveBefore: function () {
        var e = this._$scope;
        return !!e.validation.validate(["data.name"]) && !!e.validation.validate(["data.phone"]) && !!e.validation.validate(["data.address"])
    }, 
    onSave: function (e) {
        var t = this._$scope.data,
        i = this._$Time;
        e.id = this.getId();
        this._$scope.areaSelector.result && (e.area_code = this._$scope.areaSelector.result);
        e.name = t.name;
        e.image_path = t.image_path;
        e.phone = t.phone;
        e.address = t.address;
        e.traffic_guide = t.traffic_guide;
        e.start_at = moment(this._$scope.dataDatetime.timeStart).format("HH:mm");
        e.end_at = moment(this._$scope.dataDatetime.timeEnd).format("HH:mm");
        e.is_avalible = t.is_avalible;
    }
});
StoreEditController.$inject =["$scope", "$rootScope", "$Popup", "$Uri", "$Util", "$Time", "$timeout", "$interval"];