var eTodo = angular.module('eTodo', []);

var totaltodo;
var completedtodo = 0;
function mainController($scope, $http) {
    $scope.formData = {};
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            totaltodo = data.length;
            $scope.ttodo = totaltodo;
            console.log(data);
            console.log(totaltodo + 'totaltodo');
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
                console.log(totaltodo + 'totaltodo');
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
                console.log(completedtodo + 'completedtodo');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}
