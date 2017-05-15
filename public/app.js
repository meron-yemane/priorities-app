$(document).ready(function() {
  $("#signup, #homepage, #progresspage").hide();


});

$(document).on("click", "#great", function() {
  $("#login").hide();
  $("#signup").show();
});