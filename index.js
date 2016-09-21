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
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.wrapper', 'webserver-wrapper')
  ],

  states: {
    lib: function(dependencies, callback) {
      const ticketinglib = require('./backend/lib')(dependencies);
      const ticketing = require('./backend/webserver/api/ticketing')(dependencies);

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
      const app = require('./backend/webserver')(dependencies, this);
      // Register every exposed endpoints
      app.use('/', this.api.ticketing);

      const webserverWrapper = dependencies('webserver-wrapper');
      // Register every exposed frontend scripts
      const jsFiles = glob.sync([
        FRONTEND_JS_PATH + 'tic.app.js',
        FRONTEND_JS_PATH + 'tic.app.config.js',
        FRONTEND_JS_PATH + 'tic.app.router.js',
        FRONTEND_JS_PATH + '*/!(*spec).js'
      ]).map(function(filepath) {
        return filepath.replace(FRONTEND_JS_PATH, '');
      });
      webserverWrapper.injectAngularAppModules(linagoraEsnTicketing, jsFiles, [linagoraEsnTicketing], ['esn']);
      const lessFile = path.resolve(__dirname, './frontend/app/ticketing/tic-home.less');
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
