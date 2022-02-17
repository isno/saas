(function(){
    var e = window.YoudianConf.levelCode,
        t = {
            devel: "开发版",
            free: "免费版",
            level1: "基础版",
            paid: "专业版",
            level3: "专业版",
            level4: "至尊版"
        },
        i = {
            devel: -1,
            free: 0,
            level1: 1,
            paid: 2,
            level3: 3,
            level4: 4
        },
        n = {
            CUSTOMER_LEVEL_ENABLE: [!1, !1, !0, !0, !0, !0],
            CUSTOMER_REWARD_POINT_ENABLE: [!1, !1, !0, !0, !0, !0],
            PRODUCT_UNLIMITED: [!1, !1, !0, !0, !0, !1],
            ACCOUNT_UNLIMITED: [!1, !0, !0, !0, !0, !1]
        },
    a = window.YouLevel = {};
    a.LEVEL = e,
    a.LEVEL_TEXT = t[e],
    a.LEVEL_GRADE = i[e];

    var o, s = Object.getOwnPropertyNames(n);
    for (o = 0; o < s.length; o++) a[s[o]] = n[s[o]][a.LEVEL_GRADE]
}());