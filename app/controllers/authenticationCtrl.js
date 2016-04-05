
meetingAgendaBuilder.controller('AuthenticationCtrl', function ($scope, $location, AuthenticationService) {
    var rootDir="url(./resources/front-page";
    var tail=".jpg)";
    var img=new Array("1","2","3");
    var currentImg=0;
    $scope.authentication = AuthenticationService.isLoggedIn();
    $scope.email = null;
    $scope.password = null;
    $scope.status = null;

    $scope.login = function () {
        $scope.authData = null;
        $scope.error = null;

        AuthenticationService.login({
            email: $scope.email,
            password: $scope.password
        }).then(function (authData) {
            $location.path("/userpage");
        }).catch(function (error) {
            if (error.code == "INVALID_EMAIL") {
                $scope.status = "The    specified user account email is invalid.";
            }
            else if (error.code == "INVALID_PASSWORD") {
                $scope.status = "The specified user account password is incorrect.";
            }
            else if (error.code == "INVALID_USER") {
                $scope.status = "The specified user account does not exist.";
            }
            else {
                $scope.status = "Something went wrong";
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
            }
            else if (error.code == "INVALID_EMAIL") {
                $scope.status = "The specified email is not a valid email.";
            }
            else {
                $scope.status = "Something went wrong";
            }
        });
    }
    
    $scope.onPrevious = function(){
        currentImg=(currentImg+1)%img.length;
        var dir=rootDir+img[currentImg]+tail;
        document.getElementById("home-section").style.backgroundImage=dir;
    }
    
    $scope.onNext  = function(){
        currentImg=(currentImg+2)%img.length;
        var dir=rootDir+img[currentImg]+tail;
        document.getElementById("home-section").style.backgroundImage=dir;
    }
});
