/**
 * Controller for edit meeting page
 */

meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService) {

    /**
     * index for day in being handled
     */
    $scope.id = $routeParams.meetingId;
    $scope.loading = true;

    $scope.parkedActivities = MeetingService.parkedActivities;
    $scope.bin = [];
    
    MeetingService.load(currentAuth.uid);

    //When data from firebase is loaded initialize the variables
    MeetingService.days.$loaded().then(function () {
        $scope.day = MeetingService.getDay($scope.id);

        $scope.date = new Date();
        $scope.date.setHours(Math.floor($scope.day.getStart() / 60));
        $scope.date.setMinutes($scope.day.getStart() % 60);
        $scope.date.setSeconds(0);
        $scope.date.setMilliseconds(0); 

        $scope.loading = false;
    });

    //Called on drop
    $scope.dropCallback = function (event, ui) {
        $scope.save();
    };

    //Save changes made to database
    $scope.save = function () {
        MeetingService.save($scope.day, $scope.id);
    };

    //Add new activity to parkedActivities
    $scope.addActivity = function () {
        
        MeetingService.addActivity(new Activity("Cellar party 1", 20, 1, "Help me"));
        MeetingService.addActivity(new Activity("Cellar party 2", 20, 2, "Help me"));
        MeetingService.addActivity(new Activity("Cellar party 3", 20, 3, "Help me"));


        //MeetingService.addDay (null, null, currentAuth.uid);

        /*
         $scope.day = MeetingService.getDay($scope.id);
         $scope.day.setTitle("Meeting in dungeon");
         $scope.day.setDate("today");
         $scope.day.setDescription ("He he he");
         $scope.day.setImportant (true);
         $scope.day.setType (1);
         $scope.save();
         MeetingService.addActivity(new Activity("Coffee break 1", 20, 1, "Help me! They got me locked in the cellar"), 0);
         MeetingService.addActivity(new Activity("Coffee break 2", 20, 2, "They ate my foot. lol what can you do."), 0);
         MeetingService.addActivity(new Activity("Coffee break 3", 20, 3, "Ahhhhhhhhhhhhhhhhhhhhhhhhhhh...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), 0);
         */
    };

    $scope.setStart = function (timestamp) {
        var startH = timestamp.getHours();
        var startM = timestamp.getMinutes();

        $scope.day.setStart(startH, startM);
        $scope.save();
    };

    //Retrieve activity type 
    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };

    $scope.formatTime = function (totalMin) {
        var hours = Math.floor(totalMin / 60);
        var mins = totalMin % 60;

        if (hours < 10)
            hours = "0" + hours;

        if (mins < 10)
            mins = "0" + mins;

        return hours + ":" + mins;
    };

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
});