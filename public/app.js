$(document).ready(function() {
  $("#signup, #homepage, #progresspage").hide();



  $(document).on("click", "#sign-up-button", function() {
    $("#login").hide();
    $("#signup").show();
  });

  $(document).on("click", "#homepage-button", function() {
    $("#login").hide();
    $("#homepage").show();
  });

  $(document).on("click", "#login-button", function() {
    $("#signup").hide();
    $("#login").show();
  });

  $(document).on("click", "#progress-button", function() {
    $("#homepage").hide();
    $("#progresspage").show();
  });

  $(document).on("click", "#homenav-button", function() {
    $("#progresspage").hide();
    $("#homepage").show();
  });

  $(document).on("click", "#logout-button", function() {
    $("#progresspage").hide();
    $("#homepage").hide();
    $("#login").show();
  });

  $(document).on("click", "#goal-button", function() {
    console.log($("#goal-text").val());
    if ($("#goal-text").val() != "" ) {
      var goalHtml = "<h2>Today's priority: " + $("#goal-text").val(); + "</h2>";
      $("#homepage-goal-display").html(goalHtml);
      $("#goal-text").val("");
    };
  });
});