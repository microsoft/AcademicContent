(function() {

    function mainController($http) {
        this.$http = $http;
        this.analysis = {
            inProgress: false
        };
        this.images = [];
        this.current = null;
        this.searchText = '';
        this.imageFilter = imageFilter.bind(this);
        this.loadImageList();

        function imageFilter(img) {
            var search = this.searchText;
            var tags = img && img.metadata && img.metadata.tags;

            if(!search || !tags) {
                return true;
            }

            if(containsText(tags, search)) {
                return true;
            }

            return false;
        }
    }
    mainController.prototype = {

        clearSearchText: function() {
            this.searchText = '';
        },

        imageFileSelected: function(file) {
            var ctrl = this, formData;
            ctrl.analysis = {
                inProgress: true
            };
            formData = new FormData();
            formData.append('imageFile', file);
            ctrl.$http
                .post('/api/image-upload', formData, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function(result) {
                    ctrl.analysis = {
                        inProgress: false,
                        result: result.data
                    };
                    ctrl.loadImageList();
                })
                .catch(function(err) {
                    ctrl.analysis = {
                        inProgress: false,
                        error: err.data || { message: err.statusText }
                    };
                });
        },

        loadImageList: function() {
            var ctrl = this;
            ctrl.$http.get('/api/images')
                .then(function(result) {
                    ctrl.images = result.data.entries || [];
                })
                .catch(function(err) {
                    alert((err.data && err.data.message) || err.toString());
                });
        },

        showImageDetails: function(img) {
            this.current = img;
            angular.element("#imageModal").modal();
        }
    };

    function fileContentBinderDirective() {
        return {
            restrict: 'A',
            scope: {
                onFileSelected: '&'
            },
            link: function(scope, element) {
                element.on('change', function() {
                    scope.$apply(function() {
                        scope.onFileSelected({
                            file: element[0].files[0]
                        });
                    });
                });
            }
        };
    }

    function containsText(text, search) {
        return (text && search) ? (text.toLowerCase().indexOf(search.toLowerCase()) > -1) : false;
    }

    angular
        .module('myApp', [])
        .controller('mainCtrl', ['$http', mainController])
        .directive('onFileSelected', [fileContentBinderDirective]);

}());