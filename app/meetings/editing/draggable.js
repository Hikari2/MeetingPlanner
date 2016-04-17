meetingAgendaBuilder.directive('draggable', function () {
    return function (scope, element) {

        var el = element[0];

        el.draggable = true;

        el.addEventListener("dragstart", function (e) {
            
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("position", scope.$index);
            e.dataTransfer.setData("item", this.parentElement.classList[0]);
            e.dataTransfer.setData("uid", scope.user.$id);

            this.classList.add("drag");
            return false;
        });

        el.addEventListener("dragend", function (e) {
            this.classList.remove("drag");
            return false;
        });
    };
});