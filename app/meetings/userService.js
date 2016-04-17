
meetingAgendaBuilder.factory('UserService', function ($firebaseArray, $firebaseObject, $firebaseArray, FireBaseDataService) {

    this.load = function () {
        this.users = $firebaseArray(FireBaseDataService.users);
    };

    this.getAllUsers = function () {
        var users = [];

        $.each(this.users, function (index, user) {
            users.push(User.fromJson(user));
        });
        return users;
    };

    this.getProfiles = function (id) {
        var users = [];
        for (var i = 0; i < id.length; i++) {
            for (var j = 0; j < this.users.length; j++) {
                if (id[i] === this.users[j].$id) {
                    users[i] = User.fromJson(this.users[j]);
                    continue;
                }
            }
        }
        return users;
    };

    this.getProfile = function (id) {

        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].$id === id) {
                return User.fromJson(this.users[i]);
            }
        }
    };

    this.createUserProfile = function (authData, email) {

        var user = $firebaseObject(FireBaseDataService.users.child(authData.uid));

        user.$loaded().then(function () {
            if (user.email === undefined) {
                var newUser = new User().toJson();
                user.firstName = newUser.firstName;
                user.lastName = newUser.lastName;
                user.gender = newUser.gender;
                user.birthday = newUser.birthday;
                user.address = newUser.address;
                user.email = email;
                user.phone = newUser.phone;
                user.profilePic = newUser.profilePic;
                user.$save().catch(function (error) {
                    alert("Something went wrong when trying to create a new profile: " + error);
                });
            }
        });
    };

    this.updateProfile = function (authData, user) {

        var user = $firebaseObject(FireBaseDataService.users.child(authData.uid));

        user.$loaded().then(function () {
            newProfile = newProfile.toJson();
            user.firstName = newProfile.firstName;
            user.lastName = newProfile.lastName;
            user.gender = newProfile.gender;
            user.birthday = newProfile.birthday;
            user.address = newProfile.address;
            user.email = newProfile.email;
            user.phone = newProfile.phone;
            user.profilePic = newProfile.profilePic;
            user.$save();
        });
    };

    return this;
});
