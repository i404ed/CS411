//var sdate = null;
//var edate = null;
//var edit_sdate = null;
//var edit_edate = null;

var oururl="172.16.219.137";


var stimestamp = 1398026463;
var etimestamp = stimestamp + (75 * 60);
var offset = (new Date()).getTimezoneOffset();
var semester_start = (1408924800) + (offset*60);
var semester_end = (1418212740) + (offset*60);
var first_mon = 25;
var first_tue = 26;
var first_wed = 27;
var first_thu = 28;
var first_fri = 29;
var sdate = null;
var edate = null;
var editingEvent = null;


function AddEvent(title, StartDate, EndDate) {

    $.ajax({
        url: 'http://'+oururl+':2014/add_event',
        dataType: 'json',
        type: 'post',
        data: {
            'title': title,
            'start': StartDate,
            'end': EndDate,
            'email': sessionStorage.getItem('email')
        },
        success: function (data, status,jqxhr) {
            var eventid = data['eventid'];

            $('#calendar').fullCalendar('renderEvent', {
                id: eventid,
                title: title,
                start: StartDate,
                end: EndDate,
                allDay: false,
                className : 'user_event'
            }, true);
            AddEventList(title, StartDate, EndDate, eventid);
        }
        ,
        error: function (err,status) {
           alert("can't add event");
        }
    });


}

function AddCourseEvent(title, StartDate, EndDate, id) {

    $('#calendar').fullCalendar('renderEvent', {
        id: id,
        title: title,
        start: StartDate,
        end: EndDate,
        allDay: false,
        className : 'custom',
        eventtype: 'course'
    }, true);
}

$(document).ready(function() {
        $('.form_datetime').datetimepicker({
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            startDate: new Date()
        });
});


function convert_time_add_calendar(courseid, section, days, time){
        var time_block_split = time.split("/");
        var days_block_split = days.split("/");

        for (var i = 0; i < time_block_split.length; i++) {
            //time
            var start_and_end = time_block_split[i].split(" - ");
            var start_time = start_and_end[0].replace(":", " ").split(" ");
            var start_time_hour = parseInt(start_time[0]);
            var start_time_min = parseInt(start_time[1]);

            var end_time = start_and_end[1].replace(":", " ").split(" ");
            var end_time_hour = parseInt(end_time[0]);
            var end_time_min = parseInt(end_time[1]);


            if (start_and_end[0].indexOf("PM") != -1){
                start_time_hour += 12
            }

            if (start_and_end[1].indexOf("PM") != -1){
                end_time_hour += 12
            }

            //day
            day_split = days_block_split[i].split("");
            for (var j = 0; j < day_split.length; j++) {
                if (day_split[j]=="M")
                    day = first_mon;
                else if (day_split[j]=="T")
                    day = first_tue;
                else if (day_split[j]=="W")
                    day = first_wed;
                else if (day_split[j]=="R")
                    day = first_thu;
                else if (day_split[j]=="F")
                    day = first_fri;

                var first_class_start = new Date(2014, 7, day, start_time_hour, start_time_min);
                var first_class_end = new Date(2014, 7, day, end_time_hour, end_time_min);
                var first_class_start = (first_class_start.valueOf())/1000;
                var first_class_end = (first_class_end.valueOf())/1000;
                while(first_class_end<semester_end){
                    AddCourseEvent(courseid + " | " + section,first_class_start,first_class_end, courseid + " | " + section);
                    first_class_start += (10080 * 60);
                    first_class_end += (10080 * 60);
                }

            }
        }
}

function formatDateString(date) {
  var datestr = date.toDateString();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strRes = datestr + " " + hours + ':' + minutes + ' ' + ampm;
  return strRes;
}

function AddEventList(title, StartDate, EndDate, eventid){

        var currhtml = '<li id=' + eventid + ' >';
        currhtml += '<h5>' + title + '</h5>' + '<p>' + formatDateString(new Date(StartDate*1000)) + '</p>' + '<p>' + formatDateString(new Date(EndDate*1000)) + '</p>';
        currhtml += '</li>';
        $("#event_list").append(currhtml);

}

