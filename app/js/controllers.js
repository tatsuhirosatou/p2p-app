'use strict';

/* Controllers */
var appControllers = angular.module('p2pControllers', ['ui.bootstrap']);

appControllers.controller('QuestionListCtrl', ['$scope', 'Question',
    function($scope, Question) {
        $scope.questions = Question.query();
}]);

appControllers.controller('QuestionDetailCtrl', ['$location', '$scope', '$routeParams', 'Question', 'Auth', function($location, $scope, $routeParams, Question, Auth) {

        $scope.answer = {};

        $scope.question = Question.get({questionId: $routeParams.questionId}, function(question) {
            $scope.mainImageUrl = question.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };

        $scope.addAns = function() {
            console.log($scope.answer);
            $scope.question.answers.push({votes: 0,
                                          content: $scope.answer.answer,
                                          posted_epoch_time: (new Date).getTime(),
                                          author: Auth.retrieveCredentials()});


            Question.put({questionId: $routeParams.questionId},
                            {"answer":{
                                "content":$scope.answer.answer}});

            $scope.answerForm.$setPristine();
            var defaultForm = {
                answer: ""
            };
            $scope.answer = defaultForm;
        };

    }]);

appControllers.controller('QuestionAskCtrl', ['$scope', '$location', 'Question', function($scope, $location, Question){
    $scope.question = {};
    $scope.alerts = [];

    $scope.addAlert = function() {
        $scope.alerts.push({type: 'success', msg: "Question submitted!"});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.addQuestion = function () {
        Question.save({}, $scope.question);
        $scope.addAlert();
        $location.path("/profile");
    };

    $scope.goNext = function (hash) {
        $location.path(hash);
    };

    $scope.myPictures = [];
    $scope.$watch('myPicture', function(value) {
        if(value) {
            myPictures.push(value);
        }
    }, true);

}]);

appControllers.controller('RegisterCtrl', ['$scope', '$location', 'User', function($scope, $location, User){
    $scope.user = {};

    $scope.goNext = function (hash) {
        $location.path(hash);
    };

    $scope.addUser = function() {
        console.log($scope.user);
        User.save({}, $scope.user);
        $location.path("/login");
    };

}]);

appControllers.controller('LoginCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {

    $scope.user = {};
    $scope.alerts = [];

    $scope.authFailedAlert = function() {
        $scope.alerts.push({type: 'error', msg: "Wrong username or password."});
    };

    $scope.authSuccessAlert = function() {
        $scope.alerts.push({type: 'success', msg: "Logged in."});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.goNext = function (hash) {
        $location.path(hash);
    };

    $scope.login = function () {

        console.log($scope.user.username);

        var success = function(data, status, headers, config) {
            Auth.setCredentials($scope.user.username, $scope.user.password);
            $scope.authSuccessAlert();

            $location.path("/questions");
        };

        var error = function(data, status, headers, config) {
            $scope.authFailedAlert();
        };

        Auth.correctCredentials($scope.user.username, $scope.user.password, success, error);
    };

}]);

appControllers.controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'User', 'Auth', function($scope, $location, $routeParams, User, Auth) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };

        $scope.user = User.get({username:$routeParams.username});

        $scope.logout = function() {
            Auth.clearCredentials();
            $location.path("/login");
        };
    }]);

appControllers.controller('MyAnsCtrl', ['$scope', '$location', '$routeParams', 'ProfileAnswers', function($scope, $location, $routeParams, ProfileAnswers) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };
        $scope.answers = ProfileAnswers.pull();
    }]);

appControllers.controller('MyQnsCtrl', ['$scope', '$location', '$routeParams', 'ProfileQuestions', function($scope, $location, $routeParams, ProfileQuestions) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };
        $scope.questions = ProfileQuestions.pull();
    }]);

appControllers.controller('OtherAnsCtrl', ['$scope', '$location', '$routeParams', 'OtherAnswers', function($scope, $location, $routeParams, OtherAnswers) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };
        $scope.answers = OtherAnswers.getInfo({username:$routeParams.username});
    }]);

appControllers.controller('OtherQnsCtrl', ['$scope', '$location', '$routeParams', 'OtherQuestions', function($scope, $location, $routeParams, OtherQuestions) {

        $scope.goNext = function (hash) {
            $location.path(hash);
        };
        $scope.questions = OtherQuestions.getInfo({username:$routeParams.username});
    }]);
