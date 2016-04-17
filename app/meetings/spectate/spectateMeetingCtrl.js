
meetingAgendaBuilder.controller('SpectateMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService, UserService) {

    $scope.id = $routeParams.meetingId;
    $scope.loading = true;

    $scope.participants = [];

    /*
     * Load activity and participant from database
     */
    MeetingService.loadSharedMeetings(currentAuth.uid);

    MeetingService.sharedDays.$loaded().then(function () {

        MeetingService.loadSharedMeeting($scope.id);

        MeetingService.sharedDay.$loaded().then(function () {

            $scope.day = MeetingService.getDay($scope.id);

            if ($scope.day === null) {
                $scope.loading = false;
                $scope.status = "No meeting found, make sure you have the right id";
                return;
            }
                        
            UserService.load();
            UserService.users.$loaded().then(function () {
                $scope.users = UserService.users;
                $scope.participants = UserService.getProfiles($scope.day._participants);
                $scope.owner = UserService.getProfile($scope.day._uid);
            });

            $scope.date = new Date();
            $scope.date.setHours(Math.floor($scope.day.getStart() / 60));
            $scope.date.setMinutes($scope.day.getStart() % 60);
            $scope.date.setSeconds(0);
            $scope.date.setMilliseconds(0);

            $scope.loading = false;

        });
    });

    //Retrieve activity type 
    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };

    $scope.format = function (totalMin) {
        return formatTime(totalMin);
    };
});