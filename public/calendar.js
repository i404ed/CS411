var sdate = null;
var edate = null;
var stimestamp = 1398026463;
var etimestamp = stimestamp + (75 * 60);
function AddEvent(title, StartDate, EndDate) {
    $('#calendar').fullCalendar('renderEvent', {
        id: StartDate,
        title: title,
        start: StartDate,
        end: EndDate,
        allDay: false
    }, true);
}

 $(document).ready(function() {
        $('.form_datetime').datetimepicker({
            //language:  'fr',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1
        });

        $('#startdate_field').datetimepicker().on('changeDate', function(ev){
            sdate = (ev.date.getUTCFullYear() + "-" + 
                ("0" + (ev.date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + (ev.date.getUTCDate())).slice(-2) + " " + 
                ("0" + (ev.date.getUTCHours())).slice(-2) + ":" + ("0" + (ev.date.getUTCMinutes())).slice(-2) + ":" + "00");
        });

        $('#enddate_field').datetimepicker().on('changeDate', function(ev){
            edate = (ev.date.getUTCFullYear() + "-" + 
                ("0" + (ev.date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + (ev.date.getUTCDate())).slice(-2) + " " + 
                ("0" + (ev.date.getUTCHours())).slice(-2) + ":" + ("0" + (ev.date.getUTCMinutes())).slice(-2) + ":" + "00");
        });

});

$(document).ready(function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#add_event_button').click(function() {
        AddEvent('s', sdate , edate);
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
        events: [
            {
                title: 'Lunch',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            }
        ],

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