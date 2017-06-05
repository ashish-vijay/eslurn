var eTodo = angular.module('eTodo', []);

var totaltodo;
var completedtodo;
var bdate ="";
var tObj = {};
var cObj = {};
var newDate = new Date();
var newDay = newDate.getDate();
var newMonth = newDate.getMonth() + 1;
var newYear = newDate.getFullYear();
var todaydate = newDay + '/' + newMonth + '/' + newYear;
var datearray = [todaydate];
var dateset = function(todaydate){
  dlength = datearray.length;
  if((datearray[dlength - 1]) == todaydate){
     console.log(true);
  }
  else
    console.log(false);
};
dateset(datearray);
function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $http.get('/api/chartt')
      .success(function(data) {
        totaltodo = data.ttodo;
      })
      .error(function(data) {
        console.log('Error in /GET /api/chart' + data);
      });

      $http.get('/api/chartc')
        .success(function(data) {
          completedtodo = data.ctodo;
        })
        .error(function(data) {
          console.log('Error in /GET /api/chart' + data);
        });

    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                totaltodo = totaltodo + 1;
                $scope.ttodo = totaltodo;
                tObj = {
                  ttodo: totaltodo
                };
                $http.post('/api/chart', tObj)
                  .success(function(tObj) {
                  console.log(tObj);
                  chart();
                  })
                  .error(function(data) {
                    console.log('Error in ttodo post' + data);
                  });
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                completedtodo = completedtodo + 1;
                $scope.ctodo = completedtodo;
                cObj = {
                  ctodo: completedtodo
                };
                $http.post('/api/chart', cObj)
                  .success(function(data) {
                    console.log(data);
                    chart();
                  })
                  .error(function(data) {
                    console.log('Error in ctodo post' + data);
                  });
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    var notify = function() {
        Notification.requestPermission().then(function(result) {
        var time = new Date();
        var bhours = (time.getHours()<10?'0':'') + time.getHours();
        var bminutes = (time.getMinutes()<10?'0':'') + time.getMinutes()
        var bday = time.getDate();
        var bmonth = time.getMonth() + 1;
        var bdate = bday + '/' + bmonth;
        var btime = bhours + ':' + bminutes;
        $http.get('/api/todos')
            .success(function(data) {
                for(var i = 0; i < data.length; i++){
                  if(btime === data[i].time){
                      var notification = new Notification(data[i].text);
                  }
                }
            })
            .error(function(data) {
                console.log(data + 'notify error');
            });
      }).catch((err) => {
        console.log('Rejected for notification');
      });
    };
    setInterval(notify, 30000);

    var chart = function() {
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: datearray,
          datasets: [{
              label: "To-do Done",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [completedtodo],
          },
          {
              label: "To-do Undone",
              backgroundColor: 'rgb(0,191,255)',
              borderColor: 'rgb(0,191,255)',
              data: [totaltodo - completedtodo],
          }
        ]
      },

      // Configuration options go here
      options: {
        title:{
                        display:true,
                        text:"Statistics of this to-do app"
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false
                        },
                        responsive: true,
                        scales: {
                            xAxes: [{
                                stacked: true,
                            }],
                            yAxes: [{
                                stacked: true
                            }]
                    }
      }
    });
    };
  setTimeout(chart, 5000);
}
