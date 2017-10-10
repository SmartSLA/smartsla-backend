'use strict';

module.exports = function(grunt) {
  grunt.registerTask('prepare-quick-lint', function() {
    const done = this.async();
    const spawn = require('child_process').spawn;
    const revision = grunt.option('r');
    const gitopts = revision ?
      ['diff-tree', '--no-commit-id', '--name-only', '-r', revision] :
      ['status', '--short', '--porcelain', '--untracked-files=no'];

    const child = spawn('git', gitopts);
    let output = '';

    child.stdout.on('data', data => (output += data));
    child.stdout.on('end', () => {
      const files = [];

      output.split('\n').forEach(line => {
        const filename = revision ? line : line.substr(3);
        const status = revision ? '' : line.substr(0, 3).trim();

        if (status !== 'D' && filename.substr(-3, 3) === '.js') {
          files.push(filename);
        }
      });
      if (files.length) {
        grunt.log.ok('Running linters on files:');
        grunt.log.oklns(grunt.log.wordlist(files));
      } else {
        grunt.log.ok('No changed files');
      }
      grunt.config.set('eslint.quick.src', files);

      done();
    });
  });
};
