var sdate = null;
var edate = null;
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


    $.ajax({
        url: 'http://'+oururl+':2014/add_event',
        dataType: 'json',
        type: 'post',
        data: {
            'title': title,
            'start': StartDate,
            'end': EndDate,
            'allDay': false
        },
        success: function (email, pwd) {
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
            showMeridian: 1
        });

        $('#startdate_field').datetimepicker().on('changeDate', function(ev){
            var offset = (new Date()).getTimezoneOffset();
            sdate = (ev.date.valueOf()/1000) + (offset*60);
            //alert(sdate);
            /*
            sdate = (ev.date.getUTCFullYear() + "-" + 
                ("0" + (ev.date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + (ev.date.getUTCDate())).slice(-2) + " " + 
                ("0" + (ev.date.getUTCHours())).slice(-2) + ":" + ("0" + (ev.date.getUTCMinutes())).slice(-2) + ":" + "00");*/
        });

        $('#enddate_field').datetimepicker().on('changeDate', function(ev){
            var offset = (new Date()).getTimezoneOffset();
            edate = (ev.date.valueOf()/1000) + (offset*60);
            /*
            edate = (ev.date.getUTCFullYear() + "-" + 
                ("0" + (ev.date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + (ev.date.getUTCDate())).slice(-2) + " " + 
                ("0" + (ev.date.getUTCHours())).slice(-2) + ":" + ("0" + (ev.date.getUTCMinutes())).slice(-2) + ":" + "00");*/
        });

});

$(document).ready(function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#add_event_button').click(function() {
        var etitle = $('#event_title').val();
        alert(etitle)
        AddEvent(etitle, sdate, edate);
    });

    $('#add_classes_button').click(function() {

        for (var i=0;i<6;i++)
        {
            AddEvent('c',stimestamp,etimestamp);
            etimestamp += (10080 * 60);
            stimestamp += (10080 * 60);
        }
    });

    var events_array = [
        {
        title: 'Test1',
        start: new Date(2012, 10, 1),
        allDay: false},
    {
        title: 'Test2',
        start: new Date(2012, 10, 2),
        allDay: true}
    ];

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        defaultView: 'agendaWeek',
        firstHour: 7,
        //allDaySlot: false,
        events: 'eventsJason.json',

        dayClick: function(date, allDay, jsEvent, view) {

            if (!allDay) {
                alert('Clicked on the slot: ' + date);
                alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            }
        },

        eventClick: function(calEvent, jsEvent, view) {

            alert('Event: ' + calEvent.title);
            alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        }

    });
});