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

  $(document).on("submit", "#set-goal", function(e) {
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
    var goalHtml = "<h2 class='text-center'>Today's priority: " + goal + "</h2>";
    goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
    goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
    goalHtml += "</h1>";
    $("#set-goal").html(" ");
    $("#homepage-goal-display").html(goalHtml);
  });

  $(document).on("click", "#edit-goal-glyphicon", function() {
    var goalToEdit = mock_goals.goals[mock_goals.goals.length - 1].goal;
    var editHtml = "<h2 class='text-center'>Today's priority: </h2>"; 
    editHtml += "<div class='row'>";
    editHtml += "<div class='col-sm-6 col-sm-offset-3'>";
    editHtml += "<form id='edited-goal'>";
    editHtml += "<input type='text' class='form-control input-lg' id='edited-goal-text' value=" + "'" + goalToEdit + "'" + " required>";
    editHtml += "</form>";
    editHtml += "</div>";
    editHtml += "</div>";   
    $("#homepage-goal-display").html(editHtml);
  });

  $(document).on("submit", "#edited-goal", function(e) {
    e.preventDefault();
    console.log("edit");
    var goal = $("#edited-goal-text").val();
    console.log("goal:" + goal)
    mock_goals.goals[mock_goals.goals.length - 1].goal = goal;
    console.log(mock_goals.goals);
    var goalHtml = "<h2 class='text-center'>Today's priority: " + goal + "</h2>";
    goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
    goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
    goalHtml += "</h1>";
    $("#homepage-goal-display").html(goalHtml);
  });


  $(document).on("click", "#goal-completion-glyphicon", function() {
    var goalHtml = "<h2>Today's priority:</h2>";
    goalHtml += "<h1>" + $("#goal-text").val();
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-remove' aria-hidden='true'></span>";
    goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-delete' aria-hidden='true'></span>";
    goalHtml += "</h1>";
    $("#homepage-goal-display").html(goalHtml);
  });

  $(document).on("click", "#delete-goal-glyphicon", function(){
    var setGoal = "<form id='set-goal' role='form'>";
    setGoal += "<div class='row'>";
    setGoal += "<div class='col-sm-8 col-sm-offset-2'>"
    setGoal += "<div class='input-group input-group-lg'>";
    setGoal += "<input type='text' class='form-control' id='goal-text' placeholder='Enter your most important goal for the day.' required>";
    setGoal += "<div class='input-group-btn'>"; 
    setGoal += "<button class='btn btn-primary' type='submit'>Submit</button>";
    setGoal += "</div>";
    setGoal += "</div>";
    setGoal += "</div>";
    setGoal += "</div>";
    setGoal += "</form>";
    $("#goal-submission-form").html(setGoal);
    $("#homepage-goal-display").html("<p></p>");
  });

});



