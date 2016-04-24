/**
 * Created by Jiansun on 4/24/16.
 */

meetingAgendaBuilder.controller('UserSettingsCtrl', function ($scope, currentAuth, UserService) {

    $scope.newFirstName = null;
    $scope.newLastName = null;
    $scope.newGender = null;
    $scope.newBirthday = null;
    $scope.newAddress = null;
    $scope.newEmail = null;
    $scope.newPhone = null;
    $scope.newProfilePic = null;

    $scope.loading = true;
    // $scope.users = UserService.users;
    $scope.user = currentAuth;

    var userList = [];
    userList.push(currentAuth.uid);
    // var tempInfo = null;
    // $.scope.currentInfo = null;

    UserService.load();
    UserService.users.$loaded().then(function () {
        $scope.users = UserService.users;
        var tempInfo = UserService.getProfile(currentAuth.uid);
        console.log(tempInfo);
        $scope.currentInfo = tempInfo;
        console.log($scope.currentInfo);

        $scope.newFirstName = $scope.currentInfo._firstName;
        $scope.newLastName = $scope.currentInfo._lastName;
        $scope.newGender = $scope.currentInfo._gender;
        $scope.newBirthday = $scope.currentInfo._birthday;
        $scope.newAddress = $scope.currentInfo._address;
        $scope.newEmail = $scope.currentInfo._email;
        $scope.newPhone = $scope.currentInfo._phone;
        $scope.newProfilePic = $scope.currentInfo._profilePic;
    });

    $scope.saveProfile = function () {
        var newProfileInfo = {
            firstName: $scope.newFirstName,
            lastName: $scope.newLastName,
            gender: $scope.newGender,
            birthday: $scope.newBirthday,
            address: $scope.newAddress,
            email: $scope.newEmail,
            phone: $scope.newPhone,
            profilePic: $scope.newProfilePic
        };
        UserService.updateProfile(currentAuth, newProfileInfo)
    }
});