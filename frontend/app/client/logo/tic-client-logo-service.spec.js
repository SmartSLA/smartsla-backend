'use strict';

/* global chai: false */

describe('The ticClientApi service', function() {
  var ticClientLogoService;
  var expect = chai.expect;

  beforeEach(function() {
    angular.mock.module('linagora.esn.ticketing');

    angular.mock.inject(function(_ticClientLogoService_) {
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  describe('the getClientLogo function', function() {
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
});
