
meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService) {
    $scope.user = currentAuth;
    var id = $routeParams.meetingId;

    $scope.startTime = MeetingService.days[id].getStart();
    $scope.dayLength = MeetingService.days[id].getTotalLength();



    $scope.addActivity = function () {
        MeetingService.addActivity();
    };

    $scope.getPendingActivities = function () {
        return MeetingService.parkedActivities;
    }

    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    }
});