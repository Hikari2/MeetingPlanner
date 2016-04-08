meetingAgendaBuilder.directive('droppable', function () {
    return {
        scope: {drop: '&', activityQueue: '='},
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener('dragover', function (e) {
                e.dataTransfer.dropEffect = 'move';

                if (e.preventDefault)
                    e.preventDefault();
                this.classList.add('over');
                return false;
            });

            el.addEventListener('drop', function (e) {
                if (e.stopPropagation)
                    e.stopPropagation();

                this.classList.remove('over');

                var oldPosition = e.dataTransfer.getData('position');
                var newPosition = this.id;

                var oldDay = e.dataTransfer.getData('day');
                var newDay = this.parentElement.id;

                scope.$apply(function (scope) {
                    var fn = scope.drop();
                    if ('undefined' !== typeof fn) {
                        //alert(oldDay + ", " + oldPosition + " > " +newDay + ", " + newPosition);
                        fn(oldDay, oldPosition, newDay, newPosition);
                    }
                });
                return false;
            });
        }
    }
});