'use strict';

module.exports = function(config) {
  config.set({
    basePath: '../../',
    files: [
      'frontend/components/chai/chai.js',
      'node_modules/chai-shallow-deep-equal/chai-shallow-deep-equal.js',
      'frontend/components/jquery/dist/jquery.min.js',
      'frontend/components/angular/angular.min.js',
      'frontend/components/angular-ui-router/release/angular-ui-router.min.js',
      'frontend/components/angular-mocks/angular-mocks.js',
      'frontend/components/dynamic-directive/dist/dynamic-directive.min.js',
      'frontend/components/angular-component/dist/angular-component.min.js',
      'frontend/app/tic.app.js',
      'frontend/app/**/*.js',
      'frontend/app/**/*.jade',
      'frontend/app/*.js'

    ],
    frameworks: ['mocha'],
    colors: true,
    singleRun: true,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    reporters: ['coverage', 'spec'],
    preprocessors: {
      'frontend/app/**/*.js': ['coverage'],
      '**/*.jade': ['ng-jade2module']
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-ng-jade2module-preprocessor'
    ],

    coverageReporter: {type: 'text', dir: '/tmp'},

    ngJade2ModulePreprocessor: {
      stripPrefix: 'frontend',
      prependPrefix: '/linagora.esn.ticketing',
      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('templates')
      jadeRenderConfig: {
        __: function(str) {
          return str;
        }
      },
      moduleName: 'jadeTemplates'
    }

  });
};
