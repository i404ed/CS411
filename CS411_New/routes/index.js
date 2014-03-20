/**
 * Created by ztx on 3/19/14.
 */
var connfun = require("./dbconnect");
module.exports = function(app) {
    app.get('/login', function (req, res) {
        var obj = req.query;
        var conn = connfun.dbconn()
        conn.connect(function (err) {
            if (err == null) {
                var query_string = "select * from cs411horse_iCouSchelper.Users where Email =";
                query_string += "'"+obj.email+"' and Password='"+obj.pwd+"';";
                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            console.log(err);
                        }
                        else {

                            if(result.length!=0){
                                var resp = {};
                                resp["email"] = obj.email;
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
        var usr=new Array(
            "'" + data['form_email'] + "'",
            "'" + data['form_major'] + "'",
            "'" + data['form_choice'] + "'",
            "'" + data['form_username'] + "'",
            data['form_password']
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




    app.post('/update',function(req,res){
        var data = req.body;
        var conn = connfun.dbconn();

        var query_string = "update cs411horse_iCouSchelper.Users set"+data[name]+"='"+data[value]+"' where Email='"+data[pkn]+"';";

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

};



