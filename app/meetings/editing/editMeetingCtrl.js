/**
 * Controller for edit meeting page
 */

meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService, UserService) {

    $scope.id = $routeParams.meetingId;
    $scope.loading = true;

    $scope.parkedActivities = MeetingService.parkedActivities;
    $scope.participants = [];

    /*
     * Load activity and participant from database
     */
    MeetingService.load(currentAuth.uid);

    MeetingService.days.$loaded().then(function () {
        $scope.day = MeetingService.getDay($scope.id);

        UserService.loadUsers();
        UserService.users.$loaded().then(function () {
            $scope.users = UserService.users;

            $scope.participants = UserService.getAllParticipants($scope.day._participants);

            $scope.date = new Date();
            $scope.date.setHours(Math.floor($scope.day.getStart() / 60));
            $scope.date.setMinutes($scope.day.getStart() % 60);
            $scope.date.setSeconds(0);
            $scope.date.setMilliseconds(0);

            $scope.loading = false;
        });
    });

    $scope.dropCallback = function (draggedItem, oldPosition, targetItem, newPosition, uid) {

        //Dropped in bin
        if (targetItem === -1) {
            if (draggedItem === null) {
                MeetingService.removeParkedActivity(oldPosition);
                return;
            }
            if (draggedItem === 0) {
                MeetingService.removeActivity($scope.day, oldPosition);
                return;
            }
            if (draggedItem === 2) {
                MeetingService.removeParticipant($scope.day, oldPosition);
                $scope.participants = UserService.getAllParticipants($scope.day._participants);
                return;
            }
        }

        if (draggedItem === 2 && draggedItem === targetItem) {
            MeetingService.moveParticipant($scope.day, oldPosition, $scope.day, newPosition);
            $scope.participants = UserService.getAllParticipants($scope.day._participants);
            return;
        }
        else if (draggedItem === 1 && targetItem === 2) {
            MeetingService.addParticipant($scope.day, uid, newPosition);
            $scope.participants = UserService.getAllParticipants($scope.day._participants);
            return;
        }

        var oldDay = null;
        if (draggedItem === 0)
            oldDay = $scope.day;

        var newDay = null;
        if (targetItem === 0)
            newDay = $scope.day;

        MeetingService.moveActivity(oldDay, oldPosition, newDay, newPosition);
    };

    //Add new activity to parkedActivities
    $scope.addActivity = function () {

        MeetingService.addActivity(new Activity("Cellar party 1", 20, 1, "Help me"));
        MeetingService.addActivity(new Activity("Cellar party 2", 20, 2, "Help me"));
        MeetingService.addActivity(new Activity("Cellar party 3", 20, 3, "Help me"));


        //MeetingService.addDay(null, null, currentAuth.uid);
        /*
         $scope.user = new User();
         $scope.user.setFirstName("Hikari");
         $scope.user.setLastName("Watanabe");
         $scope.user.setGender("Male");
         $scope.user.setBirthDay("1990 08 14");
         $scope.user.setAddress("Trollesundsvägen");
         $scope.user.setEmail("fake@kth.se");
         $scope.user.setPhone("123 4567 9012");
         $scope.user.setPhone("123 4567 9012");
         $scope.user.setProfilePic("http://i.imgur.com/liMVH6g.png");
         UserService.updateProfile(currentAuth, $scope.user);
         
         $scope.day = MeetingService.getDay($scope.id);
         $scope.day.setTitle("Meeting in dungeon");
         $scope.day.setDate("today");
         $scope.day.setDescription("He he he");
         $scope.day.setImportant(true);
         $scope.day.setType(1);
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
        MeetingService.save($scope.day);
    };

    //Retrieve activity type 
    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };

    $scope.format = function (totalMin) {
        return formatTime(totalMin);
    };

    $scope.enlarge = function () {
        enlarge();
    };

    $scope.normalize = function () {
        normalize();
    };

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.searchTerm = "";
    $scope.searchFilter = {$: undefined};

    $scope.setFilter = function () {
        $scope.searchFilter = {};
        $scope.userFilter[$scope.selectedPropertyOption || '$'] = $scope.searchTerm;
    };
});