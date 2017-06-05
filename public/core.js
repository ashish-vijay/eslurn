var eTodo = angular.module('eTodo', []);

var totaltodo;
var completedtodo = 0;
var bdate ="";
function mainController($scope, $http) {
    $scope.formData = {};
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            totaltodo = data.length;
            $scope.ttodo = totaltodo;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                totaltodo = totaltodo + 1;
                $scope.ttodo = totaltodo;
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
        var bmonth = time.getMonth();
        var bdate = bday + '/' + bmonth;
        console.log(bdate);
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
          labels: [bdate],
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
    setInterval(chart,10000);
}
