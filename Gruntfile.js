'use strict';

const timeGrunt = require('time-grunt');

module.exports = function(grunt) {
  timeGrunt(grunt);

  grunt.initConfig({
    eslint: {
      options: {
        config: '.eslintrc'
      },
      quick: {
        src: [],
        options: {
          quiet: true
        }
      },
      all: {
        src: ['Gruntfile.js', 'Gruntfile-tests.js', 'tasks/**/*.js', 'test/**/*.js', 'test/**/**/*.js', 'backend/**/*.js']
      }
    },

    lint_pattern: {
      options: {
        rules: [
          { pattern: /(describe|it)\.only/, message: 'Must not use .only in tests' }
        ]
      },
      all: {
        src: ['<%= eslint.all.src %>']
      },
      quick: {
        src: ['<%= eslint.quick.src %>']
      }
    },

    splitfiles: {
      options: {
        chunk: 1
      },
      midway: {
        options: {
          common: ['test/midway-backend/all.js'],
          target: 'mochacli:midway'
        },
        files: {
          src: ['test/midway-backend/**/*.js']
        }
      },
      storage: {
        options: {
          common: ['test/unit-storage/all.js'],
          target: 'mochacli:storage'
        },
        files: {
          src: ['test/unit-storage/**/*.js']
        }
      }
    },
    mochacli: {
      options: {
        require: ['chai', 'mockery'],
        reporter: 'spec',
        timeout: process.env.TEST_TIMEOUT || 30000
      },
      backend: {
        options: {
          files: ['test/unit-backend/all.js', grunt.option('test') || 'test/unit-backend/**/*.js']
        }
      },
      storage: {
        options: {
          files: ['test/unit-storage/all.js', grunt.option('test') || 'test/unit-storage/**/*.js']
        }
      }
    },

    karma: {
      unit: {
        configFile: './test/config/karma.conf.js',
        browsers: ['PhantomJS']
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('@linagora/grunt-lint-pattern');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-puglint');
  grunt.loadNpmTasks('@linagora/grunt-i18n-checker');

  grunt.loadTasks('tasks');
  grunt.registerTask('i18n', 'Check the translation files', ['i18n_checker']);
  grunt.registerTask('pug-linter', 'Check the pug/jade files', ['puglint:all']);
  grunt.registerTask('linters', 'Check code for lint', ['eslint:all', 'lint_pattern:all']);
  grunt.registerTask('linters-dev', 'Check changed files for lint', ['prepare-quick-lint', 'eslint:quick', 'lint_pattern:quick']);
  grunt.registerTask('test-midway-backend', ['splitfiles:midway']);
  grunt.registerTask('test-unit-storage', ['splitfiles:storage']);
  grunt.registerTask('test-unit-backend', 'Test backend code', ['mochacli:backend']);

  grunt.registerTask('test', ['linters', 'test-unit-backend', 'test-unit-storage']);
  grunt.registerTask('default', ['test']);
};
