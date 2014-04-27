/**
 * Created by ztx on 3/19/14.
 */
var connfun = require("./dbconnect");
var crypto = require('crypto');

module.exports = function(app) {
    function encrypt(text){
        var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    function decrypt(text){
        var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    app.get('/login', function (req, res) {
        var obj = req.query;
        var test = decrypt("097662d985ff7be99b6b4da6bf5767aa");
        var conn = connfun.dbconn()
        conn.connect(function (err) {
            if (err == null) {
                var query_string = "select * from cs411horse_iCouSchelper.Users where Email =";
                var encrpty_pwd = encrypt(obj.pwd)
                query_string += "'"+obj.email+"' and Password='"+encrpty_pwd+"';";
                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            console.log(err);
                        }
                        else {

                            if(result.length!=0){
                                var resp = {};
                                resp["name"] = result[0]["Name"];

                                res.status(200).send(JSON.stringify(resp));

                            }
                            else{
                                res.status(404).send("user doesn't exist!")
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }
        });

    });

    app.get('/getusrinfo', function (req, res) {
        var obj = req.query;
        var conn = connfun.dbconn()
        conn.connect(function (err) {
            if (err == null) {
                var query_string = "select * from cs411horse_iCouSchelper.Users where Email =";
                query_string += "'"+obj.email+"';";
                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            console.log(err);
                        }
                        else {

                            if(result.length!=0){
                                res.status(200).send(JSON.stringify(result[0]));
                            }
                            else{
                                res.status(404).send("user doesn't exist!")
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }
        });

    });

    app.post('/signup',function(req,res){
        var data = req.body;
        var conn = connfun.dbconn();
        var text=data['form_password'];

        var encrypt_pwd = encrypt(text);


        var usr=new Array(
            "'" + data['form_email'] + "'",
            "'" + data['form_major'] + "'",
            "'" + data['form_choice'] + "'",
            "'" + data['form_username'] + "'",
            "'" +encrypt_pwd+ "'"
        )
        var query_string = "insert into cs411horse_iCouSchelper.Users values ("+usr+")";

        conn.connect(function (err) {
            if (err == null) {

                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            res.status(404).send("user doesn't exist!");
                        }
                        else {
                            if(result.affectedRows>0){
                                var resp = {};
                                resp["info"] = "ok";
                                res.status(200).send(JSON.stringify(resp));
                            }
                            else{
                                res.status(404).send("fail to sign up!");
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }
        });
    });

    app.post('/update',function(req,res){
        var data = req.body;
        var conn = connfun.dbconn();

        var query_string = "update cs411horse_iCouSchelper.Users set "+data['name']+"='"+data['value']+"' where Email='"+data['pkn']+"';";

        conn.connect(function (err) {
            if (err == null) {

                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            res.status(404).send("user doesn't exist!");
                        }
                        else {
                            if(result.affectedRows>0){
                                var resp = {};
                                resp["info"] = "ok";
                                res.status(200).send(JSON.stringify(resp));
                            }
                            else{
                                res.status(404).send("user doesn't exist!");
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }
        });
    });

    app.post('/add_event',function(req,res){
        var data = req.body;
        var conn = connfun.dbconn();
        var event = new Array(
            "'" + data['email'] + "'",
            "'" + data['start'] + "'",
            "'" + data['end'] + "'",
            "'" + data['title'] + "'"

        )

        var query_string = "insert into cs411horse_iCouSchelper.Events(Email,Start,End,Title)  values ("+event+")" ;

        conn.connect(function (err) {
            if (err == null) {

                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            res.status(404).send("fail to add event!");
                        }
                        else {
                            if(result.affectedRows>0){
                                var query = conn.query("select max(eventid) from cs411horse_iCouSchelper.Events",
                                    function (err, result) {
                                        var dict_event={};
                                        dict_event['eventid'] = result[0]['max(eventid)'];
                                        res.status(200).send(JSON.stringify(dict_event));
                                    });

                            }
                            else{
                                res.status(404).send("fail to add event!");
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }
        });
    });

    app.post('/updateuserinfo',function(req,res){
        var data = req.body;

        var conn = connfun.dbconn();
        if(data["name"]=="Password")
            var value = encrypt(data["value"]);
        else
            var value = data["value"];
        var query_string = "update cs411horse_iCouSchelper.Users set "+data["name"]+"='"+value+"' where Email='"+data["pkn"]+"';" ;

        conn.connect(function (err) {
            if (err == null) {

                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            res.status(404).send("fail to update user info!");
                        }
                        else {
                            if(result.affectedRows>0){

                                        var dict_event={};
                                        dict_event['status'] = 'success';
                                        res.status(200).send(JSON.stringify(dict_event));


                            }
                            else{
                                res.status(404).send("fail to update user info!");
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }
        });
    });




};



