
meetingAgendaBuilder.factory("FireBaseDataService", ["$firebaseArray", "FireBaseURL",
    function ($firebaseArray, FireBaseURL) {
        var ref = new Firebase(FireBaseURL);
        return $firebaseArray(ref);
    }
]);