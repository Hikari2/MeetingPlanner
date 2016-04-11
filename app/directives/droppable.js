meetingAgendaBuilder.directive('droppable', function () {
    return {
        scope: {drop: '&', index: '='},
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
                var newPosition = scope.index;

                var oldQueue = e.dataTransfer.getData('queue');
                var newQueue = this.parentElement.classList[0];

                scope.$apply(function (scope) {
                    var fn = scope.drop();
                    if ('undefined' !== typeof fn) {
                        //alert(oldDay + ", " + oldPosition + " > " +newDay + ", " + newPosition);
                        if (el.id == "bin")
                            fn(oldQueue, oldPosition);
                        else
                            fn(oldQueue, oldPosition, newQueue, newPosition);
                    }
                });
                return false;
            });
        }
    }
});