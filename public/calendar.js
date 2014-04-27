//var sdate = null;
//var edate = null;
//var edit_sdate = null;
//var edit_edate = null;
var stimestamp = 1398026463;
var etimestamp = stimestamp + (75 * 60);
var oururl="172.16.159.124";


function AddEvent(title, StartDate, EndDate) {

    $('#calendar').fullCalendar('renderEvent', {

        title: title,
        start: StartDate,
        end: EndDate,
        allDay: false
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

            AddEvent(etitle, sdate, edate);
            sdate = null;
            edate = null;
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
                    jq = jQuery.noConflict();
                    $("#edit_event_modal").modal('hide');
                    $ = jQuery.noConflict();
                    $('#calendar').fullCalendar('updateEvent', calEvent);
                }
                else if (calEvent.start>calEvent.end){
                    alert("check the date!!");
                    calEvent.start = temp_sdate;
                    calEvent.end = temp_edate;
                }
                else if (calEvent.start==calEvent.end && calEvent.start != null && calEvent.end != null){
                    //delete
                    $('#calendar').fullCalendar('removeEvents');
                }
                
            });
        }

    });
});