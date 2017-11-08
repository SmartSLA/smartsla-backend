'use strict';

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .commandDir('./commands')
  .demand(1, 'You need to specify a command')
  .alias('help', 'h')
  .help()
  .version()
  .epilogue('for more information, go to https://open-paas.org')
  .argv;