$(document).ready(function() {
    
    $(document).on('click', ".section_table tr",function() {
        var rowid = $(this).attr('id');
        var rowelem = document.getElementById(rowid);


        var section = rowelem.cells[0].innerHTML;
        var days = rowelem.cells[1].innerHTML;
        var time = rowelem.cells[2].innerHTML;

        var tableid = (rowelem.parentNode.parentNode.id);
        var courseid = (tableid.replace("_table", ""));
        courseid = courseid.replace("_", " ");
        convert_time_add_calendar(courseid, section, days, time);
        selectedsections.push({ Section: section, Time: time, Days: days, CourseID: courseid });
    });


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $('#new_event_btn_2').click(function() {

        $('#startdate_field').datetimepicker().on('changeDate', function(ev){
            var offset = (new Date()).getTimezoneOffset();
            sdate = (ev.date.valueOf()/1000) + (offset*60);
        });

        $('#enddate_field').datetimepicker().on('changeDate', function(ev){
            var offset = (new Date()).getTimezoneOffset();
            edate = (ev.date.valueOf()/1000) + (offset*60);
        });

        jq = jQuery.noConflict();
        $("#add_event_modal").modal('show');
        $ = jQuery.noConflict();
    });

    $('#add_event_button').click(function() {
        var etitle = $('#event_title').val();
        AddEvent(etitle, sdate, edate);
        document.getElementById("add_event_form").reset();
        jq = jQuery.noConflict();
        $("#add_event_modal").modal('hide');
        $ = jQuery.noConflict();
    });

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        defaultView: 'agendaWeek',
        firstHour: 7,
        allDaySlot: false,
        events: 'eventsJason.json',

        dayClick: function(date, allDay, jsEvent, view) {

            if (!allDay) {
                alert('Clicked on the slot: ' + date);
                alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            }
        },

       eventClick: function(calEvent, jsEvent, view) {

            if(calEvent.eventtype === 'course'){

                var CourseID = (((calEvent.id).split(" | "))[0]).replace("_", " ");
                var Section = ((calEvent.id).split(" | "))[1];

                $('#calendar').fullCalendar('removeEvents', calEvent.id);
            }
            else{

                edit_sdate = null;
                edit_edate = null;
                editingEvent = calEvent;
                $("#edit_event_title").attr('value',calEvent.title);

                jq = jQuery.noConflict();
                $("#edit_event_modal").modal('show');
                $ = jQuery.noConflict();


            }
        }
    });

    $('#edit_startdate_field').datetimepicker().on('changeDate', function(ev){
        var offset = (new Date()).getTimezoneOffset();
        edit_sdate = (ev.date.valueOf()/1000) + (offset*60);

    });

    $('#edit_enddate_field').datetimepicker().on('changeDate', function(ev){
        var offset = (new Date()).getTimezoneOffset();
        edit_edate = (ev.date.valueOf()/1000) + (offset*60);

    });

    $('#edit_event_button').click(function() {
        
        temp_sdate = editingEvent.start;
        temp_edate = editingEvent.end;
        editing_id = editingEvent.id;
       
        editingEvent.title = $('#edit_event_title').val();
        if (edit_sdate != null)
            editingEvent.start = edit_sdate;
        if (edit_edate != null)
            editingEvent.end = edit_edate;

        if (editingEvent.start<=editingEvent.end){

             $.ajax({
                url: 'http://'+oururl+':2014/editEvent',
                dataType: 'json',
                type: 'post',
                data: {
                    'id': editingEvent.id,
                    'title': editingEvent.title,
                    'start': editingEvent.start,
                    'end': editingEvent.end,
                    'email': sessionStorage.getItem('email')
                },
                success: function (data, status,jqxhr) {
                    jq = jQuery.noConflict();
                    $("#edit_event_modal").modal('hide');
                    $ = jQuery.noConflict();
                    $('#calendar').fullCalendar('updateEvent', editingEvent);
                    document.getElementById("edit_event_form").reset();
                    document.getElementById(editing_id).innerHTML = '<h5>' + editingEvent.title + '</h5>' + '<p>' + formatDateString(new Date(editingEvent.start*1000)) + '</p>' + '<p>' + formatDateString(new Date(editingEvent.end*1000)) + '</p>';
                }
                ,
                error: function (err,status) {
                   alert("can't edit event");
                }
            });

        }
        else {
            alert("check the date!!");
            calEvent.start = temp_sdate;
            calEvent.end = temp_edate;
        }
//                    else if (calEvent.start==calEvent.end && calEvent.start != null && calEvent.end != null){
//                        //delete
//
//                        $.ajax({
//                            url: 'http://'+oururl+':2014/delete_event',
//                            dataType: 'json',
//                            type: 'post',
//                            data: {
//                                'id': calEvent.id,
//                                'email': sessionStorage.getItem('email')
//                            },
//                            success: function (data, status,jqxhr) {
//                                $('#calendar').fullCalendar('removeEvents', calEvent.id);
//                                location.reload();
//                            }
//                            ,
//                            error: function (err,status) {
//                               alert("can't delete event");
//                            }
//                        });
//
//                    }
        
    });

});

