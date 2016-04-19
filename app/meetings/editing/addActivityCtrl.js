
meetingAgendaBuilder.controller('AddActivityCtrl', function ($scope, $uibModalInstance, MeetingService) {

    $scope.name;
    $scope.length;

    $scope.types = MeetingService.getActivityTypes();
    $scope.type;

    $scope.Description;

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

        if (!error)
            $uibModalInstance.close(new Activity($scope.name, $scope.length, $scope.type, $scope.Description));
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});