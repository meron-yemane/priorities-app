var mock_goals = {
  "goals": [
    {
      "id": 1,
      "goal": "Complete 3 hours of Thinkful",
      "completed": true,
      "date_committed": 010217
    },
    {
      "id": 2,
      "goal": "Take out trash",
      "completed": false,
      "date_committed": 010317
    },
    {
      "id": 3,
      "goal": "Practice clarinet for 6 hours",
      "completed": true,
      "date_committed": 010417
    },
    {
      "id": 4,
      "goal": "Complete 3 hours of Thinkful",
      "completed": true,
      "date_committed": 010517
    },
    {
      "id": 5,
      "goal": "Complete 8 hours of Thinkful",
      "completed": false,
      "date_committed": 010617
    },
    {
      "id": 6,
      "goal": "Walk dog",
      "completed": true,
      "date_committed": 010717
    },
    {
      "id": 7,
      "goal": "Get 10 girls numbers",
      "completed": true,
      "date_committed": 010817
    }
  ]
};
console.log("length =" + mock_goals.goals.length);

function getGoalPercentages(callbackFn) {
  setTimeout(function(){ callbackFn(mock_goals)}, 100);
}


function displayGoalPercentages(data) {
  var completed = 0;
  for (goal=0; goal<data.goals.length; goal++) {
    if (data.goals[goal].completed) {
      completed++
    };
  };
  var percentage = completed/data.goals.length * 100;
  var html = "<h2> You've succeeded in completing " + Math.round(percentage) + "% of your most important goals.</h2>";
  $("#progressStats").html(html);
  $(document).ready(function() {
  var ctx = document.getElementById('myChart').getContext('2d');
  //ctx.width = 30;
  //ctx.height = 30;
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
      labels: ["Completed Priorities", "Incompleted Priorities"],
      datasets: [{
        label: "Priority Performance",
        backgroundColor: [
        'rgba(76, 174, 86, 1)',
        'rgba(196, 69, 75, 1)'
        ],
        borderColor: [
        'rgba(76, 174, 86, 1)',
        'rgba(196, 69, 75, 1)'
        ],
        data: [percentage, 100-percentage],
      }]
    },

    // Configuration options go here
    options: {
      responsive: false,
      maintainAspectRatio: true
    }
    });
  });


}

function getAndDisplayGoalPercentages() {
  getGoalPercentages(displayGoalPercentages);
}

$(function() {
  getAndDisplayGoalPercentages();
});







