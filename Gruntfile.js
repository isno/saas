module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'static/main/dist/main.js',
        dest: 'static/main/dist/main.min.js'
      }
    },
    cssmin: { //css文件压缩
     css: {
        src: 'static/main/dist/main.css',//将之前的all.css
        dest: 'static/main/dist/main.min.css'  //压缩
      }
    },
    concat: { //合并文件
      js: {
        src: [
          "./static/main/libs/jquery.min.js",
          "./static/main/libs/angular.min.js",
          "./static/main/libs/angular-ui-router.min.js",
          "./static/main/libs/angular-sanitize.min.js",
          "./static/main/libs/moment.min.js",
          "./static/main/libs/URI.min.js",

          "./static/main/js/lib/underscore-min.js",
          "./static/main/js/urls.js",
          "./static/main/js/routes.js",
          "./static/main/js/lib/helper.js",
          "./static/main/js/lib/class.js",
          "./static/main/js/level.js",
          "./static/main/js/app.js",
          "./static/main/js/controllers/base_grid.js",
          "./static/main/js/controllers/base_edit.js",
          "./static/main/js/directives/navigation.js",
          "./static/main/js/directives/ico.js",
          "./static/main/js/directives/dropdown.js",
          "./static/main/js/directives/fadein.js",
          "./static/main/js/directives/mainbody.js",
          "./static/main/js/directives/btn.js",
          "./static/main/js/directives/btminfo.js",
          "./static/main/js/directives/mask.js",
          "./static/main/js/directives/popwindow.js",
          "./static/main/js/directives/check.js",
          "./static/main/js/directives/chk_expand.js",
          "./static/main/js/directives/validation.js",
          "./static/main/js/directives/help.js",
          "./static/main/js/directives/grid.js",
          "./static/main/js/directives/areaselector.js",
          "./static/main/js/directives/hint3.js",
          "./static/main/js/directives/pop_vendor.js",
          "./static/main/js/directives/date.js",
          "./static/main/js/directives/check_btn.js",
          "./static/main/js/directives/calendar.js",
          "./static/main/js/directives/calendar_limit.js",
          "./static/main/js/directives/datetime_cur.js",
          "./static/main/js/directives/pop_customer.js",
          "./static/main/js/directives/navigation_link_notification.js",

          "./static/main/js/directives/cover.js",
          "./static/main/js/directives/tagselector.js",
          "./static/main/js/directives/mainfollow.js",
          "./static/main/js/directives/pop_product.js",
          "./static/main/js/directives/datetime.js",

          

          "./static/main/js/controllers/404.js",
          "./static/main/js/controllers/setting.js",
          "./static/main/js/controllers/shipment.js",
          "./static/main/js/controllers/shipment_edit.js",

          "./static/main/js/controllers/product.js",
          "./static/main/js/controllers/product_edit.js",
          "./static/main/js/controllers/product_type.js",
          "./static/main/js/controllers/product_vendor.js",

          "./static/main/js/controllers/customer.js",
          "./static/main/js/controllers/customer_edit.js",
          "./static/main/js/controllers/customer_level.js",

          "./static/main/js/controllers/order.js",
          "./static/main/js/controllers/order_edit.js",


          "./static/main/js/controllers/promotion.js",
          "./static/main/js/controllers/promotion_off.js",
          "./static/main/js/controllers/promotion_discount.js",
          "./static/main/js/controllers/promotion_freeship.js",
          "./static/main/js/controllers/promotion_coupon.js",

          "./static/main/js/controllers/coupon.js",
          "./static/main/js/controllers/coupon_edit.js",
          "./static/main/js/controllers/coupon_single_edit.js",
          "./static/main/js/controllers/stat.js",

          "./static/main/js/controllers/account.js",
          "./static/main/js/controllers/account_edit.js",
          "./static/main/js/controllers/payment.js",

          "./static/main/js/controllers/not_in_plan.js",
          "./static/main/js/controllers/no_permission.js",
          "./static/main/js/controllers/not_owner.js",

          "./static/main/js/services/uri.js",
          "./static/main/js/services/popup.js",
          "./static/main/js/services/util.js",
          "./static/main/js/services/time.js",
          "./static/main/js/services/order.js",

          "./static/main/js/preset.js",
          "./static/main/js/area.js",
          "./static/main/libs/tinymce.min.js"
        ],
        dest: 'static/main/dist/main.js'
      },
      css: {
        src: [
          "static/main/css/base.css",
          "static/main/css/ico.css",
          "static/main/css/dropdown.css",
          "static/main/css/setting.css",
          "static/main/css/grid.css",
          "static/main/css/input.css",
          "static/main/css/popup.css",
          "static/main/css/shipment.css",
          "static/main/css/product.css",
          "static/main/css/customer_level.css",
          "static/main/css/trade_edit.css",
          "static/main/css/customer.css",
          "static/main/css/pop_product.css",
          "static/main/css/promotion.css",
          "static/main/css/coupon.css",
          "static/main/css/summary.css",
          "static/main/css/payment.css",
          "static/main/css/account.css"
        ],//当前grunt项目中路径下的src/css目录下的所有css文件
        dest: 'static/main/dist/main.css'  //生成到grunt项目路径下的dist文件夹下为all.css
      }
    }

  });
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat', "uglify","cssmin"]);
};
