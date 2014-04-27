//var sdate = null;
//var edate = null;
//var edit_sdate = null;
//var edit_edate = null;
var stimestamp = 1398026463;
var etimestamp = stimestamp + (75 * 60);
var oururl="172.16.159.124";


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

$(document).ready(function() {
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

    });

});