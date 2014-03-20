$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'inline';     
    
    $('#edit_username').editable();
    $('#edit_email').editable();
    $('#edit_password').editable();
    $('#edit_major').editable();
    
    /*sample*/
    $('#edit_standing').editable({
        type: 'select',
        title: 'Select status',
        placement: 'right',
        value: 2,
        source: [
            {value: 1, text: 'status 1'},
            {value: 2, text: 'status 2'},
            {value: 3, text: 'status 3'}
        ]
    });
    });
});