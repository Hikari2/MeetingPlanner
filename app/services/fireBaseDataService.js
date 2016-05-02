
meetingAgendaBuilder.factory("FireBaseDataService", [
    function () {
        var root = new Firebase("https://meetingagendabuilder.firebaseio.com/");

        var ref = {
            root: root,
            meetings: root.child("meetings"),
            users: root.child("users"),
            shared: root.child("shared")
        };
        return ref;
    }
]);