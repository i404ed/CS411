/**
 * Created by ztx on 4/12/14.
 */

<script src="/socket.io/socket.io.js"></script>

var socket = io.connect('http://172.16.163.138:9999');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});