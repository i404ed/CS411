/**
 * Created by ztx on 3/20/14.
 */


var oururl="172.16.159.124";


$(document).ready(function () {
    var email = sessionStorage.getItem('email');
    if(email==null){
        window.location.href = "http://localhost:2014";
    }
    $.ajax({
        url: 'http://'+oururl+':2014/getusrinfo',
        dataType: 'json',
        type: 'get',
        data: {
            'email': email
        },
        success: function (json) {
            $('#edit_email')[0].innerText=json['Email'];
            $('#Name')[0].innerText=json['Name'];
            $('#Major')[0].innerText=json['Major'];
            $('#Password')[0].innerText=json['Password'];
            switch(json['Standing']){
                case 0: $('#Standing')[0].innerText="Freshman";
                    break;
                case 1: $('#Standing')[0].innerText="Sophomore";
                    break;
                case 2: $('#Standing')[0].innerText="Junior";
                    break;
                case 3: $('#Standing')[0].innerText="Senior";
                    break;
                case 4: $('#Standing')[0].innerText="Other";


            }
            //switch the standing
        }
        ,
        error: function (err,status) {
            alert("user doesn't exist!");
        }
    });
});