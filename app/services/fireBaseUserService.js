
meetingAgendaBuilder.factory("FireBaseUserService", ["$firebaseObject", "firebaseUrl",
    function ($firebaseObject, firebaseUrl) {
        var ref = new Firebase(firebaseUrl+"/users");
        return $firebaseObject(ref);
    }
]);