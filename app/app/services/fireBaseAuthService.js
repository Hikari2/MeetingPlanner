
meetingAgendaBuilder.factory("FireBaseAuthService", ["$firebaseAuth", "FireBaseURL",
    function ($firebaseAuth, FireBaseURL) {
        var ref = new Firebase(FireBaseURL);
        return $firebaseAuth(ref);
    }
]);