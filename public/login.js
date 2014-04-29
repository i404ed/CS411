
sessionStorage.setItem('email', "");
sessionStorage.setItem('pwd', "");
sessionStorage.setItem('name', "");

var oururl="172.16.219.137";


$('#signIn').click(function () {
//    get the value of log in information and store them in to session. New version makes it shorter and more
//    reasonable. page will change to main page after verifying user account.



    var email = $('#inputEmail').val();
    var pwd = $('#inputPassword').val();







    // using ajax to trigger a request to get question,comments.
    $.ajax({
//        url: 'http://localhost:2014/login',
        url: 'http://'+oururl+':2014/login',

        dataType: 'json',
        type: 'get',
        data: {
            'email': email,
            'pwd': pwd
        },
        success: function (data, status) {
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('pwd', pwd);
            sessionStorage.setItem('name', data["name"]);
            document.getElementById("loginform").reset();
            window.location.href = "http://"+oururl+":2014/home.html";
        }
        ,
        error: function (err,status) {
           alert("user doesn't exist!");
        }
    });
});











