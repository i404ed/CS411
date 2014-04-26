/**
 * Created by ztx on 3/19/14.
 */
/**
 * Created by ztx on 11/11/13.
 */

var oururl="172.16.159.124";

$(function () {



// This is a configuration of form validation module. If form is not valid, form will be prevent submit until
//    everything satisfy the requirement.
    $('#signupform').find('input,textarea').not("[type=submit]").jqBootstrapValidation(
        {
            preventSubmit: true,
            submitError: function ($form, event, errors) {
                /* ... */
                alert("form invalid");
            },
            submitSuccess: function ($form, event) {
                event.preventDefault();


                    $.ajax({
                        url: 'http://'+oururl+':2014/signup',
                        dataType: 'json',
                        method: 'post',
                        data: $form.serialize(),
                        success: function () {
                            alert("register succesfully!");
                            window.location.href = "http://"+oururl+":2014/index.html";

                        },error: function (err) {
                              alert("the email already existed, try to a new one!");
                        }

                    });
                }

        }
    );
});





