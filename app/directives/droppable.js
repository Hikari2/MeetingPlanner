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
                this.classList.remove('dragHover');
                if (e.stopPropagation)
                    e.stopPropagation();

                this.classList.remove('over');

                var oldPosition = e.dataTransfer.getData('position');
                var newPosition = scope.index;

                var draggedItem = e.dataTransfer.getData('item');
                var targetItem = this.parentElement.classList[0];

                scope.$apply(function (scope) {
                    var fn = scope.drop();
                    if ('undefined' !== typeof fn && '' !== draggedItem) {
                        if (targetItem === "participant") {
                            if (draggedItem === "user")
                                fn(1, oldPosition, 2, newPosition, e.dataTransfer.getData('uid'));
                            else if (draggedItem === "participant")
                                fn(2, oldPosition, 2, newPosition);
                            return false;
                        }

                        if (draggedItem === "participant") {
                            if (targetItem === "bin")
                                fn(2, oldPosition, -1, newPosition);
                            return false;
                        }

                        if (draggedItem === "user") {
                            return false;
                        }

                        if (draggedItem === "pendingActivity")
                            draggedItem = null;
                        else if (draggedItem === "addedActivity")
                            draggedItem = 0;

                        if (targetItem === "pendingActivity")
                            targetItem = null;
                        else if (targetItem === "addedActivity")
                            targetItem = 0;
                        else if (targetItem === "bin")
                            targetItem = -1;

                        fn(draggedItem, oldPosition, targetItem, newPosition);
                    }
                });
                return false;
            });

            el.addEventListener(
                    'dragenter',
                    function (e) {
                        this.classList.add('dragHover');
                        return false;
                    },
                    false
                    );

            el.addEventListener(
                    'dragleave',
                    function (e) {
                        this.classList.remove('dragHover');
                        return false;
                    },
                    false
                    );
        }
    };
});