$('#signIn').click(function () {
//    get the value of log in information and store them in to session. New version makes it shorter and more
//    reasonable. page will change to main page after verifying user account.
    var email = $('#inputEmail').val();
    var pwd = $('#inputPassword').val();
    // using ajax to trigger a request to get question,comments.
    alert("here");
    $.ajax({
        url: 'http://localhost:2013/login',
        dataType: 'json',
        method: 'get',
        data: {
            email: email,
            pwd: pwd
        },
        success: function (json, textStatus) {
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('pwd', pwd);
            sessionStorage.setItem('json', JSON.stringify(json));
            window.location.href = "http://localhost:2013/mainpage.html";

        },
        error: function (err) {
            return  alert("error");
        }
    });
});











