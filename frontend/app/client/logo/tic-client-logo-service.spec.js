'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The ticClientLogo service', function() {
  var $rootScope, ticClientLogoService;

  beforeEach(function() {
    angular.mock.module('linagora.esn.ticketing');

    angular.mock.inject(function(_$rootScope_, _ticClientLogoService_) {
      $rootScope = _$rootScope_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  describe('the getClientLogo function', function() {
    it('should return client.logoAsBase64 if it exists', function() {
      var client = {
        logoAsBase64: '1234'
      };

      expect(ticClientLogoService.getClientLogo(client)).to.equal(client.logoAsBase64);
    });

    it('should return client.logo if it exists', function() {
      var client = {
        logo: '1234'
      };

      expect(ticClientLogoService.getClientLogo(client)).to.equal('/api/files/1234');
    });

    it('should return the default logo if client.logo is undefined', function() {
      var client = {};

      expect(ticClientLogoService.getClientLogo(client)).to.equal('/linagora.esn.ticketing/app/client/logo/default_logo.png');
    });
  });

  describe('the handleLogoUpload function', function() {
    var client;
    var result;

    it('should do nothing if no new logo is defined', function() {
      client = { name: 'Test', logo: 'test' };

      ticClientLogoService.handleLogoUpload(client)
        .then(function(data) {
          result = data;
        });

      $rootScope.$digest();

      expect(result).to.deep.equals(client);
    });

    it('should upload logo file, get file id and save previous logo id', function() {
      var fileApiResponse = [{ response: { data: { _id: 'test' } } }];
      var logoUploader = {
        start: sinon.spy(),
        await: sinon.spy(function(done) {
          return done(fileApiResponse);
        })
      };

      client = { name: 'Test', logoAsBase64: 'base64' };
      client.logoUploader = logoUploader;

      ticClientLogoService.handleLogoUpload(client)
        .then(function(data) {
          result = data;
        });

      $rootScope.$digest();

      expect(logoUploader.start).to.have.been.calledWith;
      expect(logoUploader.await).to.have.been.called;
      expect(result.logoUploader).to.be.undefined;
      expect(result.logoAsBase64).to.be.undefined;
      expect(result.logo).to.equals('test');
    });
  });
});
