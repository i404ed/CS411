/**
 * Created by ztx on 3/20/14.
 */
$(document).ready(function () {
    var email = sessionStorage.getItem('user');
    var pwd = sessionStorage.getItem('pwd');
    if (email != "" && email != null) {

        //call when user info is confirmed by response and then update log info and private info on website.
        $('#username')[0].innerHTML = "<i class=\"icon-user icon-white\"></i>" + email;

    }
});