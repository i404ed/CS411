$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'inline';     
    
    //make username editable
    $('#edit_username').editable();
    //$('#edit_email').editable();
    $('#edit_password').editable();
    $('#edit_major').editable();
    //make status editable
    $('#edit_standing').editable({
        type: 'select',
        title: 'Select status',
        placement: 'right',
        value: 1,
        source: [
            {value: 1, text: 'Freshman'},
            {value: 2, text: 'Sophomore'},
            {value: 3, text: 'Junior'},
            {value: 3, text: 'Senior'},
            {value: 3, text: 'Other'}
        ]
        /*
        //uncomment these lines to send data on server
        ,pk: 1
        ,url: '/post'
        */
    });
});