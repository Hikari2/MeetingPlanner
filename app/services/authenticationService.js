
meetingAgendaBuilder.factory('AuthenticationService', function (FireBaseAuthService) {

    this.login = function (user) {
        return FireBaseAuthService.$authWithPassword(user);
    }

    this.logout = function () {
        FireBaseAuthService.$unauth();
    }

    this.register = function (user) {
        return FireBaseAuthService.$createUser(user);
    }

    this.isLoggedIn = function () {
        return FireBaseAuthService.$getAuth();
    }

    return this;
})
