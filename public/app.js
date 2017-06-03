$(document).ready(function() {

  $("#signup, #homepage, #progresspage").hide();

  $(document).on("click", "#sign-up-button", function() {
    $("#login").hide();
    $("#signup").show();
  });

  // $(document).on("click", "#homepage-button", function() {
  //   $("#login").hide();
  //   $("#homepage").show();
  // });

  $("#login-form").submit(function(e) {
    e.preventDefault();
    $("#login").hide();
    // make AJAX call to validate account
    $("#homepage").show();    
  });

  $("#signup-form").submit(function(e) {
    e.preventDefault();
    $("#signup").hide();
    // make AJAX call to create account
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

  $("#set-goal").submit(function(e) {
    e.preventDefault();
    var goal = $("#goal-text").val();
    $("#goal-text").val("");
    var goalRecord = {};
    goalRecord.id = mock_goals.goals.length;
    goalRecord.goal = goal;
    goalRecord.completed = false;
    goalRecord.date_committed = Date();
    mock_goals.goals.push(goalRecord);
    console.log(mock_goals.goals);
    var goalHtml = "<h2 class='text-center'>Today's priority:</h2>";
    goalHtml += "<h1 class='text-center'>" + $("#goal-text").val();
    goalHtml += "&nbsp;&nbsp;<span id='delete-goal-button' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-mark' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-mark' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
    goalHtml += "</h1>";
    $("#homepage-goal-display").html(goalHtml);

  });

  $(document).on("click", "#goal-completion-mark", function() {
    var goalHtml = "<h2>Today's priority:</h2>";
    goalHtml += "<h1>" + $("#goal-text").val();
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-mark' class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-mark' class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-mark' class='glyphicon glyphicon-delete' aria-hidden='true'></span>";
    goalHtml += "</h1>";
    $("#homepage-goal-display").html(goalHtml);
  });

  $(document).on("click", "#delete-goal-button", function(){
    $("#homepage-goal-display").html("<p></p>");
  });

});