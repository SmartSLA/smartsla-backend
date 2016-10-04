'use strict';

const util = require('util');
const fs = require('fs-extra');
const path = require('path');

function _args(grunt) {
  const opts = ['test', 'chunk', 'ci', 'reporter'];
  const args = {};

  opts.forEach(optName => {
    var opt = grunt.option(optName);

    if (opt) {
      args[optName] = '' + opt;
    }
  });

  return args;
}

function _taskEndIfMatch(grunt, regexSuccess, infoSuccess, regexFailed) {
  let taskIsDone = false;

  return function(chunk, done) {
    if (taskIsDone) { return; }

    if (regexSuccess || regexFailed) {
      done = done || grunt.task.current.async();
      if (regexSuccess && regexSuccess.test(String(chunk))) {
        taskIsDone = true;
        grunt.log.oklns(infoSuccess);

        done(true);
      } else if (regexFailed && regexFailed.test(String(chunk))) {
        taskIsDone = true;
        grunt.log.error(chunk);

        done(false);
      }
    }
  };
}

function GruntfileUtils(grunt, servers) {
  this.grunt = grunt;
  this.servers = servers;
  this.args = _args(grunt);
}

GruntfileUtils.prototype.command = function command() {
  const servers = this.servers;
  const commandObject = {};

  commandObject.redis = util.format('%s --port %s %s %s',
    servers.redis.cmd,
    (servers.redis.port ? servers.redis.port : '23457'),
    (servers.redis.pwd ? '--requirepass' + servers.redis.pwd : ''),
    (servers.redis.conf_file ? servers.redis.conf_file : ''));

  commandObject.mongo = function() {
    return util.format('%s --dbpath %s --port %s %s',
      servers.mongodb.cmd,
      servers.mongodb.dbpath,
      (servers.mongodb.port ? servers.mongodb.port : '23456'),
      '--nojournal');
  };

  return commandObject;
};

GruntfileUtils.prototype.shell = function shell() {
  const grunt = this.grunt;

  return {
    newShell(command, regex, info) {
      return {
        command: command,
        options: {
          async: false,
          stdout: _taskEndIfMatch(grunt, regex, info),
          stderr: grunt.log.error,
          canKill: true
        }
      };
    }
  };
};

GruntfileUtils.prototype.runGrunt = function runGrunt() {
  const grunt = this.grunt;
  const args = this.args;

  function _process(res) {
    if (res.fail) {
      grunt.config.set('esn.tests.success', false);
      grunt.log.writeln('failed');
    } else {
      grunt.config.set('esn.tests.success', true);
      grunt.log.writeln('succeeded');
    }
  }

  return {
    newProcess(task) {
      return {
        options: {
          log: true,
          stdout: grunt.log.write,
          stderr: grunt.log.error,
          args: args,
          process: _process,
          task: task
        },
        src: ['Gruntfile-tests.js']
      };
    }
  };
};

GruntfileUtils.prototype.setupEnvironment = function setupEnvironment() {
  const servers = this.servers;

  return function() {
    try {
      fs.mkdirsSync(servers.mongodb.dbpath);
      fs.mkdirsSync(servers.tmp);
    } catch (err) {
      throw err;
    }
  };
};

GruntfileUtils.prototype.cleanEnvironment = function cleanEnvironment() {
  const grunt = this.grunt;
  const servers = this.servers;

  return function() {
    function _removeAllFilesInDirectory(directory) {
      let files;

      try {
        files = fs.readdirSync(directory);
      } catch (e) {
        return;
      }
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          var filePath = directory + '/' + files[i];

          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          } else {
            _removeAllFilesInDirectory(filePath);
          }
        }
      }
      try {
        fs.rmdirSync(directory);
      } catch (e) {
        console.error(e);
      }
    }

    const testsFailed = !grunt.config.get('esn.tests.success');
    const applog = path.join(servers.tmp, 'application.log');

    if (testsFailed && fs.existsSync(applog)) {
      fs.copySync(applog, 'application.log');
    }
    _removeAllFilesInDirectory(servers.tmp);

    if (testsFailed) {
      grunt.log.writeln('Tests failure');
      grunt.fail.fatal('error', 3);
    }

    const done = this.async();

    done(true);
  };
};

module.exports = GruntfileUtils;
