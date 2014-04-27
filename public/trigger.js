/**
 * Created by ztx on 3/20/14.
 */


var oururl="172.16.159.124";

function requestcourse(){
    var searchvalue = document.getElementById('search_courses').value;

    alert(searchvalue);

}

$(document).ready(function () {



    var email = sessionStorage.getItem('email');
    var pwd = sessionStorage.getItem('pwd');
    var name = sessionStorage.getItem('name');

    if (email != ""&& email!=null) {
        //call when user info is confirmed by response and then update log info and private info on website.
        $('#userdisplayinfo').append("&nbsp;&nbsp;"+name);

    }
    else{
        window.location.href = "http://"+oururl+":2014/home.html";
    }
});