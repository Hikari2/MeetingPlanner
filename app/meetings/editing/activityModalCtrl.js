
meetingAgendaBuilder.controller('ActivityModalCtrl', function ($scope, $uibModalInstance, MeetingService, activity, day, position, queue) {

    $scope.activity = activity;

    if (activity !== null) {
        $scope.name = activity._name;
        $scope.length = activity._length;
        $scope.type = activity._typeid;
        $scope.Description = activity._description;
    }
    else {
        $scope.name;
        $scope.length;
        $scope.type;
        $scope.Description;
    }
    $scope.types = MeetingService.getActivityTypes();

    $scope.ok = function () {

        $scope.nameError = "";
        $scope.lengthError = "";
        $scope.typeError = "";
        $scope.descriptionError = "";

        var error = false;

        if ($scope.name === "" || $scope.name === undefined) {
            $scope.nameError = "Please enter a name";
            error = true;
        }

        if ($scope.length <= 0 || $scope.length === undefined) {
            $scope.lengthError = "Please enter a valid length";
            error = true;
        }

        if ($scope.type === undefined) {
            $scope.typeError = "Please choose a activity type";
            error = true;
        }

        if ($scope.Description === "" || $scope.Description === undefined) {
            $scope.descriptionError = "Please provide a description";
            error = true;
        }

        if (!error) {
            if (activity !== null) {
                if (queue !== null)
                    MeetingService.editActivity(new Activity($scope.name, $scope.length, $scope.type, $scope.Description), day, position);
                else
                    MeetingService.editActivity(new Activity($scope.name, $scope.length, $scope.type, $scope.Description), null, position);
            }
            else {
                MeetingService.addActivity(new Activity($scope.name, $scope.length, $scope.type, $scope.Description));
            }

            $uibModalInstance.close();
        }
        //$uibModalInstance.close(result[new Activity($scope.name, $scope.length, $scope.type, $scope.Description), activity, day, position]);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});