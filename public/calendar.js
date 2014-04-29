//var sdate = null;
//var edate = null;
//var edit_sdate = null;
//var edit_edate = null;
var stimestamp = 1398026463;
var etimestamp = stimestamp + (75 * 60);
var oururl="172.16.159.124";
var offset = (new Date()).getTimezoneOffset();
var semester_start = (1408924800) + (offset*60);
var semester_end = (1418212740) + (offset*60);
var first_mon = 25;
var first_tue = 26;
var first_wed = 27;
var first_thu = 28;
var first_fri = 29;



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
                className : 'custom',
            }, true);

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
        eventtype: 'course',
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
            startDate: new Date(),
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

$(document).ready(function() {
    
    $(document).on('click', ".section_table tr",function() {
        var rowid = $(this).attr('id');
        var rowelem = document.getElementById(rowid);


        var section = rowelem.cells[0].innerHTML;
        var days = rowelem.cells[1].innerHTML;
        var time = rowelem.cells[2].innerHTML;
        alert(time);
        var tableid = (rowelem.parentNode.parentNode.id);
        var courseid = (tableid.replace("_table", ""));

        convert_time_add_calendar(courseid, section, days, time);
    });


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $('#new_event_btn_2').click(function() {
        sdate = null;
        edate = null;

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
        $('#add_event_button').click(function() {
            var etitle = $('#event_title').val();
            alert(etitle)
            AddEvent(etitle, sdate, edate);
            sdate = null;
            edate = null;
            document.getElementById("add_event_form").reset();
        });

    });



    $('#add_classes_button').click(function() {

        for (var i=0;i<6;i++)
        {
            AddEvent('c',stimestamp,etimestamp);
            etimestamp += (10080 * 60);
            stimestamp += (10080 * 60);
        }
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
                
                var CourseID = ((calEvent.id).split(" | "))[0];
                var Section = ((calEvent.id).split(" | "))[1];
                alert(CourseID);
                alert(Section);
                $('#calendar').fullCalendar('removeEvents', calEvent.id);
            }
            else{
        
                alert(calEvent.start)
                alert(calEvent.end)
                edit_sdate = null;
                edit_edate = null;

                $('#edit_startdate_field').datetimepicker().on('changeDate', function(ev){
                    var offset = (new Date()).getTimezoneOffset();
                    edit_sdate = (ev.date.valueOf()/1000) + (offset*60);
                    alert('ss');
                });

                $('#edit_enddate_field').datetimepicker().on('changeDate', function(ev){
                    var offset = (new Date()).getTimezoneOffset();
                    edit_edate = (ev.date.valueOf()/1000) + (offset*60);
                    alert('ss');
                });

                $("#edit_event_title").attr('value',calEvent.title);

                jq = jQuery.noConflict();
                $("#edit_event_modal").modal('show');
                $ = jQuery.noConflict();

                $('#edit_event_button').click(function() {
                    
                    temp_sdate = calEvent.start;
                    temp_edate = calEvent.end;
                   
                    calEvent.title = $('#edit_event_title').val();
                    if (edit_sdate != null)
                        calEvent.start = edit_sdate;
                    if (edit_edate != null)
                        calEvent.end = edit_edate;

                    if (calEvent.start<calEvent.end){

                         $.ajax({
                            url: 'http://'+oururl+':2014/add_event',
                            dataType: 'json',
                            type: 'post',
                            data: {
                                'id': calEvent.id,
                                'title': calEvent.title,
                                'start': calEvent.start,
                                'end': calEvent.end,
                                'email': sessionStorage.getItem('email')
                            },
                            success: function (data, status,jqxhr) {
                                jq = jQuery.noConflict();
                                $("#edit_event_modal").modal('hide');
                                $ = jQuery.noConflict();
                                $('#calendar').fullCalendar('updateEvent', calEvent);
                                document.getElementById("edit_event_form").reset();
                                location.reload();
                            }
                            ,
                            error: function (err,status) {
                               alert("can't edit event");
                            }
                        });

                    }
                    else if (calEvent.start>calEvent.end){
                        alert("check the date!!");
                        calEvent.start = temp_sdate;
                        calEvent.end = temp_edate;
                    }
                    else if (calEvent.start==calEvent.end && calEvent.start != null && calEvent.end != null){
                        //delete

                        $.ajax({
                            url: 'http://'+oururl+':2014/add_event',
                            dataType: 'json',
                            type: 'post',
                            data: {
                                'id': calEvent.id,
                                'email': sessionStorage.getItem('email')
                            },
                            success: function (data, status,jqxhr) {
                                $('#calendar').fullCalendar('removeEvents', calEvent.id);
                                location.reload();
                            }
                            ,
                            error: function (err,status) {
                               alert("can't delete event");
                            }
                        });
                        
                    }
                    
                });
            }
        }

    });

});

