var app = angular.module('ngArtwork', []);

app.controller('index', function($scope,$http) {

  $scope.details = true;
  $scope.colors = true;
  $scope.empty = true;

  $http.get('results/output-spotify-colors.json').success(function(data) {
   $scope.items = data;
});

});
