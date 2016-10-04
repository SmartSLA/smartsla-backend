'use strict';

module.exports = function(grunt) {
  const CI = grunt.option('ci');

  let KARMA_REPORTERS = (grunt.option('reporter') || '').split(',').filter(Boolean);

  if (!KARMA_REPORTERS.length) {
    KARMA_REPORTERS = CI ? ['spec', 'coverage'] : ['dots'];
  }

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      }
    },

    splitfiles: {
      options: {
        chunk: 10
      },
      backend: {
        options: {
          common: ['test/unit-backend/all.js'],
          target: 'mochacli:backend'
        },
        files: {
          src: ['test/unit-backend/**/*.js']
        }
      },
      midway: {
        options: {
          common: ['test/midway-backend/all.js'],
          target: 'mochacli:midway'
        },
        files: {
          src: ['test/midway-backend/**/*.js']
        }
      }
    },

    mochacli: {
      options: {
        require: ['chai', 'mockery'],
        reporter: 'spec',
        timeout: process.env.TEST_TIMEOUT || 20000,
        env: {
          ESN_CUSTOM_TEMPLATES_FOLDER: 'testscustom'
        }
      },
      backend: {
        options: {
          files: ['test/unit-backend/all.js', grunt.option('test') || 'test/unit-backend/**/*.js']
        }
      },
      midway: {
        options: {
          files: ['test/midway-backend/all.js', grunt.option('test') || 'test/midway-backend/**/*.js']
        }
      }
    },

    karma: {
      unit: {
        configFile: './test/config/karma.conf.js',
        browsers: ['PhantomJS'],
        reporters: KARMA_REPORTERS
      },
      all: {
        configFile: './test/config/karma.conf.js',
        browsers: ['PhantomJS', 'Firefox', 'Chrome'],
        reporters: KARMA_REPORTERS
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-karma');

  grunt.loadTasks('tasks');

  grunt.registerTask('test-unit-backend', 'run the backend unit tests (to be used with .only)', ['splitfiles:backend']);
  grunt.registerTask('test-midway-backend', 'run midway tests (to be used with .only)', ['splitfiles:midway']);
  grunt.registerTask('test-backend', 'run both the unit & midway tests', ['test-unit-backend', 'test-midway-backend']);

  grunt.registerTask('test-frontend', 'run the FrontEnd tests', ['karma:unit']);
  grunt.registerTask('test-frontend-all', 'run the FrontEnd tests on all possible browsers', ['karma:all']);

  grunt.registerTask('test', ['linters', 'test-backend', 'test-midway-backend']);
  grunt.registerTask('default', ['test']);
};
