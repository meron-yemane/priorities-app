var mock_goal_completion_history = {
  "goal_completion_history": [
    {
      "id": "11111",
      "goal": "Complete 3 hours of Thinkful",
      "completed": true,
      "date_committed": 010217
    },
    {
      "id": "22222",
      "goal": "Take out trash",
      "completed": false,
      "date_committed": 010317
    },
    {
      "id": "3333",
      "goal": "Practice clarinet for 6 hours",
      "completed": true,
      "date_committed": 010417
    },
    {
      "id": "444444",
      "goal": "Complete 3 hours of Thinkful",
      "completed": true,
      "date_committed": 010517
    },
    {
      "id": "555555",
      "goal": "Complete 8 hours of Thinkful",
      "completed": false,
      "date_committed": 010617
    },
    {
      "id": "666666",
      "goal": "Walk dog",
      "completed": true,
      "date_committed": 010717
    },
    {
      "id": "7777777",
      "goal": "Get 10 girls numbers",
      "completed": true,
      "date_committed": 010817
    }
  ]
};

function getGoalPercentages(callbackFn) {
  setTimeout(function(){ callbackFn(mock_goal_completion_history)}, 100);
}


function displayGoalPercentages(data) {
  var completed = 0;
  for (goal=0; goal<data.goal_completion_history.length; goal++) {
    if (data.goal_completion_history[goal].completed) {
      completed++
    };
  };
  console.log(completed);
  var percentage = completed/data.goal_completion_history.length * 100;
  var html = "<h2> You've succedded in completing " + Math.round(percentage) + "% of your most important goals.</h2>";
  $("#progressStats").html(html);

}

function getAndDisplayGoalPercentages() {
  getGoalPercentages(displayGoalPercentages);
}

$(function() {
  getAndDisplayGoalPercentages();
});







