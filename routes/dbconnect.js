/**
 * Created by ztx on 11/10/13.
 */
//    This is used to connect db.
var mysql = require('mysql');
function dbconn() {
    var connection = mysql.createConnection({
        host: 'engr-cpanel-mysql.engr.illinois.edu',
        database: 'cs411horse_iCouSchelper',
        user: 'cs411horse_123',
        password: 'rbtGXxHW$TiR'
    });
    return connection;
}

exports.dbconn = dbconn;
