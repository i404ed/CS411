$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'inline';
    
    $('#Name').editable({
        params: function(params) {
            //originally params contain pk, name and value
            params.pkn =$('#edit_email').text();
            return params;
        },
        pk:2,
        type:'text',
        url:'updateuserinfo',
        success: function(response, newValue) {
//          if(response.status == 'error') return response.msg; //msg will be shown in editable form

        }
    });

    $('#Password').editable({
        params: function(params) {
            //originally params contain pk, name and value
            params.pkn =$('#edit_email').text();
            return params;
        },
        pk:1,
        type:'text',
        url:'updateuserinfo',
        success: function(response, newValue) {
            if(response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    });
    $('#Major').editable({
        params: function(params) {
            //originally params contain pk, name and value
            params.pkn =$('#edit_email').text();
            return params;
        },
        pk:3,
        type:'text',
        url:'/updateuserinfo',
        success: function(response, newValue) {
            if(response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    });
    
    /*sample*/
    $('#Standing').editable({
        params: function(params) {
            //originally params contain pk, name and value
            params.pkn =$('#edit_email').text();
            return params;
        },
        pk:4,
        type: 'select',
        title: 'Select status',
        placement: 'right',
        url: '/updateuserinfo',
        value: 0,
        source: [
            {value: 0, text: 'Freshman'},
            {value: 1, text: 'Sophomore'},
            {value: 2, text: 'Junior'},
            {value: 3, text: 'Senior'},
            {value: 4, text: 'other'}

        ]
    });
    });
