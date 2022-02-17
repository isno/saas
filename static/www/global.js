var sentTime = 60;
var tcontrol;


function resetCountDown() {
    sentTime = 60;
    clearTimeout(tcontrol);
    $("#sms-button").html("免费获取验证码");
    $("#sms-button").removeAttr("disabled");
}
function countDown() {
    $("#sms-button").attr("disabled", true);
    $("#sms-button").html(sentTime + "秒后可重新获取");
    sentTime--;
    if (sentTime <= 0) return resetCountDown();
    tcontrol = setTimeout("countDown()", 1000);
}
function sendCode(obj, type) {
    obj.disabled = true;
    var captcha = $("#captcha").val()
    var phone = $("#phone").val()
    $.post('/auth/send_sms_code',{sms_type:type, captcha:captcha, phone:phone}, function(ret) {
        if(ret.code!=0) {
            $('#helpBlock').html('<div class="text-success">' + ret.message + '</div>');
            resetCountDown();
            $("#valid_code").focus();
            $("#valid_code").select();
        } else {
            $("#valid_code").focus();
            $("#valid_code").select();
            $('#helpBlock').html('<div class="text-success">验证码已发送（60秒内只能获取一次）。</div>');
            obj.disabled = false;
            countDown();
        }
        obj.disabled = false;
    });
}
