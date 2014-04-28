/**
 * Created by ztx on 3/20/14.
 */


var oururl="172.16.159.124";
var courselist_json = [{"label":"CS 242"}];
var lasttime = "";
var selectedcourses = [];
var samplecoursedetail = {
        "CourseID":"cs411", 
        "Sections": [
            {"Section" : "AL1", "CRN" : "2", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL2", "CRN" : "3", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL3", "CRN" : "4", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
        ]
};

var samplecoursedetail2 = {
        "CourseID":"cs421", 
        "Sections": [
            {"Section" : "AL4", "CRN" : "5", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL5", "CRN" : "6", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL6", "CRN" : "7", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
        ]
};


function requestcourse(){
    var searchvalue = document.getElementById('course_search').value;
    if(searchvalue!=lasttime){
        $.ajax({
            url: 'http://'+oururl+':2014/courseinfo',
            dataType: 'json',
            type: 'get',
            data: {
                'content': searchvalue.toUpperCase()
            },

            success: function (data, status,jqxhr) {
                var courselist = data['courselist'];

                var jsonstr = JSON.stringify(courselist);
                var new_jsonstr = jsonstr.replace(/"CourseID"/g, '"label"');
                courselist_json = JSON.parse(new_jsonstr);

                $( "#course_search" ).autocomplete(
                    {
                        source: courselist_json
                    })

            }
            ,
            error: function (err,status) {
                alert("can't search course");
            }
        });
        lasttime = searchvalue;
    }


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


    $(document).on('click', '.course_title', function(event) {

        var thisid = $(this).attr("id");
        var detailid = $('#'+thisid+"_detail");

        $( detailid ).slideToggle( "slow", function() {
        });

    });
    $(document).on('click', "#add_course_button",function() {
        inputvalue = $( '#course_search').value;
        var found = false;
        for(var i = 0; i<courselist_json.length; i++ ){
            if (courselist_json[i].label == inputvalue){
                found = true;
                break;
            }
        }

        if (found == true){

            $.ajax({
                url: 'http://'+oururl+':2014/courseinfo',
                dataType: 'json',
                type: 'get',
                data: {
                    'content': inputvalue
                },

                success: function (data, status,jqxhr) {
                    
                }
                ,
                error: function (err,status) {
                    alert("can't add course");
                }
            });

        }
        /*
        selectedcourses.push(samplecoursedetail);

        var courseid = samplecoursedetail["CourseID"];
        var sections = samplecoursedetail.Sections;
        var currhtml = '<li id =' + courseid + '> <h5>' + courseid +'</h5>';
        currhtml += '<button type="button" class = "coursedelete" id = '+ courseid + '_deletebutton' +'>Delete</button>';

        currhtml += '<table style="width:100%;" class = "section_table" id ='+ courseid + '_table>' ;
        for (var i = 0; i < sections.length; i++) {
            currhtml += '<tr class = "coursedeletess" id ='+ sections[i].Section +'><td>' + sections[i].Section + '</td><td>' + sections[i].CRN + '</td><td>' + sections[i].Days.replace("\n","/") + '</td><td>'+ sections[i].Time.replace("\n","/") + '</td><td>'+ sections[i].Availability + '</td></tr>';
        }
        currhtml += '</table>';
        currhtml += '</li>';
        $("#course_detail_list").append(currhtml);


        selectedcourses.push(samplecoursedetail2);

        var courseid = samplecoursedetail2["CourseID"];
        var sections = samplecoursedetail2.Sections;
        var currhtml = '<li id =' + courseid + '> <h5>' + courseid +'</h5>';
        currhtml += '<button type="button" class = "coursedelete" id = '+ courseid + '_deletebutton' +'>Delete</button>';

        currhtml += '<table style="width:100%;" class = "section_table" id ='+ courseid + '_table>';
        for (var i = 0; i < sections.length; i++) {
            currhtml += '<tr class = "coursedeletess" id ='+ sections[i].Section +'><td>' + sections[i].Section + '</td><td>' + sections[i].CRN + '</td><td>' + sections[i].Days.replace("\n","/") + '</td><td>'+ sections[i].Time.replace("\n","/") + '</td><td>'+ sections[i].Availability + '</td></tr>';
        }
        currhtml += '</table>';
        currhtml += '</li>';
        $("#course_detail_list").append(currhtml);
        */

    });

    $(document).on('click', "#generate",function() {
        //send to harlen
        alert(selectedcourses);
    });

    $(document).on('click', ".coursedelete",function() {
        var thisid = $(this).attr("id");
        var listelemid = thisid.replace('_deletebutton', '');
        var listindex = $('#' + listelemid).index();
        selectedcourses.splice(listindex, 1);
        $('#' + listelemid).remove();
    });




});