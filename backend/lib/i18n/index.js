'use strict';

const i18n = require('i18n');

i18n.configure(
  {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'vi'],
    directory: __dirname + '/locales',
    updateFiles: false,
    indent: '  ',
    extension: '.json',
    cookie: 'locale'
  }
);

module.exports = function() {
  return i18n;
};
