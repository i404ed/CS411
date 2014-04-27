/**
 * Created by ztx on 3/20/14.
 */

function requestcourse(){
    var searchvalue = document.getElementById('search_courses').value;

    alert(searchvalue);

}

$(document).ready(function () {



    var email = sessionStorage.getItem('email');
    var pwd = sessionStorage.getItem('pwd');
    if (email != "" && pwd != null) {
        //call when user info is confirmed by response and then update log info and private info on website.
        $('#username')[0].innerHTML = "<span class=\"glyphicon glyphicon-user\"></span>" + email;

    }
});