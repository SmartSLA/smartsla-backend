'use strict';

module.exports = {
  command: 'elasticsearch',
  desc: 'Elasticsearch Management',
  builder: yargs => yargs.commandDir('elasticsearch_cmds').demandCommand(1, 'Please specify a command'),
  handler: () => {}
};
