(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .controller('ticClientFormLogoController', ticClientFormLogoController);

  function ticClientFormLogoController($scope, selectionService, ticClientLogoService, fileUploadService) {
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
            $scope.client.logoAsBase64 = reader.result;
            $scope.client.logoUploader = fileUploadService.get();
            $scope.client.logoUploader.addFile(blob);
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
