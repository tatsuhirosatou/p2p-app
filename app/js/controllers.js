'use strict';

/* Controllers */
var appControllers = angular.module('p2pControllers', ['ui.bootstrap']);

appControllers.controller('QuestionListCtrl', ['$scope', 'Question',
    function($scope, Question) {
        $scope.questions = Question.query();
        $scope.orderProp = 'age';
}]);

appControllers.controller('QuestionDetailCtrl', ['$scope', '$routeParams', 'Question',
    function($scope, $routeParams, Question) {
        $scope.question = Question.get({questionId: $routeParams.questionId}, function(question) {
        $scope.mainImageUrl = question.images[0];
    });
    $scope.setImage = function(imageUrl) {
        $scope.mainImageUrl = imageUrl;
    };
}]);

appControllers.controller('MyCtrl1', [function() {

}]);

appControllers.controller('MyCtrl2', [function() {

}]);
