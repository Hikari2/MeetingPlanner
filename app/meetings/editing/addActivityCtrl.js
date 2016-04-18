
meetingAgendaBuilder.controller('AddActivityCtrl', function ($scope, $uibModalInstance) {
    $scope.name;
    $scope.length;
    $scope.type;
    $scope.Description;

    $scope.ok = function () {
        $uibModalInstance.close(new Activity($scope.name, $scope.length, $scope.type, $scope.Description));
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});