
meetingAgendaBuilder.controller('AuthenticationCtrl', function ($scope, $location, AuthenticationService, UserService) {
    $scope.authentication = AuthenticationService.isLoggedIn();
    $scope.email = null;
    $scope.password = null;
    $scope.status = null;

    $scope.login = function () {
        $scope.authData = null;

        AuthenticationService.login({
            email: $scope.email,
            password: $scope.password
        }).then(function (authData) {
            UserService.createUserProfile(authData, $scope.email);
            $location.path("/userpage");
        }).catch(function (error) {
            if (error.code == "INVALID_EMAIL") {
                $scope.status = "The    specified user account email is invalid.";
                document.getElementById("buttonreplacement").style.display = "none";
            }
            else if (error.code == "INVALID_PASSWORD") {
                $scope.status = "The specified user account password is incorrect.";
                document.getElementById("buttonreplacement").style.display = "none";
            }
            else if (error.code == "INVALID_USER") {
                $scope.status = "The specified user account does not exist.";
                document.getElementById("buttonreplacement").style.display = "none";
            }
            else {
                $scope.status = "Something went wrong";
                document.getElementById("buttonreplacement").style.display = "none";
            }
        });
    }

    $scope.logout = function () {
        AuthenticationService.logout();
        $location.path("/user");
    }

    $scope.register = function () {

        AuthenticationService.register({
            email: $scope.email,
            password: $scope.password
        }).then(function (authData) {
            $scope.login();
        }).catch(function (error) {
            if (error.code == "EMAIL_TAKEN") {
                $scope.status = "The new user account cannot be created because the email is already in use.";
                document.getElementById("buttonreplacement").style.display = "none";
            }
            else if (error.code == "INVALID_EMAIL") {
                $scope.status = "The specified email is not a valid email.";
                document.getElementById("buttonreplacement").style.display = "none";
            }
            else {
                $scope.status = "Something went wrong";
                document.getElementById("buttonreplacement").style.display = "none";
            }
        });
    }
});
