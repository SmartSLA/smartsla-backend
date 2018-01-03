'use stric';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The TicketingAttachmentsController', function() {
  var $rootScope, $controller;
  var notificationFactory, fileUploadService;

  beforeEach(function() {
    module('linagora.esn.ticketing');

    inject(function(
      _$rootScope_,
      _$controller_,
      _notificationFactory_,
      _fileUploadService_
    ) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      notificationFactory = _notificationFactory_;
      fileUploadService = _fileUploadService_;
    });
  });

  function initController() {
    var $scope = $rootScope.$new();

    var controller = $controller('TicketingAttachmentsController', { $scope: $scope });

    controller.$onInit();
    $scope.$digest();

    return controller;
  }

  describe('The onAttachmentsSelect function', function() {
    it('should not upload file if it has size bigger than 5MB', function() {
      var file = {
        name: 'image.png',
        size: 10000000
      };
      var controller = initController();

      notificationFactory.weakError = sinon.spy();
      controller.onAttachmentsSelect([file]);

      expect(notificationFactory.weakError).to.have.been.calledWith('', 'File %s ignored as its size exceeds the %s limit');
    });

    it('should call fileUploadService to upload files', function() {
      var file = {
        name: 'image.png',
        size: 1000
      };
      var controller = initController();
      var fileUploadServiceStartMock = sinon.spy();

      fileUploadService.get = sinon.stub().returns({
        addFile: function() {
          var defer = $q.defer();

          defer.resolve({
            response: {
              blobId: '1234'
            }
          });

          return {
            defer: defer
          };
        },
        start: fileUploadServiceStartMock
      });
      controller.onAttachmentsSelect([file]);

      expect(fileUploadServiceStartMock).to.have.been.calledOnce;
    });
  });

  describe('The removeAttachment function', function() {
    it('should cancel an ongoing upload', function(done) {
      var controller = initController();
      var attachment = {
        upload: {
          cancel: function() {
            expect(controller.attachments).to.deep.equal([{ blobId: '1' }]);
            done();
          }
        }
      };

      controller.attachments = [attachment, { blobId: '1' }];
      controller.removeAttachment(attachment);
    });
  });
});
