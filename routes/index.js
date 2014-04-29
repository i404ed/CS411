/**
 * Created by ztx on 3/19/14.
 */
var connfun = require("./dbconnect");
var crypto = require('crypto');
var request = require('request');
var cheerio = require('cheerio');



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


    app.get('/getallinfo', function (req, res) {
        var obj = req.query;
        var email = obj['email'];
        var conn = connfun.dbconn();
        conn.connect();

        var query_string_1 = "select * from cs411horse_iCouSchelper.Events where Email ='"+email+"';";
        var query_string_2 = "select * from cs411horse_iCouSchelper.Taking where Email ='"+email+"';";
        var resp = {};

        conn.query(query_string_1,
            function (err, result) {
                // Neat!
                if (err != null ) {
                    console.log(err);
                }
                else {
                    if(result.length!=0){
                        resp["event"] = result;
                    }


                        conn.query(query_string_2,
                            function (err, result2) {
                                // Neat!
                                if (err != null) {
                                    console.log(err);

                                }
                                else {

                                    if(result2.length!=0){



                                        resp["course"] = result2;



                                    }
                                    else{
                                        res.status(404).send("user doesn't exist!");

                                    }


                                    res.status(200).send(JSON.stringify(resp));

                                }

                            });

                    }




                conn.end();

            });



    });

    app.get('/login', function (req, res) {
        var obj = req.query;
        var test = decrypt("097662d985ff7be99b6b4da6bf5767aa");
        var conn = connfun.dbconn()
        conn.connect();

        var query_string = "select * from cs411horse_iCouSchelper.Users where Email =";
        var encrpty_pwd = encrypt(obj.pwd)
        query_string += "'"+obj.email+"' and Password='"+encrpty_pwd+"';";

        conn.query(query_string,
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
            conn.end();
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
                        conn.end();
                    });
            }
            else {
                console.log(err);


            }
        });

    });

    app.get('/courseinfo',function(req,res){
        var data = req.query;

        var conn = connfun.dbconn();

        var query_string = "select CourseID from cs411horse_iCouSchelper.webparser_course where CourseID like '"+data["content"]+"%' ;" ;

        conn.connect();
        conn.query(query_string,
            function (err, result) {
                // Neat!
                if (err != null) {
                    res.status(404).send("fail to extract course info!");
                }
                else {
                    if(result!=null){
                        var dict_event={};
                        dict_event['courselist'] = result;
                        res.status(200).send(JSON.stringify(dict_event));

                    }
                    else{
                        var dict_event={};
                        dict_event['courselist'] = result;
                        res.status(200).send(JSON.stringify(dict_event));

                    }


                }

                conn.end();
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
        var query_string = "insert into cs411horse_iCouSchelper.Users values ("+usr+");";

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
            conn.end();
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
            conn.end();
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

        var query_string = "insert into cs411horse_iCouSchelper.Events(Email,Start,End,Title)  values ("+event+");" ;

        conn.connect(function (err) {
            if (err == null) {

                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            res.status(404).send("fail to add event!");
                            conn.end();
                        }
                        else {
                            if(result.affectedRows>0){
                                var query = conn.query("select max(eventid) from cs411horse_iCouSchelper.Events",
                                    function (err, result) {
                                        var dict_event={};
                                        dict_event['eventid'] = result[0]['max(eventid)'];
                                        res.status(200).send(JSON.stringify(dict_event));
                                        conn.end();
                                    });

                            }
                            else{
                                res.status(404).send("fail to add event!");
                                conn.end();
                            }


                        }
                    });
            }
            else {
                console.log(err);


            }

        });
    });
    app.post('/editEvent',function(req,res){
        var data = req.body;
        var conn = connfun.dbconn();
        var query_string ="";

        if(data['start']==data['end']){
            query_string = "delete * from cs411horse_iCouSchelper.Events where  Email='"+data['pkn']+"';"
        }
        else{
             query_string = "update cs411horse_iCouSchelper.Events set Start='"+data['start'] +"', End='"+
                data['end']+"', Title='"+data['title']+"' where Email='"+data['email']+"';";
        }


        conn.connect(function (err) {
            if (err == null) {

                var query = conn.query(query_string,
                    function (err, result) {
                        // Neat!
                        if (err != null || result == null) {
                            res.status(404).send("fail to edit event!");
                            conn.end();
                        }
                        else {
                            if(result.affectedRows>0){

                                        var dict_event={};
                                        dict_event['status'] = "success";
                                        res.status(200).send(JSON.stringify(dict_event));
                                        conn.end();


                            }
                            else{
                                res.status(404).send("fail to edit event!");
                                conn.end();
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

        conn.connect();

        conn.query(query_string,
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
                conn.end();
            });

    });


    function checkavaliable(courseid,query_result,res){
        var dep=courseid.split(" ");
//        var url_str = "https://courses.illinois.edu/cisapp/dispatcher/schedule/2014/spring/CS/373";
        var url_str = "https://courses.illinois.edu/cisapp/dispatcher/schedule/2014/fall/"+dep[0]+"/"+dep[1];



        request({
            "uri": url_str
        }, function(err, resp, body){
            var $ = cheerio.load(body);

            var sec_list = [];
            var avab_list = [];
            var i=1;
            $('.table-item .w55').each(function(index,item){
                if(index>=0)
                {
                    if(i%2!=0){
                       var text=item.children[1].children[0].data;
                       sec_list.push(text.trim().replace("\n",""));
                    }
                    i=i+1;

                }
            });

            $('.table-item .w50 .fl-offScreen-hidden').each(function(index,item){

                if(index>=0)
                {
                    var text=item.children[0].data;
                    avab_list.push(text.replace("section ",""));
                }
            });


            var samplecoursedetail = {
                "CourseID":"cs411",
                "Sections": [
                    {"Section" : "AL1", "CRN" : "2", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
                    {"Section" : "AL2", "CRN" : "3", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"},
                    {"Section" : "AL3", "CRN" : "4", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "close"}
                ]
            };

            for(var i=0;i<query_result.length;i++){
               for (var j=0; j<sec_list.length; j++){
                   if(query_result[i]["Section"]==sec_list[j]){
                       query_result[i]["Availability"]=avab_list[j];

                   }
               }
            }
            var dict_course={};
            dict_course["CourseID"]=courseid;
            dict_course["Sections"]=query_result;
            res.status(200).send(JSON.stringify(dict_course));


        });

    }
    app.get('/addcourse',function(req,res){
        var data = req.query;
        var conn = connfun.dbconn();
        var courseid = data['content'];
        var query_string = "select Days,Section,Time,Type from cs411horse_iCouSchelper.webparser_slots where CourseID= '"+courseid+"';"
        conn.connect();

        conn.query(query_string,
            function (err, result) {
                // Neat!
                if (err != null ) {
                    res.status(404).send("fail to extract course info!");
                }
                else {
                    if(result.length>0){
                        var result =checkavaliable(courseid,result,res);



                    }
                    else{
                        res.status(200).send("no info for this course!");
                    }


                }
                conn.end();
            });
    });


    app.post('/add_',function(req,res){
        var data = req.body;
        var conn = connfun.dbconn();
        var section=null;
        var query_string_1 = "delete from cs411horse_iCouSchelper.Taking where Email='"+data['email']+"';";
        var query_string = "insert into cs411horse_iCouSchelper.Taking(Email,CourseID,Days,Time,Section)  values ";
        var section_list = data["sectionlists"];
        for(var i in section_list){
            query_string+="(";
            section= new Array(
                "'" + data['email'] + "'",
                "'" + section_list[i]['CourseID'] + "'",
                "'" + section_list[i]['Days'] + "'",
                "'" + section_list[i]['Time'] + "'",
                "'" + section_list[i]['Section'] + "'"

            );
            query_string+=section;
            if(i < (section_list.length-1)){
                query_string+="),";
            }
            else{
                query_string+=")";
            }

        }

       query_string+=";" ;

        conn.connect();





        conn.query(query_string_1,
            function (err, result) {
                // Neat!
                if (err != null || result == null) {
                    console.log(err);
                }
                else {



                        conn.query(query_string,
                            function (err, result2) {
                                // Neat!
                                if (err != null || result2 == null) {
                                    console.log(err);
                                    conn.end();
                                }
                                else {

                                    if(result2.length!=0){

                                        var dict_event={};
                                        dict_event['status'] = "success";
                                        res.status(200).send(JSON.stringify(dict_event));
                                        conn.end();

                                    }
                                    else{
                                        res.status(404).send("user doesn't exist!");
                                        conn.end();
                                    }



                                }

                            });

                    }





            });

    });



};



