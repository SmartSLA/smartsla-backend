'use strict';

/* global chai: false */

var expect = chai.expect;

describe('the ticClientViewController', function() {

  var $controller, ticClientLogoService, client;

  beforeEach(function() {

    client = {
      _id: '1',
      name: 'Linagora'
    };

    ticClientLogoService = {
      getClientLogo: angular.noop
    };

    angular.mock.module('linagora.esn.ticketing', function($provide) {
      $provide.value('ticClientLogoService', ticClientLogoService);
    });

    angular.mock.inject(function(_$controller_, _ticClientLogoService_) {
      $controller = _$controller_;
      ticClientLogoService = _ticClientLogoService_;
    });
  });

  function initController(ctrl) {
    var controller = $controller(ctrl, {
      client: client,
      getClientLogo: ticClientLogoService.getClientLogo
    });

    return controller;
  }

  it('should attach client to the controller', function() {
    var ctrl = initController('ticClientViewController');

    expect(ctrl.client).to.equals(client);
  });

  it('should attach getClientLogo to the controller', function() {
    var ctrl = initController('ticClientViewController');

    expect(ctrl.getClientLogo).to.equals(ticClientLogoService.getClientLogo);
  });
});
