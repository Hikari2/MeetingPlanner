
meetingAgendaBuilder.factory('UserService', function ($firebaseObject, $firebaseArray, FireBaseDataService) {

    this.createUserProfile = function (authData, email) {

        var users = $firebaseArray(FireBaseDataService.users.child(authData.uid));

        users.$loaded().then(function () {
            if (users.length === 0) {
                var newUser = new User();
                newUser.setEmail(email);
                users.$add(newUser.toJson());
            }
        });
    };

    return this;
});
