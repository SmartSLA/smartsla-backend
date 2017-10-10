'use strict';

const conf_path = './test/config/';
const servers = require(conf_path + 'servers-conf');
const GruntfileUtils = require('./tasks/utils/Gruntfile-utils');
const timeGrunt = require('time-grunt');

module.exports = function(grunt) {
  timeGrunt(grunt);

  const gruntfileUtils = new GruntfileUtils(grunt, servers);
  const runGrunt = gruntfileUtils.runGrunt();
  const shell = gruntfileUtils.shell();
  const command = gruntfileUtils.command();

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
        src: ['Gruntfile.js', 'Gruntfile-tests.js', 'tasks/**/*.js', 'test/**/*.js', 'test/**/**/*.js', 'backend/**/*.js', 'frontend/app/**/*.js']
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
      css: {
        options: {
          rules: [
            { pattern: /important;(\s*$|(?=\s+[^\/]))/, message: 'CSS important rules only allowed with explanatory comment' }
          ]
        },
        src: [
          'frontend/app/**/*.less'
        ]
      },
      quick: {
        src: ['<%= eslint.quick.src %>']
      }
    },

    shell: {
      mongo: shell.newShell(command.mongo(false), new RegExp('connections on port ' + servers.mongodb.port), 'MongoDB server is started.'),
      redis: shell.newShell(command.redis, /on port/, 'Redis server is started')
    },

    run_grunt: {
      midway_backend: runGrunt.newProcess(['test-midway-backend']),
      unit_backend: runGrunt.newProcess(['test-unit-backend']),
      unit_frontend: runGrunt.newProcess(['test-frontend'])
    },

    puglint: {
      all: {
        options: {
          config: {
            disallowAttributeInterpolation: true,
            disallowLegacyMixinCall: true,
            validateExtensions: true,
            validateIndentation: 2
          }
        },
        src: [
          'frontend/**/*.pug'
        ]
      }
    },

    i18n_checker: {
      all: {
        options: {
          baseDir: __dirname,
          dirs: [{
            localeDir: 'backend/lib/i18n/locales',
            templateSrc: [
              'frontend/app/**/*.pug'
            ],
            core: true
          }],
          verifyOptions: {
            defaultLocale: 'en',
            locales: ['en', 'fr', 'vi'],
            rules: [
              'all-keys-translated',
              'all-locales-present',
              'default-locale-translate',
              'key-trimmed',
              'no-duplicate-among-modules',
              'no-duplicate-with-core',
              'valid-json-file'
            ]
          }
        }
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-lint-pattern');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-continue');
  grunt.loadNpmTasks('grunt-run-grunt');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-wait-server');
  grunt.loadNpmTasks('grunt-puglint');
  grunt.loadNpmTasks('grunt-i18n-checker');

  grunt.registerTask('pug-linter', 'Check the pug/jade files', ['puglint:all']);
  grunt.registerTask('linters', 'Check code for lint', ['eslint:all', 'lint_pattern:all', 'lint_pattern:css', 'pug-linter', 'i18n']);
  grunt.registerTask('i18n', 'Check the translation files', ['i18n_checker']);
  grunt.registerTask('linters-dev', 'Check changed files for lint', ['prepare-quick-lint', 'eslint:quick', 'lint_pattern:quick']);
  grunt.registerTask('spawn-servers', 'spawn servers', ['shell:mongo', 'shell:redis']);
  grunt.registerTask('kill-servers', 'kill servers', ['shell:mongo:kill', 'shell:redis:kill']);
  grunt.registerTask('setup-environment', 'create temp folders and files for tests', gruntfileUtils.setupEnvironment());
  grunt.registerTask('clean-environment', 'remove temp folder for tests', gruntfileUtils.cleanEnvironment());
  grunt.registerTask('setup-servers', ['spawn-servers', 'continue:on']);
  grunt.registerTask('test-midway-backend', ['setup-environment', 'setup-servers', 'run_grunt:midway_backend', 'kill-servers', 'clean-environment']);
  grunt.registerTask('test-unit-backend', 'Test backend code', ['run_grunt:unit_backend']);
  grunt.registerTask('test-unit-frontend', 'Test frontend code', ['run_grunt:unit_frontend']);
  grunt.registerTask('test', ['linters', 'test-unit-frontend', 'test-unit-backend', 'test-midway-backend']);
  grunt.registerTask('default', ['test']);
};
