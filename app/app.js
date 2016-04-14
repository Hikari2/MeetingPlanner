var meetingAgendaBuilder = angular.module('agendaBuilder', ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ngDragDrop', "firebase", 'ui.bootstrap']);

meetingAgendaBuilder.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/home', {
                    templateUrl: 'views/home.html',
                    controller: 'AuthenticationCtrl'
                }).
                when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'AuthenticationCtrl'
                }).
                when('/register', {
                    templateUrl: 'views/register.html',
                    controller: 'AuthenticationCtrl'
                }).
                when('/userpage', {
                    templateUrl: 'views/userpage.html',
                    controller: 'UserPageCtrl',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return AuthenticationService.requireAuth();
                            }]
                    }
                }).
                when('/userpage/settings', {
                    templateUrl: 'views/usersettings.html',
                    controller: 'UserPageCtrl',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return AuthenticationService.requireAuth();
                            }]
                    }
                }).
                when('/userpage/messages', {
                    templateUrl: 'views/usermessages.html',
                    controller: 'UserPageCtrl',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return AuthenticationService.requireAuth();
                            }]
                    }
                }).
                when('/userpage/history', {
                    templateUrl: 'views/userhistory.html',
                    controller: 'UserPageCtrl',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return AuthenticationService.requireAuth();
                            }]
                    }
                }).
                when('/editMeeting/:meetingId', {
                    templateUrl: 'views/editMeeting.html',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        "currentAuth": ["AuthenticationService", function (AuthenticationService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return AuthenticationService.requireAuth();
                            }]
                    }
                }).
                otherwise({
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
