$('#signIn').click(function () {
//    get the value of log in information and store them in to session. New version makes it shorter and more
//    reasonable. page will change to main page after verifying user account.
    var email = $('#inputEmail').val();
    var pwd = $('#inputPassword').val();
    var oururl="172.16.159.124";






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
        success: function (email, pwd) {
            sessionStorage.setItem('email', email.email);
            sessionStorage.setItem('pwd', pwd);
            window.location.href = "http://"+oururl+":2014/home.html";
        }
        ,
        error: function (err,status) {
           alert("user doesn't exist!");
        }
    });
});











