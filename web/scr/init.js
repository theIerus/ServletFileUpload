var myApp = angular.module("myApp",[]);

myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    console.log(element[0].files[0]);
                });
            });
        }
    };
}]);

myApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file.slice(0,100));
        fd.append('param',"bla bla bla");
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(){
            })
            .error(function(){
            });
    };

    this.initFileUpload = function(file){
        var fd = new FormData();
        fd.append('username',"repnikov");
        fd.append('fileName', file.name);
        fd.append('fileModifyDate',file.lastModified);
        fd.append("fileSize",file.size);

        $http.post("/upload/init",fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
        }).then(function(response){
            if(fd.has('file')){
                fd.delete('file');
            }

            fd.append('file',file.slice(response.data.nextChunkStartIndex,response.data.nextChunkEndIndex));

            $http.post("/upload/chunk",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        },function(){

        });
    };

}]);

myApp.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){

/*    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var uploadUrl = "/upload/init";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };*/

    $scope.uploadFile = function(){
        fileUpload.initFileUpload($scope.myFile);
    }

}]);