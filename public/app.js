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
      goalHtml += "<span>    </span>";
      goalHtml += "<span id='delete-goal-button' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
      goalHtml += "<span>    </span>";
      goalHtml += "<span id='goal-completion-mark' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
      goalHtml += "<span>    </span>";
      goalHtml += "<span id='goal-completion-mark' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
      $("#homepage-goal-display").html(goalHtml);
      $("#goal-text").val("");
    };
  });

  $(document).on("click", "#goal-completion-mark", function() {
    var goalHtml = "<h2>Today's priority: " + $("#goal-text").val(); + "</h2>";
    goalHtml += "<span id='goal-completion-mark' class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
    goalHtml += "<span id='goal-completion-mark' class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
    goalHtml += "<span id='goal-completion-mark' class='glyphicon glyphicon-delete' aria-hidden='true'></span>";

    $("#homepage-goal-display").html(goalHtml);
  });

  $(document).on("click", "#delete-goal-button", function(){
    $("#homepage-goal-display").html("<p></p>");
  });



});