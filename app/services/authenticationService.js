
meetingAgendaBuilder.factory('AuthenticationService', function ($firebaseAuth, FireBaseDataService) {

    var authObject = $firebaseAuth(FireBaseDataService.root);

    this.login = function (user) {
        return authObject.$authWithPassword(user);
    }

    this.logout = function () {
        authObject.$unauth();
    }

    this.register = function (user) {
        return authObject.$createUser(user);
    }

    this.isLoggedIn = function () {
        return authObject.$getAuth();
    }
    
    this.requireAuth = function () {
        return authObject.$requireAuth();
    }

    return this;
})
