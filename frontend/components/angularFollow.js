(function () {

angular.module('angular-follow', [])
    .directive('angularFollow', ['$window', function ($window) {
        return {
            scope: {
                followPoint: '=followPoint'
            },
            link: function(scope, element, attrs) {

                scope.scrolling = false;

                //fix point- the place in the scroll position when the item becomes fixed

                //first, must check if element is at the fix point
                angular.element($window).bind('scroll', function () {

                    angular.forEach(element, function (elem, index) {

                        var followPoint = 0;

                        if (attrs['followPoint'] && attrs['followPoint'] != '') {
                            followPoint = parseInt(attrs['followPoint']);
                        }

                        if (!scope.scrolling) {

                            rect = elem.getBoundingClientRect();

                            if (rect.top < followPoint) {
                                if (!scope.scrolling) {

                                    scope.oldPosition = element.css("position");
                                    scope.oldTop = element.css("top");

                                    scope.clone = element.clone();
                                    scope.clone.css("visibility", "hidden");
                                    element.after(scope.clone);

                                    element.css("position", "fixed");
                                    element.css("top", followPoint);
                                    element.css("width",rect.width);

                                    scope.scrolling = true;
                                }
                            }
                        } else {

                            rect = scope.clone[0].getBoundingClientRect();

                            if (rect.top >= followPoint) {

                                element.css("position", scope.oldPosition);
                                element.css("top", scope.oldTop);
                                element.css("width","");
                                scope.clone.remove();

                                scope.scrolling = false;
                            }

                        }
                    });

                });

            }
        }
    }]);

}).call(this);