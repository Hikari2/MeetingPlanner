var meetingAgendaBuilder = angular.module('agendaBuilder', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ngDragDrop', "firebase", 'ui.bootstrap']);

meetingAgendaBuilder.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'layout/home.html',
            controller: 'AuthenticationCtrl'
        }).when('/login', {
            templateUrl: 'authentication/login.html',
            controller: 'AuthenticationCtrl'
        }).when('/register', {
            templateUrl: 'authentication/register.html',
            controller: 'AuthenticationCtrl'
        }).when('/userpage', {
            templateUrl: 'dashboard/userpage.html',
            controller: 'UserPageCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        }).when('/userpage/settings', {
            templateUrl: 'dashboard/settings/usersettings.html',
            controller: 'UserSettingsCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        })
            ///
            .when('/userpage/settings/uploadProfilePic', {
            templateUrl: 'dashboard/settings/uploadProfilePic.html',
            controller: 'UserSettingsCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        })
        //     .when('/userpage/restAPI', {
        //     templateUrl: 'dashboard/restAPI.html',
        //     controller: 'UserSettingsCtrl',
        //     resolve: {
        //         "currentAuth": ["AuthenticationService", function (AuthenticationService) {
        //             return AuthenticationService.requireAuth();
        //         }]
        //     }
        // })
            .when('/editMeeting/:meetingId', {
            templateUrl: 'meetings/editing/editMeeting.html',
            controller: 'EditMeetingCtrl',
            resolve: {
                "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                    return AuthenticationService.requireAuth();
                }]
            }
        }).when('/spectateMeeting/:meetingId', {
            templateUrl: 'meetings/spectate/spectateMeeting.html',
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
