/**
 * Created by ztx on 3/20/14.
 */

var oururl="172.16.219.137";
var courselist_json = [{"label":"CS 242"}];
var lasttime = "";
var selectedcourses = [];
var samplecoursedetail = {
        "CourseID":"cs411", 
        "Sections": [
            {"Section" : "AL1", "CRN" : "2", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL2", "CRN" : "3", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL3", "CRN" : "4", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"}
        ]
};

var samplecoursedetail2 = {
        "CourseID":"cs421", 
        "Sections": [
            {"Section" : "AL4", "CRN" : "5", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL5", "CRN" : "6", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
            {"Section" : "AL6", "CRN" : "7", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"}
        ]
};

var sampleharleninput = [
        {"CourseID":"cs411", 
        "Sections": [
             {"Section" : "AL1", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"}
        ]},

        {"CourseID":"cs421", 
        "Sections": [
            {"Section" : "AL6", "Time" : "03:00 PM - 03:50 PM", "Days":"F", "Type":"Lecture", "Availability" : "close"},
            {"Section" : "AL5", "Time" : "10:00 AM - 01:50 PM", "Days":"TR", "Type":"Discussion/Recitation", "Availability" : "close"}
        ]
        }
];

var sampleharlenoutput = [ { Section: 'AL1', Time: '01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM', Days: 'M\nM', Type: 'Discussion/Recitation\nLaboratory', Availability: 'open', CourseID: 'cs411' }, { Section: 'AL6', Time: '03:00 PM - 03:50 PM', Days: 'F', Type: 'Lecture', Availability: 'open', CourseID: 'cs421' }, { Section: 'AL100', Time: '10:00 AM - 01:50 PM', Days: 'TR', Type: 'Discussion/Recitation', Availability: 'open', CourseID: 'cs421' } ];

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
        inputvalue = $( '#course_search')[0].value;
        var found = false;
        for(var i = 0; i<courselist_json.length; i++ ){
            if (courselist_json[i].label == inputvalue){
                found = true;
                break;
            }
        }

        if (found == true){

            $.ajax({
                url: 'http://'+oururl+':2014/addcourse',
                dataType: 'json',
                type: 'get',
                data: {
                    'content': inputvalue
                },

                success: function (data, status,jqxhr) {
                    course_obj = data;

                    selectedcourses.push(course_obj);

                    var courseid = course_obj["CourseID"];
                    var sections = course_obj.Sections;
                    var currhtml = '<li id =' + courseid + '> <h5>' + courseid +'</h5>';
                    currhtml += '<button type="button" class = "coursedelete" id = '+ courseid + '_deletebutton' +'>Delete</button>';

                    currhtml += '<table style="width:100%;" class = "section_table" id ='+ courseid + '_table>' ;
                    for (var i = 0; i < sections.length; i++) {
                        currhtml += '<tr class = "coursedeletess" id ='+ sections[i].Section +'><td>' + sections[i].Section + '</td><td>' + sections[i].Days.replace("\n","/") + '</td><td>'+ sections[i].Time.replace("\n","/") + '</td><td>'+ sections[i].Availability + '</td></tr>';
                    }
                    currhtml += '</table>';
                    currhtml += '</li>';
                    $("#course_detail_list").append(currhtml);

                }
                ,
                error: function (err,status) {
                    alert("can't add course");
                }
            });

        }

    });

    $(document).on('click', "#generate",function() {
        //call harlen function
        //send to ztx
        for (var k = 0; k < sampleharlenoutput.length; k++){
            var courseid = sampleharlenoutput[k].CourseID;
            var section = sampleharlenoutput[k].Section;
            var days = sampleharlenoutput[k].Days.replace("\n","/");
            var time = sampleharlenoutput[k].Time.replace("\n","/");
            alert(time);
            convert_time_add_calendar(courseid, section, days, time);
        }

        /*
        for (var k = 0; k < sampleharlenoutput.length; k++){
            var courseid = sampleharlenoutput[k].CourseID;
            var sections = sampleharlenoutput[k].Sections;
            alert(sections.length);
            for (var m = 0; m < sections.length; m++) {
                var section = sections[m].Section;
                var days = sections[m].Days.replace("\n","/");
                var time = sections[m].Time.replace("\n","/");
                alert(time);
                convert_time_add_calendar(courseid, section, days, time);

            }
        }
        */
    });

    $(document).on('click', ".coursedelete",function() {
        var thisid = $(this).attr("id");
        var listelemid = thisid.replace('_deletebutton', '');
        var listindex = $('#' + listelemid).index();
        selectedcourses.splice(listindex, 1);
        $('#' + listelemid).remove();
    });

});