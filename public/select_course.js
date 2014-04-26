$( "#flip1" ).click(function() {
  $( "#first_class" ).toggle( "slow", function() {
    alert( "Course add or drop." );
  });
});


$( "#flip2" ).click(function() {
  $( "#book" ).hide( "toggle", function() {
    alert( "Course add or drop." );
  });
});


//here comes the funciton to search and return the result;


function search_course(){
       var searchvalue = document.getElementById('search_courses').value;
       var from_s = document.getElementById('select_course');
       for(var i =0; i<from_s.options.length;i++)
       {
        var temp = from_s.options[i].text;
            var exist = temp.search(searchvalue);
        if(exist >=1)
        {
            alert("add course");
        }

       }

}
