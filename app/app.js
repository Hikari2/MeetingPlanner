var meetingAgendaBuilder = angular.module('agendaBuilder', ['ngRoute', 'ngResource', 'ngCookies', "firebase"]);

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
                        "currentAuth": ["FireBaseAuthService", function (FireBaseAuthService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return FireBaseAuthService.$requireAuth();
                            }]
                    }
                }).
                when('/editMeeting/:meetingId', {
                    templateUrl: 'views/editMeeting.html',
                    controller: 'EditMeetingCtrl',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        "currentAuth": ["FireBaseAuthService", function (FireBaseAuthService) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError
                                return FireBaseAuthService.$requireAuth();
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

meetingAgendaBuilder.constant("FireBaseURL", "https://meetingagendabuilder.firebaseio.com/");