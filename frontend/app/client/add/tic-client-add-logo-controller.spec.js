'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('the ticClientAddLogoController', function() {

  var $rootscope, $scope, $controller, $window, selectionService, fileUploadService, addFileSpy;

  beforeEach(function() {
    addFileSpy = sinon.spy();

    selectionService = {
      clear: sinon.spy(),
      getImage: sinon.spy(function() {
        return true;
      }),
      getBlob: sinon.spy()
    };

    fileUploadService = {
      get: function() {
        return {
          addFile: addFileSpy
        };
      }
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('selectionService', selectionService);
      $provide.value('fileUploadService', fileUploadService);
    });

    angular.mock.inject(function(_$rootScope_, _$controller_, _$window_, _selectionService_, _fileUploadService_) {
      $rootscope = _$rootScope_;
      $scope = $rootscope.$new();
      $controller = _$controller_;
      $window = _$window_;
      selectionService = _selectionService_;
      fileUploadService = _fileUploadService_;
    });
  });

  function initController() {
    var controller = $controller('ticClientAddLogoController', {
      $scope: $scope
    });

    $scope.client = {};
    $scope.$digest();

    return controller;
  }

  describe('the imageSelected method', function() {
    it('should leverage the selectionService.getImage', function() {
      expect(initController().imageSelected()).to.be.true;
    });
  });

  describe('the saveClientAvatar method', function() {
    it('should do nothing if no image is selected', function() {
      selectionService.getImage = sinon.spy(function() {
        return false;
      });

      initController().saveClientAvatar();

      expect(selectionService.getImage).to.have.been.calledWith();
      expect($scope.client.logo).to.not.exist;
    });

    it('should expose loading = true', function() {
      var ctrl = initController();

      ctrl.saveClientAvatar();

      expect(selectionService.getImage).to.have.been.calledWith();
      expect(ctrl.loading).to.be.true;
    });

    it('should add the logo as base64 string to the client and close the modal', function() {
      var blob = 'theblob';
      var imageAsBase64 = 'image';

      $scope.modify = function() {
        return $q.when($scope.client);
      };

      $window.FileReader = function() {
        return {
          readAsDataURL: function(data) {
            expect(data).to.equal(blob);
            this.result = imageAsBase64;
            this.onloadend();
          }
        };
      };

      selectionService.getBlob = function(mimetype, callback) {
        return callback(blob);
      };

      $scope.modal = {
        hide: sinon.spy()
      };

      var ctrl = initController();

      ctrl.saveClientAvatar();

      expect(ctrl.loading).to.be.false;
      expect($scope.modal.hide).to.have.been.called;
      expect(addFileSpy).to.have.been.called;
      expect($scope.client.logo).to.equal(imageAsBase64);
    });
  });

});
