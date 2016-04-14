
meetingAgendaBuilder.factory("FireBaseDataService", [
    function () {
        var root = new Firebase("https://meetingagendabuilder.firebaseio.com");

        var ref = {
            root: root,
            meetings: root.child("/meetings")
        };
        return ref;
    }
]);