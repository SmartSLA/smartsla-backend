(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientAddLogoController', ticClientAddLogoController);

  function ticClientAddLogoController($scope, selectionService, ticClientLogoService, fileUploadService) {
    var self = this;

    self.imageSelected = imageSelected;
    self.saveClientAvatar = saveClientAvatar;
    self.getClientLogo = ticClientLogoService.getClientLogo;

    ////////////

    function imageSelected() {
      return !!selectionService.getImage();
    }

    function saveClientAvatar() {
      if (selectionService.getImage()) {
        self.loading = true;
        selectionService.getBlob('image/png', function(blob) {
          var reader = new FileReader();

          reader.onloadend = function() {
            $scope.client.logo = reader.result;
            $scope.client.avatarUploader = fileUploadService.get();
            $scope.client.avatarUploader.addFile(blob);
            selectionService.clear();
            self.loading = false;
            $scope.modal.hide();
            $scope.$apply();
          };
          reader.readAsDataURL(blob);
        });
      }
    }
  }
})();
