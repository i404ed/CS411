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
