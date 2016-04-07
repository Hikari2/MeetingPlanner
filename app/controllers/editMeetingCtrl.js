
meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService) {
    $scope.user = currentAuth;
    var id = $routeParams.meetingId;
    $scope.day = MeetingService.days[id];

    $scope.startTime = MeetingService.days[id].getStart();
    $scope.endTime = MeetingService.days[id].getEnd();
    $scope.dayLength = MeetingService.days[id].getTotalLength();

    $scope.setStart = function (timestamp) {
        var startH = timestamp.getHours();
        var startM = timestamp.getMinutes();

        $scope.day.setStart(startH, startM);
        $scope.endTime = $scope.day.getEnd();
    };

    $scope.addActivity = function () {
        MeetingService.addActivity();
    };

    $scope.getActivities = function () {
        return $scope.day.getActivities();
    };

    $scope.getActivityStart = function (index) {
        return $scope.day.getActivityStart(index);
    };

    $scope.getPendingActivities = function () {
        return MeetingService.parkedActivities;
    }

    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    }
});