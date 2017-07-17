(function() {
  'use strict';

  angular.module('linagora.esn.ticketing')
    .factory('ticClientLogoService', ticClientLogoService);

  function ticClientLogoService($q) {

    return {
      getClientLogo: getClientLogo,
      handleLogoUpload: handleLogoUpload
    };

    ////////////

    function getClientLogo(client) {
      if (client) {
        if (client.logoAsBase64) {
          return client.logoAsBase64;
        } else if (client.logo) {
          return String('/api/files/' + client.logo);
        }
      }

      return '/linagora.esn.ticketing/app/client/logo/default_logo.png';
    }

    function handleLogoUpload(client) {
      if (client.logoUploader) {
        client.logoUploader.start();

        return client.logoUploader.await(
          function(result) {
            var logoUploadTask = result[0];
            var logoFile = logoUploadTask.response.data;

            client.logo = logoFile._id;

            delete client.logoUploader;
            delete client.logoAsBase64;

            return $q.when(client);
          }, function(error) {

            return $q.reject({data: error});
          });
      }

      return $q.when(client);

    }
  }
})();
