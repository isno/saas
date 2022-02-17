/** youdian routes */

/*** urls start */
(function(){
    window.YoudianConf.apiUrl = "/main/api/",
    window.YoudianConf.adminUri = window.YoudianConf.uris = {
        setting:"setting",
        main_checkInitModule:"check_init_module",
        upload_upyun:window.YoudianConf.upyun_apiendpoint,
        store_certification_check: "store_certification/check",
        
        stat:"stat",
        stat_order:"stat/order",
        refunds: "refunds",

        app_positions: "apps/positions",

        store_getAll:"store/get_all",
        store_create:"store/create",
        store_getSingle:"store/get",
        store_save:"store/save",
        store_remove:"store/remove",

        paymentMethod_getAll: "payment_method/get_all",
        paymentMethod_getSingle: "payment_method/get_single",
        paymentMethod_saveConfig: "payment_method/save_config",
        paymentMethod_resetConfig: "payment_method/reset_config",
        paymentMethod_goTest: "payment_method/go_test",
        paymentMethod_checkTest: "payment_method/check_test",
        paymentMethod_active: "payment_method/active",
        paymentMethod_unactive: "payment_method/unactive",
        paymentMethod_checkActive: "payment_method/check_active",
        paymentMethod_checkWeixinAuthorize: "payment_method/check_weixin_authorize",
        paymentMethod_wppayOnlyQrcode: "payment_method/wppay_only_qrcode",
        paymentMethod_filter: "payment_method/filter",
        

        promotion_getAll: "promotion/get_all",
        promotion_preCreate: "promotion/pre_create",
        promotion_getAllPanel: "promotion/get_all_panel",
        promotion_avail: "promotion/avail",
        promotion_save:"promotion/save",
        promotion_getSingle:"promotion/get_single",
        promotion_remove:"promotion/remove",
        
        trade_getAll: "trade/get_all",
        trade_getSingle: "trade/get_single",
        trade_saveNote: "trade/save_note",
        trade_refund: "trade/refund",
        trade_getSingleCapture: "trade/get_single_capture",
        trade_saveTotalAmount:"trade/save_total_amount",

    
        shipmentSupplier_getAll: "shipment_supplier/get_all",
    
        shipmentTemplate_getAll: "shipment_template/get_all",
        shipmentTemplate_preCreate: "shipment_template/pre_create",
        shipmentTemplate_save: "shipment_template/save",
        shipmentTemplate_getSingle: "shipment_template/get_single",
        shipmentTemplate_duplicate: "shipment_template/duplicate",
        shipmentTemplate_remove: "shipment_template/remove",
        shipmentTemplate_checkUnUsed: "shipment_template/check_unused",

        shipment_change: "shipment/change",
        shipment_save: "shipment/save",
        shipment_send:"shipment/send",
        shipment_merge:"shipment/merge",
        shipment_split:"shipment/split",
        shipment_multiSend:"shipment/multi_send",
        


        vendor_multiCreate: "vendor/multi_create",
        vendor_multiRemove: "vendor/multi_remove",
        
        vendor_getAll: "vendor/get_all",
        vendor_getSingle: "vendor/get_single",
        vendor_fullCreate: "vendor/full_create",
        vendor_getAllPanel: "vendor/get_all_panel",
        vendor_getAllExclude:"vendor/get_all_exclude",
        vendor_getAllInclude:"vendor/get_all_include",
        vendor_update:"vendor/update",
        vendor_remove:"vendor/remove",
        vendor_create:"vendor/create",

        type_getAllPanel: "type/get_all_panel",
        type_getAllExclude:"type/get_all_exclude",
        type_getAllInclude:"type/get_all_include",


        type_getAll: "type/get_all",
        type_create: "type/create",
        type_save: "type/save",
        type_remove: "type/remove",
        type_checkExist: "type/check_exist",
        type_multiCreate: "type/multi_create",
        type_multiRemove: "type/multi_remove",

        option_getAll: "option/get_all",
        option_create: "option/create",
        option_delete: "option/delete",


        product_image_uploadSave: "product_image/upload_save",
        product_image_getAll: "product_image/get_all",
        product_image_resort:"product_image/resort",
        product_image_setAlt:"product_image/set_alt",
        product_image_setCover:"product_image/set_cover",
        product_image_remove: "product_image/remove",

        product_multiChangeVisibility: "product/multi_change_visibility",
        product_multiRemove: "product/multi_remove",
        product_batchManagement: "product/batch_management",

        product_getAll: "product/get_all",
        product_getSingle: "product/get_single",
        product_preCreate: "product/pre_create",
        product_save: "product/save",
        product_remove: "product/remove",
        product_resort:"product/resort",
        product_duplicate: "product/duplicate",
        product_checkLimit: "product/check_limit",
        product_checkBatchProcess: "product/check_batch_process_status",

        product_getAllPanel: "product/get_all_panel",
        


        customer_getAll:"customer/get_all",
        customer_getSingle: "customer/get_single",
        customer_getAddresses: "customer/get_addresses",
        customer_getPointDetails: "customer/reward_point_details",
        customer_customerForCoupon: "customer/customers_for_coupon",
        customer_getCoupons: "customer/get_coupons",
        customer_getCreditDetails: "customer/credit_record_details",
        customer_setPoint: "customer/largess_reward_point",
        customer_setCredit: "customer/adjust_credit",

        customer_level_getAll: "customer_level/get_all",
        customer_level_getSingle: "customer_level/get_single",
        customer_level_create: "customer_level/create",
        customer_level_save: "customer_level/save",
        customer_level_remove: "customer_level/remove",
        customer_level_multiRemove: "customer_level/multi_remove",
        customer_level_credit: "customer_level/credit",
        
        paymentMethod_filter: "payment_method/filter",


        coupon_group_getAll: "coupon_group/get_all",
        coupon_group_getSingle: "coupon_group/get_single",
        coupon_group_preCreate: "coupon_group/pre_create",
        coupon_group_save: "coupon_group/save",
        coupon_group_cancel: "coupon_group/cancel",
        coupon_group_publish: "coupon_group/publish_coupon_groups",
        coupon_group_assign: "coupon_group/assign",
        coupon_group_getCoupons: "coupon_group/get_coupons",
        coupon_group_create: "coupon_group/create",
        coupon_group_setExport: "coupon_group/set_export",
        coupon_group_update: "coupon_group/update",

        account_getAll: "account/get_all",
        account_getSingle: "account/get_single",
        account_getModules: "account/get_modules",
        account_create: "account/create",
        account_save: "account/save",
        account_remove: "account/remove",
        account_checkLimit: "account/check_limit",
        account_changeOwner: "account/change_owner",
        account_operateLog: "account/operate_log",
        account_sendChangeOwnerCode: "account/send_change_owner_code",


    };
   
    window.YoudianConf.apiUri = {
        get_tracker: "track"
    }
    

}());