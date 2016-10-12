'use strict';

const AwesomeModule = require('awesome-module');
const Dependency = AwesomeModule.AwesomeModuleDependency;
const path = require('path');
const glob = require('glob-all');
const linagoraEsnTicketing = 'linagora.esn.ticketing';
const FRONTEND_JS_PATH = __dirname + '/frontend/app/';

const myAwesomeModule = new AwesomeModule(linagoraEsnTicketing, {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.logger', 'logger'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.wrapper', 'webserver-wrapper'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.db', 'db'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.authorization', 'authorizationMW')
  ],

  states: {
    lib: function(dependencies, callback) {
      const ticketinglib = require('./backend/lib')(dependencies);
      const ticketing = require('./backend/webserver/api')(dependencies, ticketinglib);

      const lib = {
        api: {
          ticketing: ticketing
        },
        lib: ticketinglib
      };

      return callback(null, lib);
    },

    deploy: function(dependencies, callback) {
      // Register the webapp
      const app = require('./backend/webserver/application')(dependencies, this);
      // Register every exposed endpoints
      app.use('/api', this.api.ticketing);

      const webserverWrapper = dependencies('webserver-wrapper');
      // Register every exposed frontend scripts
      const jsFiles = glob.sync([
        FRONTEND_JS_PATH + 'tic.app.js',
        FRONTEND_JS_PATH + '*.js',
        FRONTEND_JS_PATH + '*/!(*spec).js',
        FRONTEND_JS_PATH + '**/*/!(*spec).js'
      ]).map(function(filepath) {
        return filepath.replace(FRONTEND_JS_PATH, '');
      });
      webserverWrapper.injectAngularAppModules(linagoraEsnTicketing, jsFiles, [linagoraEsnTicketing], ['esn']);
      const lessFile = path.resolve(__dirname, './frontend/app/ticketing/ticketing.less');
      webserverWrapper.injectLess(linagoraEsnTicketing, [lessFile], 'esn');
      webserverWrapper.addApp(linagoraEsnTicketing, app);

      return callback();
    }
  }
});

/**
 * The main AwesomeModule describing the application.
 * @type {AwesomeModule}
 */
module.exports = myAwesomeModule;
