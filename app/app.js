var meetingAgendaBuilder = angular.module('agendaBuilder', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', "firebase", 'ui.bootstrap']);

meetingAgendaBuilder.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'AuthenticationCtrl'
        }).when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AuthenticationCtrl'
        }).when('/register', {
            templateUrl: 'views/register.html',
            controller: 'AuthenticationCtrl'
        }).when('/userpage', {
            templateUrl: 'views/userpage.html',
            controller: 'UserPageCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        }).when('/userpage/settings', {
            templateUrl: 'views/usersettings.html',
            controller: 'UserSettingsCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        })
            ///
            .when('/userpage/settings/upLoadURL', {
            templateUrl: 'views/upLoadURL.html',
            controller: 'UserSettingsCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        })
            .when('/editMeeting/:meetingId', {
            templateUrl: 'views/editMeeting.html',
            controller: 'EditMeetingCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        }).when('/spectateMeeting/:meetingId', {
            templateUrl: 'views/spectateMeeting.html',
            controller: 'SpectateMeetingCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        }).otherwise({
            redirectTo: '/home'
        });
    }]);

meetingAgendaBuilder.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/home");
        }
    });
}]);
