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
    let data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();
    $.ajax({
      url: "/users/login",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
       $("#login").hide();
       $.ajax({
        url: "priorities/today",
        type: "GET",
        dataType: "json"
       }).done(function(data, status) {
        if (status === "success") {
          var goal = data.goal;
          var goalHtml = "<h2 class='text-center'>Today's priority: " + goal + "</h2>";
          goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
          goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
          goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
          goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
          goalHtml += "</h1>";
          $("#goal-text").val("");
          $("#set-goal").html(" ");
          $("#homepage-goal-display").show();
          $("#homepage-goal-display").html(goalHtml);
        }
        $("#homepage").show();
       }).fail(function(err) {
        console.log(err.responseText);
       })
    }).fail(function(err) {
      console.log(err.responseText);
    }) 
  });

  $("#signup-form").submit(function(e) {
    e.preventDefault();
    let data = {};
    data.username = $("#new-username").val();
    data.password = $("#new-password").val();
    data.firstName = $("#firstName").val();
    data.lastName = $("#lastName").val();
    $.ajax({
      url: "/users",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
      console.log(data);
      $("#signup").hide();
      $("#homepage").show();   
    }).fail(function(err) {
      console.log(err.responseText);
    })   
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
    let data = {};
    data.goal = goal;
    data.completed = false;
    $.ajax({
      url: "/priorities/create",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
      console.log(data);
      //todaysPriorityId = data.id;
      var goalHtml = "<h2 class='text-center'>Today's priority: " + goal + "</h2>";
      goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
      goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
      goalHtml += "</h1>";
      $("#goal-text").val("");
      $("#set-goal").html(" ");
      $("#homepage-goal-display").html(goalHtml);
    }).fail(function(err) {
      console.log(err);
    })
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
    var goal = $("#edited-goal-text").val();
    data = {};
    data.goal = goal;
    $.ajax({
      url:"priorities/" + todaysPriorityId,
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: "json"
    }).done(function(data, status) {
      console.log(data);
      var goalHtml = "<h2 class='text-center'>Today's priority: " + goal + "</h2>";
      goalHtml += "<h1 class='text-center'>" //+ $("#goal-text").val();
      goalHtml += "&nbsp;&nbsp;<span id='delete-goal-glyphicon' class='glyphicon glyphicon-remove' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='goal-completion-glyphicon' class='glyphicon glyphicon-ok' role='button' aria-hidden='true'></span>";
      goalHtml += "&nbsp;&nbsp;<span id='edit-goal-glyphicon' class='glyphicon glyphicon-pencil' role='button' aria-hidden='true'></span>";
      goalHtml += "</h1>";
      $("#homepage-goal-display").html(goalHtml);
    }).fail(function(err) {
      console.log(err);
    });
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



